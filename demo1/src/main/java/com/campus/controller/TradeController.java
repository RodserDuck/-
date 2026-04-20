package com.campus.controller;

import com.campus.common.Result;
import com.campus.entity.TradeRecord;
import com.campus.service.TradeRecordService;
import com.campus.utils.ServletUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trade")
public class TradeController {

    private final TradeRecordService tradeRecordService;

    public TradeController(TradeRecordService tradeRecordService) {
        this.tradeRecordService = tradeRecordService;
    }

    /** 发起交易（购买） */
    @PostMapping("/create")
    public Result<TradeRecord> create(@RequestBody TradeRecord req) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        try {
            TradeRecord record = tradeRecordService.create(req.getItemId(), userId, req.getRemark());
            return Result.ok(record);
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 确认交易完成（卖家操作） */
    @PostMapping("/confirm/{id}")
    public Result<?> confirm(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        try {
            tradeRecordService.confirm(id, userId);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 取消交易 */
    @PostMapping("/cancel/{id}")
    public Result<?> cancel(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        try {
            tradeRecordService.cancel(id, userId);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 我的购买记录 */
    @GetMapping("/my-buy")
    public Result<List<TradeRecord>> myBuy() {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(tradeRecordService.getMyBuy());
    }

    /** 我的售出记录 */
    @GetMapping("/my-sell")
    public Result<List<TradeRecord>> mySell() {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(tradeRecordService.getMySell());
    }

    /** 获取待处理的购买请求（卖家视角） */
    @GetMapping("/pending")
    public Result<List<TradeRecord>> pending() {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(tradeRecordService.getPendingForSeller(userId));
    }
}
