package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.Notice;
import java.util.List;

public interface NoticeService {
    List<Notice> listTop();
    IPage<Notice> page(int pageNum, int pageSize);
    Notice getById(Long id);
    void incrementView(Long id);
    Notice saveNotice(Notice notice, Long adminId);
    void deleteNotice(Long id);
}
