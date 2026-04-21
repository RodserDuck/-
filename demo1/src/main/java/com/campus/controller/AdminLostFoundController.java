package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.admin.AdminAuthHelper;
import com.campus.common.Result;
import com.campus.entity.LostFound;
import com.campus.service.LostFoundService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/lost-found")
public class AdminLostFoundController {

    private final LostFoundService lostFoundService;
    private final AdminAuthHelper adminAuthHelper;

    public AdminLostFoundController(LostFoundService lostFoundService, AdminAuthHelper adminAuthHelper) {
        this.lostFoundService = lostFoundService;
        this.adminAuthHelper = adminAuthHelper;
    }

    @GetMapping("/list")
    public Result<IPage<LostFound>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword) {
        adminAuthHelper.requireAdminId();
        return Result.ok(lostFoundService.adminPage(pageNum, pageSize, type, status, keyword));
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        adminAuthHelper.requireAdminId();
        lostFoundService.updateStatus(id, status);
        return Result.ok();
    }
}
