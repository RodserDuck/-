package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.common.Result;
import com.campus.entity.SecondHand;
import com.campus.service.SecondHandService;
import com.campus.utils.ServletUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/second-hand")
public class SecondHandController {

    private final SecondHandService secondHandService;

    public SecondHandController(SecondHandService secondHandService) {
        this.secondHandService = secondHandService;
    }

    /** 商品列表 */
    @GetMapping("/list")
    public Result<List<SecondHand>> list() {
        return Result.ok(secondHandService.listAll());
    }

    /** 商品列表（分页+分类） */
    @GetMapping("/page")
    public Result<IPage<SecondHand>> page(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "20") int pageSize,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword) {
        return Result.ok(secondHandService.page(pageNum, pageSize, categoryId, keyword));
    }

    /** 商品详情 */
    @GetMapping("/detail/{id}")
    public Result<SecondHand> detail(@PathVariable Long id) {
        secondHandService.incrementView(id);
        return Result.ok(secondHandService.getById(id));
    }

    /** 发布商品 */
    @PostMapping("/publish")
    public Result<SecondHand> publish(@RequestBody SecondHand goods) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(secondHandService.save(goods, userId));
    }

    /** 删除商品 */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        try {
            secondHandService.delete(id, userId);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 我的发布 */
    @GetMapping("/my")
    public Result<List<SecondHand>> my() {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(secondHandService.getMyGoods(userId));
    }
}
