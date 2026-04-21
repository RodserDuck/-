package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.admin.AdminAuthHelper;
import com.campus.common.Result;
import com.campus.entity.CollegeNotice;
import com.campus.service.CollegeNoticeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/college-notice")
public class AdminCollegeNoticeController {

    private final CollegeNoticeService collegeNoticeService;
    private final AdminAuthHelper adminAuthHelper;

    public AdminCollegeNoticeController(CollegeNoticeService collegeNoticeService,
                                        AdminAuthHelper adminAuthHelper) {
        this.collegeNoticeService = collegeNoticeService;
        this.adminAuthHelper = adminAuthHelper;
    }

    @GetMapping("/list")
    public Result<IPage<CollegeNotice>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String college,
            @RequestParam(required = false) String keyword) {
        adminAuthHelper.requireAdminId();
        return Result.ok(collegeNoticeService.adminPage(pageNum, pageSize, college, keyword));
    }

    @GetMapping("/detail/{id}")
    public Result<CollegeNotice> detail(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        CollegeNotice n = collegeNoticeService.getById(id);
        if (n == null) {
            return Result.fail("记录不存在");
        }
        return Result.ok(n);
    }

    @PostMapping("/save")
    public Result<CollegeNotice> save(@RequestBody CollegeNotice notice) {
        Long adminId = adminAuthHelper.requireAdminId();
        try {
            return Result.ok(collegeNoticeService.save(notice, adminId));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        collegeNoticeService.delete(id);
        return Result.ok();
    }
}
