package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.SecondHand;
import com.campus.mapper.SecondHandMapper;
import com.campus.service.SecondHandService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SecondHandServiceImpl implements SecondHandService {

    private final SecondHandMapper secondHandMapper;

    public SecondHandServiceImpl(SecondHandMapper secondHandMapper) {
        this.secondHandMapper = secondHandMapper;
    }

    @Override
    public List<SecondHand> listAll() {
        return secondHandMapper.selectList(
            new LambdaQueryWrapper<SecondHand>()
                .eq(SecondHand::getStatus, 1)
                .orderByDesc(SecondHand::getCreateTime)
        );
    }

    @Override
    public IPage<SecondHand> page(int pageNum, int pageSize, Long categoryId) {
        Page<SecondHand> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<SecondHand> q = new LambdaQueryWrapper<>();
        q.eq(SecondHand::getStatus, 1);
        if (categoryId != null) q.eq(SecondHand::getCategoryId, categoryId);
        q.orderByDesc(SecondHand::getCreateTime);
        return secondHandMapper.selectPage(page, q);
    }

    @Override
    public SecondHand getById(Long id) {
        return secondHandMapper.selectById(id);
    }

    @Override
    public void incrementView(Long id) {
        SecondHand g = secondHandMapper.selectById(id);
        if (g != null) {
            g.setViewCount(g.getViewCount() + 1);
            secondHandMapper.updateById(g);
        }
    }

    @Override
    public SecondHand save(SecondHand goods, Long userId) {
        goods.setUserId(userId);
        goods.setViewCount(0);
        goods.setFavoriteCount(0);
        goods.setStatus(1);
        goods.setCreateTime(LocalDateTime.now());
        secondHandMapper.insert(goods);
        return goods;
    }

    @Override
    public void delete(Long itemId, Long userId) {
        SecondHand g = secondHandMapper.selectById(itemId);
        if (g == null) throw new RuntimeException("商品不存在");
        if (!g.getUserId().equals(userId)) throw new RuntimeException("无权删除");
        g.setStatus(0);
        secondHandMapper.updateById(g);
    }

    @Override
    public List<SecondHand> getMyGoods(Long userId) {
        return secondHandMapper.selectList(
            new LambdaQueryWrapper<SecondHand>()
                .eq(SecondHand::getUserId, userId)
                .orderByDesc(SecondHand::getCreateTime)
        );
    }
}
