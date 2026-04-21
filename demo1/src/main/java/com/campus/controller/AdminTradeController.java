package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.admin.AdminAuthHelper;
import com.campus.common.Result;
import com.campus.entity.TradeRecord;
import com.campus.service.TradeRecordService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/trade")
public class AdminTradeController {

    private final TradeRecordService tradeRecordService;
    private final AdminAuthHelper adminAuthHelper;

    public AdminTradeController(TradeRecordService tradeRecordService, AdminAuthHelper adminAuthHelper) {
        this.tradeRecordService = tradeRecordService;
        this.adminAuthHelper = adminAuthHelper;
    }

    @GetMapping("/list")
    public Result<IPage<TradeRecord>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String userKeyword) {
        adminAuthHelper.requireAdminId();
        return Result.ok(tradeRecordService.adminPage(pageNum, pageSize, status, keyword, userKeyword));
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        adminAuthHelper.requireAdminId();
        tradeRecordService.adminUpdateStatus(id, status);
        return Result.ok();
    }
}
