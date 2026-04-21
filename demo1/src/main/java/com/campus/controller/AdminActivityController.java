package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.admin.AdminAuthHelper;
import com.campus.common.Result;
import com.campus.entity.Activity;
import com.campus.service.ActivityService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/activity")
public class AdminActivityController {

    private final ActivityService activityService;
    private final AdminAuthHelper adminAuthHelper;

    public AdminActivityController(ActivityService activityService, AdminAuthHelper adminAuthHelper) {
        this.activityService = activityService;
        this.adminAuthHelper = adminAuthHelper;
    }

    @GetMapping("/list")
    public Result<IPage<Activity>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword) {
        adminAuthHelper.requireAdminId();
        return Result.ok(activityService.adminPage(pageNum, pageSize, keyword));
    }

    @GetMapping("/detail/{id}")
    public Result<Activity> detail(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        Activity a = activityService.getById(id);
        if (a == null) return Result.fail("活动不存在");
        return Result.ok(a);
    }
}
