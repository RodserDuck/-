package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.admin.AdminAuthHelper;
import com.campus.common.Result;
import com.campus.entity.Comment;
import com.campus.service.CommentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/comment")
public class AdminCommentController {

    private final CommentService commentService;
    private final AdminAuthHelper adminAuthHelper;

    public AdminCommentController(CommentService commentService, AdminAuthHelper adminAuthHelper) {
        this.commentService = commentService;
        this.adminAuthHelper = adminAuthHelper;
    }

    /** 评论列表（管理员） */
    @GetMapping("/list")
    public Result<IPage<Comment>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) Long postId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String userKeyword) {
        adminAuthHelper.requireAdminId();
        return Result.ok(commentService.adminPage(pageNum, pageSize, postId, keyword, userKeyword));
    }

    /** 删除评论（管理员，连带删除其子评论） */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        adminAuthHelper.requireAdminId();
        try {
            commentService.adminDelete(id);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }
}

