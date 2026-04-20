package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.entity.SecondHand;
import com.campus.entity.TradeRecord;
import com.campus.entity.User;
import com.campus.mapper.SecondHandMapper;
import com.campus.mapper.TradeRecordMapper;
import com.campus.mapper.UserMapper;
import com.campus.service.TradeRecordService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TradeRecordServiceImpl implements TradeRecordService {

    private final TradeRecordMapper tradeRecordMapper;
    private final SecondHandMapper secondHandMapper;
    private final UserMapper userMapper;

    public TradeRecordServiceImpl(TradeRecordMapper tradeRecordMapper,
                                  SecondHandMapper secondHandMapper,
                                  UserMapper userMapper) {
        this.tradeRecordMapper = tradeRecordMapper;
        this.secondHandMapper = secondHandMapper;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional
    public TradeRecord create(Long itemId, Long buyerId, String remark) {
        SecondHand goods = secondHandMapper.selectById(itemId);
        if (goods == null) throw new RuntimeException("商品不存在");
        if (!goods.getStatus().equals(1)) throw new RuntimeException("商品已下架或已售出");
        if (goods.getUserId().equals(buyerId)) throw new RuntimeException("不能购买自己的商品");

        // 查找是否已有待确认的交易记录
        LambdaQueryWrapper<TradeRecord> q = new LambdaQueryWrapper<>();
        q.eq(TradeRecord::getItemId, itemId)
         .eq(TradeRecord::getBuyerId, buyerId)
         .eq(TradeRecord::getStatus, 0);
        if (tradeRecordMapper.selectCount(q).intValue() > 0) {
            throw new RuntimeException("您已发起过交易请求，请等待处理");
        }

        TradeRecord record = new TradeRecord();
        record.setItemId(itemId);
        record.setSellerId(goods.getUserId());
        record.setBuyerId(buyerId);
        record.setItemTitle(goods.getTitle());
        record.setPrice(goods.getPrice());
        record.setStatus(0);
        record.setRemark(remark);
        record.setCreateTime(LocalDateTime.now());
        tradeRecordMapper.insert(record);
        return record;
    }

    @Override
    @Transactional
    public void confirm(Long recordId, Long userId) {
        TradeRecord record = tradeRecordMapper.selectById(recordId);
        if (record == null) throw new RuntimeException("交易记录不存在");
        if (!record.getSellerId().equals(userId)) throw new RuntimeException("只有卖家可以确认收货");
        if (record.getStatus() != 0) throw new RuntimeException("该交易已处理");

        record.setStatus(1); // 已完成
        record.setUpdateTime(LocalDateTime.now());
        tradeRecordMapper.updateById(record);

        // 商品状态改为已售出
        SecondHand goods = secondHandMapper.selectById(record.getItemId());
        if (goods != null) {
            goods.setStatus(2); // 已售出
            secondHandMapper.updateById(goods);
        }
    }

    @Override
    @Transactional
    public void cancel(Long recordId, Long userId) {
        TradeRecord record = tradeRecordMapper.selectById(recordId);
        if (record == null) throw new RuntimeException("交易记录不存在");
        // 买家或卖家都可以取消
        if (!record.getBuyerId().equals(userId) && !record.getSellerId().equals(userId)) {
            throw new RuntimeException("无权操作");
        }
        if (record.getStatus() != 0) throw new RuntimeException("该交易已处理");
        record.setStatus(2); // 已取消
        record.setUpdateTime(LocalDateTime.now());
        tradeRecordMapper.updateById(record);
    }

    @Override
    public List<TradeRecord> getMyBuy() {
        Long userId = getCurrentUserId();
        if (userId == null) return List.of();
        LambdaQueryWrapper<TradeRecord> q = new LambdaQueryWrapper<>();
        q.eq(TradeRecord::getBuyerId, userId)
         .orderByDesc(TradeRecord::getCreateTime);
        List<TradeRecord> records = tradeRecordMapper.selectList(q);
        fillUserInfo(records);
        return records;
    }

    @Override
    public List<TradeRecord> getMySell() {
        Long userId = getCurrentUserId();
        if (userId == null) return List.of();
        LambdaQueryWrapper<TradeRecord> q = new LambdaQueryWrapper<>();
        q.eq(TradeRecord::getSellerId, userId)
         .orderByDesc(TradeRecord::getCreateTime);
        List<TradeRecord> records = tradeRecordMapper.selectList(q);
        fillUserInfo(records);
        return records;
    }

    @Override
    public List<TradeRecord> getPendingForSeller(Long sellerId) {
        LambdaQueryWrapper<TradeRecord> q = new LambdaQueryWrapper<>();
        q.eq(TradeRecord::getSellerId, sellerId)
         .eq(TradeRecord::getStatus, 0)
         .orderByDesc(TradeRecord::getCreateTime);
        List<TradeRecord> records = tradeRecordMapper.selectList(q);
        fillUserInfo(records);
        return records;
    }

    private Long getCurrentUserId() {
        try {
            return com.campus.utils.ServletUtils.getUserId();
        } catch (Exception e) {
            return null;
        }
    }

    private void fillUserInfo(List<TradeRecord> records) {
        for (TradeRecord r : records) {
            User buyer = userMapper.selectById(r.getBuyerId());
            User seller = userMapper.selectById(r.getSellerId());
            if (buyer != null) {
                r.setBuyerName(buyer.getUsername());
                r.setBuyerAvatar(buyer.getAvatar());
            }
            if (seller != null) {
                r.setSellerName(seller.getUsername());
                r.setSellerAvatar(seller.getAvatar());
            }
        }
    }
}
