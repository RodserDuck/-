package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.common.Result;
import com.campus.entity.Notice;
import com.campus.service.NoticeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notice")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    /** 通知公告列表（分页） */
    @GetMapping("/list")
    public Result<IPage<Notice>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize) {
        return Result.ok(noticeService.page(pageNum, pageSize));
    }

    /** 首页置顶公告 */
    @GetMapping("/top")
    public Result<List<Notice>> top() {
        return Result.ok(noticeService.listTop());
    }

    /** 公告详情 */
    @GetMapping("/detail/{id}")
    public Result<Notice> detail(@PathVariable Long id) {
        noticeService.incrementView(id);
        return Result.ok(noticeService.getById(id));
    }
}
