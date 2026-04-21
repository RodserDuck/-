package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.admin.AdminAuthHelper;
import com.campus.common.Result;
import com.campus.entity.Club;
import com.campus.service.ClubService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/club")
public class AdminClubController {

    private final ClubService clubService;
    private final AdminAuthHelper adminAuthHelper;

    public AdminClubController(ClubService clubService, AdminAuthHelper adminAuthHelper) {
        this.clubService = clubService;
        this.adminAuthHelper = adminAuthHelper;
    }

    @GetMapping("/list")
    public Result<IPage<Club>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {
        adminAuthHelper.requireAdminId();
        return Result.ok(clubService.adminPage(pageNum, pageSize, category, keyword));
    }
}
