package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.common.Result;
import com.campus.entity.Club;
import com.campus.service.ClubService;
import com.campus.utils.ServletUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/club")
public class ClubController {

    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    /** 社团列表 */
    @GetMapping("/list")
    public Result<List<Club>> list() {
        return Result.ok(clubService.listAll());
    }

    /** 社团列表（分页+分类） */
    @GetMapping("/page")
    public Result<IPage<Club>> page(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String category) {
        return Result.ok(clubService.page(pageNum, pageSize, category));
    }

    /** 社团详情 */
    @GetMapping("/detail/{id}")
    public Result<Club> detail(@PathVariable Long id) {
        return Result.ok(clubService.getById(id));
    }

    /** 创建社团 */
    @PostMapping("/save")
    public Result<Club> save(@RequestBody Club club) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(clubService.saveClub(club, userId));
    }

    /** 加入社团 */
    @PostMapping("/join/{id}")
    public Result<Club> join(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        try {
            return Result.ok(clubService.joinClub(userId, id));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 退出社团 */
    @PostMapping("/leave/{id}")
    public Result<?> leave(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        clubService.leaveClub(userId, id);
        return Result.ok();
    }

    /** 我的社团 */
    @GetMapping("/my")
    public Result<List<Club>> my() {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(clubService.getMyClubs(userId));
    }
}
