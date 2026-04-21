package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.Notice;
import com.campus.mapper.NoticeMapper;
import com.campus.service.NoticeService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class NoticeServiceImpl implements NoticeService {

    private final NoticeMapper noticeMapper;

    public NoticeServiceImpl(NoticeMapper noticeMapper) {
        this.noticeMapper = noticeMapper;
    }

    @Override
    public java.util.List<Notice> listTop() {
        LambdaQueryWrapper<Notice> q = new LambdaQueryWrapper<>();
        q.eq(Notice::getStatus, 1)
         .orderByDesc(Notice::getIsTop)
         .orderByDesc(Notice::getCreateTime)
         .last("LIMIT 5");
        return noticeMapper.selectList(q);
    }

    @Override
    public IPage<Notice> page(int pageNum, int pageSize) {
        Page<Notice> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Notice> q = new LambdaQueryWrapper<>();
        q.eq(Notice::getStatus, 1)
         .orderByDesc(Notice::getIsTop)
         .orderByDesc(Notice::getCreateTime);
        return noticeMapper.selectPage(page, q);
    }

    @Override
    public IPage<Notice> adminPage(int pageNum, int pageSize) {
        Page<Notice> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Notice> q = new LambdaQueryWrapper<>();
        q.orderByDesc(Notice::getIsTop).orderByDesc(Notice::getCreateTime);
        return noticeMapper.selectPage(page, q);
    }

    @Override
    public Notice getById(Long id) {
        return noticeMapper.selectById(id);
    }

    @Override
    public void incrementView(Long id) {
        Notice n = noticeMapper.selectById(id);
        if (n != null) {
            n.setViewCount(n.getViewCount() + 1);
            noticeMapper.updateById(n);
        }
    }

    @Override
    public Notice saveNotice(Notice notice, Long adminId) {
        notice.setAdminId(adminId);
        if (notice.getNoticeId() != null) {
            Notice old = noticeMapper.selectById(notice.getNoticeId());
            if (old == null) {
                throw new RuntimeException("公告不存在");
            }
            if (notice.getTitle() != null) {
                old.setTitle(notice.getTitle());
            }
            if (notice.getContent() != null) {
                old.setContent(notice.getContent());
            }
            if (notice.getType() != null) {
                old.setType(notice.getType());
            }
            if (notice.getImages() != null) {
                old.setImages(notice.getImages());
            }
            if (notice.getIsTop() != null) {
                old.setIsTop(notice.getIsTop());
            }
            if (notice.getStatus() != null) {
                old.setStatus(notice.getStatus());
            }
            noticeMapper.updateById(old);
            return noticeMapper.selectById(notice.getNoticeId());
        }
        if (notice.getStatus() == null) {
            notice.setStatus(1);
        }
        if (notice.getViewCount() == null) {
            notice.setViewCount(0);
        }
        notice.setCreateTime(LocalDateTime.now());
        noticeMapper.insert(notice);
        return noticeMapper.selectById(notice.getNoticeId());
    }

    @Override
    public void deleteNotice(Long id) {
        noticeMapper.deleteById(id);
    }
}
