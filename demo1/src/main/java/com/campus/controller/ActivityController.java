package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.common.Result;
import com.campus.entity.Activity;
import com.campus.service.ActivityService;
import com.campus.utils.ServletUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activity")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    /** 活动列表 */
    @GetMapping("/list")
    public Result<List<Activity>> list() {
        return Result.ok(activityService.listAll());
    }

    /** 活动列表（分页） */
    @GetMapping("/page")
    public Result<IPage<Activity>> page(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
        return Result.ok(activityService.page(pageNum, pageSize));
    }

    /** 社团活动列表 */
    @GetMapping("/club/{clubId}")
    public Result<List<Activity>> listByClub(@PathVariable Long clubId) {
        return Result.ok(activityService.listByClub(clubId));
    }

    /** 活动详情 */
    @GetMapping("/detail/{id}")
    public Result<Activity> detail(@PathVariable Long id) {
        activityService.incrementView(id);
        return Result.ok(activityService.getById(id));
    }

    /** 发布活动 */
    @PostMapping("/save")
    public Result<Activity> save(@RequestBody Activity activity) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        try {
            return Result.ok(activityService.saveActivity(activity, userId));
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 报名活动 */
    @PostMapping("/register/{id}")
    public Result<?> register(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        try {
            activityService.register(id, userId);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 取消报名 */
    @PostMapping("/cancel/{id}")
    public Result<?> cancel(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        activityService.cancelRegister(id, userId);
        return Result.ok();
    }

    /** 我的活动报名列表 */
    @GetMapping("/my")
    public Result<List<Activity>> my() {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(activityService.getMyActivities(userId));
    }
}
