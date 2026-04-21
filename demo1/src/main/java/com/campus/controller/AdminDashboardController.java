package com.campus.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.common.Result;
import com.campus.admin.AdminAuthHelper;
import com.campus.mapper.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/dashboard")
public class AdminDashboardController {

    private final AdminAuthHelper adminAuthHelper;
    private final UserMapper userMapper;
    private final PostMapper postMapper;
    private final NoticeMapper noticeMapper;
    private final SecondHandMapper secondHandMapper;
    private final LostFoundMapper lostFoundMapper;
    private final ClubMapper clubMapper;
    private final ActivityMapper activityMapper;
    private final CollegeNoticeMapper collegeNoticeMapper;

    public AdminDashboardController(
            AdminAuthHelper adminAuthHelper,
            UserMapper userMapper,
            PostMapper postMapper,
            NoticeMapper noticeMapper,
            SecondHandMapper secondHandMapper,
            LostFoundMapper lostFoundMapper,
            ClubMapper clubMapper,
            ActivityMapper activityMapper,
            CollegeNoticeMapper collegeNoticeMapper) {
        this.adminAuthHelper = adminAuthHelper;
        this.userMapper = userMapper;
        this.postMapper = postMapper;
        this.noticeMapper = noticeMapper;
        this.secondHandMapper = secondHandMapper;
        this.lostFoundMapper = lostFoundMapper;
        this.clubMapper = clubMapper;
        this.activityMapper = activityMapper;
        this.collegeNoticeMapper = collegeNoticeMapper;
    }

    @GetMapping("/stats")
    public Result<Map<String, Long>> stats() {
        adminAuthHelper.requireAdminId();
        Map<String, Long> m = new LinkedHashMap<>();
        m.put("users", userMapper.selectCount(new LambdaQueryWrapper<>()));
        m.put("posts", postMapper.selectCount(new LambdaQueryWrapper<>()));
        m.put("notices", noticeMapper.selectCount(new LambdaQueryWrapper<>()));
        m.put("goods", secondHandMapper.selectCount(new LambdaQueryWrapper<>()));
        m.put("lostFound", lostFoundMapper.selectCount(new LambdaQueryWrapper<>()));
        m.put("clubs", clubMapper.selectCount(new LambdaQueryWrapper<>()));
        m.put("activities", activityMapper.selectCount(new LambdaQueryWrapper<>()));
        m.put("collegeNotices", collegeNoticeMapper.selectCount(new LambdaQueryWrapper<>()));
        return Result.ok(m);
    }
}
