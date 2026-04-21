package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.common.Result;
import com.campus.entity.LostFound;
import com.campus.service.LostFoundService;
import com.campus.utils.ServletUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/lost-found")
public class LostFoundController {

    private final LostFoundService lostFoundService;

    public LostFoundController(LostFoundService lostFoundService) {
        this.lostFoundService = lostFoundService;
    }

    /** 失物招领列表 */
    @GetMapping("/list")
    public Result<IPage<LostFound>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) String keyword) {
        return Result.ok(lostFoundService.page(pageNum, pageSize, type, keyword));
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
}
