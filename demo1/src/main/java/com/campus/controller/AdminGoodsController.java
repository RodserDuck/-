package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.admin.AdminAuthHelper;
import com.campus.common.Result;
import com.campus.entity.SecondHand;
import com.campus.service.SecondHandService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/goods")
public class AdminGoodsController {

    private final SecondHandService secondHandService;
    private final AdminAuthHelper adminAuthHelper;

    public AdminGoodsController(SecondHandService secondHandService, AdminAuthHelper adminAuthHelper) {
        this.secondHandService = secondHandService;
        this.adminAuthHelper = adminAuthHelper;
    }

    @GetMapping("/list")
    public Result<IPage<SecondHand>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String userKeyword) {
        adminAuthHelper.requireAdminId();
        return Result.ok(secondHandService.adminPage(pageNum, pageSize, categoryId, keyword, userKeyword));
    }

    @GetMapping("/detail/{id}")
    public Result<SecondHand> detail(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        SecondHand g = secondHandService.getById(id);
        if (g == null) return Result.fail("商品不存在");
        return Result.ok(g);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        try {
            secondHandService.adminDelete(id);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }
}
