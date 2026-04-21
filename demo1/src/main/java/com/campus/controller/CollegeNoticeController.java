package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.common.Result;
import com.campus.entity.CollegeNotice;
import com.campus.mapper.CollegeNoticeMapper;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/college-notice")
public class CollegeNoticeController {

    private final CollegeNoticeMapper collegeNoticeMapper;

    public CollegeNoticeController(CollegeNoticeMapper collegeNoticeMapper) {
        this.collegeNoticeMapper = collegeNoticeMapper;
    }

    @GetMapping("/list")
    public Result<IPage<CollegeNotice>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String college,
            @RequestParam(required = false) String keyword) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<CollegeNotice> page =
            new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(pageNum, pageSize);
        var q = new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<CollegeNotice>();
        q.eq(CollegeNotice::getStatus, 1);
        if (college != null && !college.isEmpty()) q.eq(CollegeNotice::getCollege, college);
        if (keyword != null && !keyword.trim().isEmpty()) {
            String k = keyword.trim();
            q.and(w -> w.like(CollegeNotice::getTitle, k).or().like(CollegeNotice::getContent, k));
        }
        q.orderByDesc(CollegeNotice::getCreateTime);
        return Result.ok(collegeNoticeMapper.selectPage(page, q));
    }

    @GetMapping("/detail/{id}")
    public Result<CollegeNotice> detail(@PathVariable Long id) {
        CollegeNotice n = collegeNoticeMapper.selectById(id);
        if (n != null) {
            n.setViewCount(n.getViewCount() + 1);
            collegeNoticeMapper.updateById(n);
        }
        return Result.ok(n);
    }
}
