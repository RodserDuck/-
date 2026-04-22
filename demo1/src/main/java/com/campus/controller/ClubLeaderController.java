package com.campus.controller;

import com.campus.common.Result;
import com.campus.entity.Activity;
import com.campus.entity.ClubMember;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.service.ActivityService;
import com.campus.service.ClubService;
import com.campus.utils.ServletUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 团长侧能力：管理本社团活动、查看成员列表。
 */
@RestController
@RequestMapping("/club/leader")
public class ClubLeaderController {

    private final ActivityService activityService;
    private final ClubService clubService;

    public ClubLeaderController(ActivityService activityService, ClubService clubService) {
        this.activityService = activityService;
        this.clubService = clubService;
    }

    /** 团长新增活动 */
    @PostMapping("/activity/save")
    public Result<Activity> saveActivity(@RequestBody Activity activity) {
        Long userId = ServletUtils.getUserId();
        try {
            return Result.ok(activityService.leaderSave(activity, userId));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 团长查看本社团活动列表（含草稿/下线等所有状态） */
    @GetMapping("/activity/list/{clubId}")
    public Result<List<Activity>> listActivities(@PathVariable Long clubId) {
        Long userId = ServletUtils.getUserId();
        try {
            return Result.ok(activityService.leaderListByClub(clubId, userId));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 团长修改活动 */
    @PutMapping("/activity/update")
    public Result<Activity> updateActivity(@RequestBody Activity activity) {
        Long userId = ServletUtils.getUserId();
        try {
            return Result.ok(activityService.leaderUpdate(activity, userId));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 团长删除活动 */
    @DeleteMapping("/activity/{id}")
    public Result<Void> deleteActivity(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        try {
            activityService.leaderDelete(id, userId);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 团长查看成员列表 */
    @GetMapping("/members/{clubId}")
    public Result<List<ClubMember>> members(
            @PathVariable Long clubId,
            @RequestParam(required = false) String keyword) {
        Long userId = ServletUtils.getUserId();
        try {
            return Result.ok(clubService.leaderMemberList(clubId, userId, keyword));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 团长查看入团申请（待审核） */
    @GetMapping("/applications")
    public Result<IPage<ClubMember>> applications(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam Long clubId,
            @RequestParam(required = false) String keyword) {
        Long userId = ServletUtils.getUserId();
        try {
            return Result.ok(clubService.leaderApplicationPage(pageNum, pageSize, clubId, userId, keyword));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 团长通过申请 */
    @PutMapping("/application/{memberId}/approve")
    public Result<Void> approve(@PathVariable Long memberId) {
        Long userId = ServletUtils.getUserId();
        try {
            clubService.leaderApproveApplication(memberId, userId);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 团长拒绝申请 */
    @PutMapping("/application/{memberId}/reject")
    public Result<Void> reject(@PathVariable Long memberId) {
        Long userId = ServletUtils.getUserId();
        try {
            clubService.leaderRejectApplication(memberId, userId);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }
}

