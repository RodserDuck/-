package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.CollegeNotice;

public interface CollegeNoticeService {

    IPage<CollegeNotice> adminPage(int pageNum, int pageSize, String college, String keyword);

    CollegeNotice getById(Long id);

    CollegeNotice save(CollegeNotice notice, Long adminId);

    void delete(Long id);
}
