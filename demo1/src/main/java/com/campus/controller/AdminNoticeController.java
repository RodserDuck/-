package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.common.Result;
import com.campus.admin.AdminAuthHelper;
import com.campus.entity.Notice;
import com.campus.service.NoticeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/notice")
public class AdminNoticeController {

    private final NoticeService noticeService;
    private final AdminAuthHelper adminAuthHelper;

    public AdminNoticeController(NoticeService noticeService, AdminAuthHelper adminAuthHelper) {
        this.noticeService = noticeService;
        this.adminAuthHelper = adminAuthHelper;
    }

    @GetMapping("/list")
    public Result<IPage<Notice>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
        adminAuthHelper.requireAdminId();
        return Result.ok(noticeService.adminPage(pageNum, pageSize));
    }

    @GetMapping("/detail/{id}")
    public Result<Notice> detail(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        Notice n = noticeService.getById(id);
        if (n == null) {
            return Result.fail("公告不存在");
        }
        return Result.ok(n);
    }

    @PostMapping("/save")
    public Result<Notice> save(@RequestBody Notice notice) {
        Long adminId = adminAuthHelper.requireAdminId();
        try {
            return Result.ok(noticeService.saveNotice(notice, adminId));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        noticeService.deleteNotice(id);
        return Result.ok();
    }
}
