package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.admin.AdminAuthHelper;
import com.campus.common.Result;
import com.campus.entity.User;
import com.campus.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/user")
public class AdminUserController {

    private final UserService userService;
    private final AdminAuthHelper adminAuthHelper;

    public AdminUserController(UserService userService, AdminAuthHelper adminAuthHelper) {
        this.userService = userService;
        this.adminAuthHelper = adminAuthHelper;
    }

    @GetMapping("/list")
    public Result<IPage<User>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String keyword) {
        adminAuthHelper.requireAdminId();
        return Result.ok(userService.adminPage(pageNum, pageSize, keyword));
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        adminAuthHelper.requireAdminId();
        userService.updateStatus(id, status);
        return Result.ok();
    }
}
