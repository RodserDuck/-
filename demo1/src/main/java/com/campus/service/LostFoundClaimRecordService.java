package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.LostFoundClaimRecord;

public interface LostFoundClaimRecordService {
    IPage<LostFoundClaimRecord> adminPage(int pageNum, int pageSize, Integer status, String keyword);
    LostFoundClaimRecord getById(Long id);
    void approve(Long id);
    void reject(Long id);
    LostFoundClaimRecord submitClaim(Long lostFoundId, Long claimantId, String remark);
}
