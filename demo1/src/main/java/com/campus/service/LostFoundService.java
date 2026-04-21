package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.LostFound;

public interface LostFoundService {
    IPage<LostFound> page(int pageNum, int pageSize, Integer type, String keyword);
    LostFound getById(Long id);
    void incrementView(Long id);
    LostFound save(LostFound lostFound, Long userId);
    void updateStatus(Long id, Integer status);

    IPage<LostFound> adminPage(int pageNum, int pageSize, Integer type, Integer status, String keyword);
}
