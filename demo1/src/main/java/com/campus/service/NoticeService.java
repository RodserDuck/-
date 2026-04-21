package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.Notice;
import java.util.List;

public interface NoticeService {
    List<Notice> listTop();
    IPage<Notice> page(int pageNum, int pageSize);
    /** 后台：含下架等全部分页，支持按类型/关键词筛选 */
    IPage<Notice> adminPage(int pageNum, int pageSize, String type, String keyword);
    Notice getById(Long id);
    void incrementView(Long id);
    Notice saveNotice(Notice notice, Long adminId);
    void deleteNotice(Long id);
}
