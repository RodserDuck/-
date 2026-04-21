package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.common.Result;
import com.campus.entity.LostFound;
import com.campus.entity.LostFoundClaimRecord;
import com.campus.service.LostFoundClaimRecordService;
import com.campus.service.LostFoundService;
import com.campus.utils.ServletUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lost-found")
public class LostFoundController {

    private final LostFoundService lostFoundService;
    private final LostFoundClaimRecordService lostFoundClaimRecordService;

    public LostFoundController(LostFoundService lostFoundService, LostFoundClaimRecordService lostFoundClaimRecordService) {
        this.lostFoundService = lostFoundService;
        this.lostFoundClaimRecordService = lostFoundClaimRecordService;
    }

    /** 失物招领列表 */
    @GetMapping("/list")
    public Result<IPage<LostFound>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword) {
        return Result.ok(lostFoundService.page(pageNum, pageSize, type, status, keyword));
    }

    /** 详情 */
    @GetMapping("/detail/{id}")
    public Result<LostFound> detail(@PathVariable Long id) {
        lostFoundService.incrementView(id);
        return Result.ok(lostFoundService.getById(id));
    }

    /** 发布 */
    @PostMapping("/save")
    public Result<LostFound> save(@RequestBody LostFound lostFound) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(lostFoundService.save(lostFound, userId));
    }

    /** 更新状态 */
    @PutMapping("/status/{id}")
    public Result<?> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        lostFoundService.updateStatus(id, status);
        return Result.ok();
    }

    /** 用户发起认领，提交到招领记录表（管理员后续审核） */
    @PostMapping("/claim/{id}")
    public Result<LostFoundClaimRecord> submitClaim(@PathVariable("id") Long lostFoundId,
                                                    @RequestParam(required = false) String remark) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(lostFoundClaimRecordService.submitClaim(lostFoundId, userId, remark));
    }
}
