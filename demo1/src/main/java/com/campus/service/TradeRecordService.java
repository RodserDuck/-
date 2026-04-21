package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.TradeRecord;
import java.util.List;

public interface TradeRecordService {
    TradeRecord create(Long itemId, Long buyerId, String remark);
    void confirm(Long recordId, Long userId);
    void cancel(Long recordId, Long userId);
    List<TradeRecord> getMyBuy();
    List<TradeRecord> getMySell();
    List<TradeRecord> getPendingForSeller(Long sellerId);

    IPage<TradeRecord> adminPage(int pageNum, int pageSize, Integer status, String keyword, String userKeyword);

    void adminUpdateStatus(Long recordId, Integer status);
}
