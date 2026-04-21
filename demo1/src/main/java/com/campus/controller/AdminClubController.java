package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.admin.AdminAuthHelper;
import com.campus.common.Result;
import com.campus.entity.Club;
import com.campus.entity.ClubMember;
import com.campus.service.ClubService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/detail/{id}")
    public Result<Club> detail(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        Club c = clubService.getById(id);
        if (c == null) return Result.fail("社团不存在");
        return Result.ok(c);
    }

    @GetMapping("/applications")
    public Result<IPage<ClubMember>> applications(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Long clubId,
            @RequestParam(required = false) String keyword) {
        adminAuthHelper.requireAdminId();
        return Result.ok(clubService.adminApplicationPage(pageNum, pageSize, clubId, keyword));
    }

    @PutMapping("/application/{memberId}/approve")
    public Result<Void> approve(@PathVariable Long memberId) {
        adminAuthHelper.requireAdminId();
        clubService.approveApplication(memberId);
        return Result.ok();
    }

    @PutMapping("/application/{memberId}/reject")
    public Result<Void> reject(@PathVariable Long memberId) {
        adminAuthHelper.requireAdminId();
        clubService.rejectApplication(memberId);
        return Result.ok();
    }

    /** 新增社团（管理员） */
    @PostMapping("/save")
    public Result<Club> save(@RequestBody Club club) {
        adminAuthHelper.requireAdminId();
        try {
            return Result.ok(clubService.adminSave(club));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 修改社团（管理员） */
    @PutMapping("/update")
    public Result<Club> update(@RequestBody Club club) {
        adminAuthHelper.requireAdminId();
        try {
            return Result.ok(clubService.adminUpdate(club));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 社团成员列表（管理员） */
    @GetMapping("/members/{clubId}")
    public Result<List<ClubMember>> members(
            @PathVariable Long clubId,
            @RequestParam(required = false) String keyword) {
        adminAuthHelper.requireAdminId();
        try {
            return Result.ok(clubService.adminMemberList(clubId, keyword));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }
}
