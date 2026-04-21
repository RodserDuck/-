package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.admin.AdminAuthHelper;
import com.campus.common.Result;
import com.campus.entity.LostFoundClaimRecord;
import com.campus.service.LostFoundClaimRecordService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/lost-found-claim")
public class AdminLostFoundClaimController {

    private final LostFoundClaimRecordService claimRecordService;
    private final AdminAuthHelper adminAuthHelper;

    public AdminLostFoundClaimController(LostFoundClaimRecordService claimRecordService, AdminAuthHelper adminAuthHelper) {
        this.claimRecordService = claimRecordService;
        this.adminAuthHelper = adminAuthHelper;
    }

    @GetMapping("/list")
    public Result<IPage<LostFoundClaimRecord>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword) {
        adminAuthHelper.requireAdminId();
        return Result.ok(claimRecordService.adminPage(pageNum, pageSize, status, keyword));
    }

    @GetMapping("/detail/{id}")
    public Result<LostFoundClaimRecord> detail(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        LostFoundClaimRecord r = claimRecordService.getById(id);
        if (r == null) return Result.fail("记录不存在");
        return Result.ok(r);
    }

    @PutMapping("/{id}/approve")
    public Result<Void> approve(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        claimRecordService.approve(id);
        return Result.ok();
    }

    @PutMapping("/{id}/reject")
    public Result<Void> reject(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        claimRecordService.reject(id);
        return Result.ok();
    }
}
