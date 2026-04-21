package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.CollegeNotice;
import com.campus.mapper.CollegeNoticeMapper;
import com.campus.service.CollegeNoticeService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CollegeNoticeServiceImpl implements CollegeNoticeService {

    private final CollegeNoticeMapper collegeNoticeMapper;

    public CollegeNoticeServiceImpl(CollegeNoticeMapper collegeNoticeMapper) {
        this.collegeNoticeMapper = collegeNoticeMapper;
    }

    @Override
    public IPage<CollegeNotice> adminPage(int pageNum, int pageSize, String college, String keyword) {
        Page<CollegeNotice> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<CollegeNotice> q = new LambdaQueryWrapper<>();
        if (college != null && !college.isEmpty()) q.eq(CollegeNotice::getCollege, college);
        if (keyword != null && !keyword.trim().isEmpty()) {
            String k = keyword.trim();
            q.and(w -> w.like(CollegeNotice::getTitle, k).or().like(CollegeNotice::getContent, k));
        }
        q.orderByDesc(CollegeNotice::getCreateTime);
        return collegeNoticeMapper.selectPage(page, q);
    }

    @Override
    public CollegeNotice getById(Long id) {
        return collegeNoticeMapper.selectById(id);
    }

    @Override
    public CollegeNotice save(CollegeNotice notice, Long adminId) {
        if (notice.getNoticeId() != null) {
            collegeNoticeMapper.updateById(notice);
            return collegeNoticeMapper.selectById(notice.getNoticeId());
        }
        notice.setAdminId(adminId);
        if (notice.getViewCount() == null) notice.setViewCount(0);
        if (notice.getStatus() == null) notice.setStatus(1);
        notice.setCreateTime(LocalDateTime.now());
        collegeNoticeMapper.insert(notice);
        return collegeNoticeMapper.selectById(notice.getNoticeId());
    }

    @Override
    public void delete(Long id) {
        collegeNoticeMapper.deleteById(id);
    }
}
