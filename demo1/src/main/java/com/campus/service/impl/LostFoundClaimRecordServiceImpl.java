package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.LostFound;
import com.campus.entity.LostFoundClaimRecord;
import com.campus.entity.User;
import com.campus.mapper.LostFoundClaimRecordMapper;
import com.campus.mapper.LostFoundMapper;
import com.campus.mapper.UserMapper;
import com.campus.service.LostFoundClaimRecordService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LostFoundClaimRecordServiceImpl implements LostFoundClaimRecordService {

    private final LostFoundClaimRecordMapper claimRecordMapper;
    private final LostFoundMapper lostFoundMapper;
    private final UserMapper userMapper;

    public LostFoundClaimRecordServiceImpl(LostFoundClaimRecordMapper claimRecordMapper,
                                           LostFoundMapper lostFoundMapper,
                                           UserMapper userMapper) {
        this.claimRecordMapper = claimRecordMapper;
        this.lostFoundMapper = lostFoundMapper;
        this.userMapper = userMapper;
    }

    @Override
    public IPage<LostFoundClaimRecord> adminPage(int pageNum, int pageSize, Integer status, String keyword) {
        Page<LostFoundClaimRecord> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<LostFoundClaimRecord> q = new LambdaQueryWrapper<>();
        if (status != null) {
            q.eq(LostFoundClaimRecord::getStatus, status);
        }
        if (keyword != null && !keyword.trim().isEmpty()) {
            String k = keyword.trim();
            List<LostFound> list = lostFoundMapper.selectList(new LambdaQueryWrapper<LostFound>()
                .select(LostFound::getLostFoundId)
                .and(w -> w.like(LostFound::getTitle, k)
                    .or().like(LostFound::getItemName, k)
                    .or().like(LostFound::getDescription, k)));
            if (list.isEmpty()) {
                q.eq(LostFoundClaimRecord::getClaimId, -1L);
            } else {
                q.in(LostFoundClaimRecord::getLostFoundId, list.stream().map(LostFound::getLostFoundId).toList());
            }
        }
        q.orderByDesc(LostFoundClaimRecord::getClaimId);
        IPage<LostFoundClaimRecord> result = claimRecordMapper.selectPage(page, q);
        fillUserInfo(result.getRecords());
        return result;
    }

    @Override
    public LostFoundClaimRecord getById(Long id) {
        LostFoundClaimRecord r = claimRecordMapper.selectById(id);
        if (r != null) {
            fillUserInfo(java.util.List.of(r));
        }
        return r;
    }

    @Override
    public void approve(Long id) {
        changeStatusOnce(id, 1);
    }

    @Override
    public void reject(Long id) {
        changeStatusOnce(id, 2);
    }

    private void changeStatusOnce(Long id, Integer status) {
        LostFoundClaimRecord r = claimRecordMapper.selectById(id);
        if (r == null) throw new RuntimeException("记录不存在");
        if (status == null || (status != 1 && status != 2)) {
            throw new RuntimeException("仅允许审批为通过或驳回");
        }
        if (r.getStatus() == null || r.getStatus() != 0) {
            throw new RuntimeException("该记录已处理，不能重复审批");
        }
        r.setStatus(status);
        claimRecordMapper.updateById(r);

        // 审核状态与失物状态联动：
        // 0 待处理 -> 失物状态=0(待处理)
        // 1 已匹配 -> 失物状态=2(已找到)
        // 2 已驳回 -> 失物状态=1(进行中)
        LostFound lostFound = lostFoundMapper.selectById(r.getLostFoundId());
        if (lostFound != null) {
            if (status == 1) {
                lostFound.setStatus(2);
            } else if (status == 2) {
                lostFound.setStatus(1);
            } else {
                lostFound.setStatus(0);
            }
            lostFoundMapper.updateById(lostFound);
        }
    }

    @Override
    public LostFoundClaimRecord submitClaim(Long lostFoundId, Long claimantId, String remark) {
        LostFound lostFound = lostFoundMapper.selectById(lostFoundId);
        if (lostFound == null) {
            throw new RuntimeException("失物记录不存在");
        }
        if (claimantId == null) {
            throw new RuntimeException("认领用户不存在");
        }
        if (lostFound.getStatus() != null && lostFound.getStatus() == 2) {
            throw new RuntimeException("该物品已找到，不能再次认领");
        }
        Long exists = claimRecordMapper.selectCount(new LambdaQueryWrapper<LostFoundClaimRecord>()
                .eq(LostFoundClaimRecord::getLostFoundId, lostFoundId)
                .eq(LostFoundClaimRecord::getClaimantId, claimantId));
        if (exists != null && exists > 0) {
            throw new RuntimeException("你已提交过该认领申请");
        }
        LostFoundClaimRecord record = new LostFoundClaimRecord();
        record.setLostFoundId(lostFoundId);
        record.setPublisherId(lostFound.getUserId());
        record.setClaimantId(claimantId);
        record.setType(lostFound.getType());
        record.setStatus(0);
        record.setRemark(remark);
        record.setClaimTime(LocalDateTime.now());
        claimRecordMapper.insert(record);

        // 新增认领记录后，来源失物进入“待处理”状态。
        lostFound.setStatus(0);
        lostFoundMapper.updateById(lostFound);

        fillUserInfo(java.util.List.of(record));
        return record;
    }

    private void fillUserInfo(List<LostFoundClaimRecord> list) {
        if (list == null || list.isEmpty()) return;
        for (LostFoundClaimRecord r : list) {
            User p = userMapper.selectById(r.getPublisherId());
            User c = userMapper.selectById(r.getClaimantId());
            if (p != null) r.setPublisherName(p.getUsername());
            if (c != null) r.setClaimantName(c.getUsername());
        }
    }
}
