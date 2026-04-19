package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.LostFound;

public interface LostFoundService {
    IPage<LostFound> page(int pageNum, int pageSize, Integer type);
    LostFound getById(Long id);
    void incrementView(Long id);
    LostFound save(LostFound lostFound, Long userId);
    void updateStatus(Long id, Integer status);
}
