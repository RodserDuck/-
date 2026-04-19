package com.campus.controller;

import com.campus.common.Result;
import com.campus.entity.Comment;
import com.campus.service.CommentService;
import com.campus.utils.ServletUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /** 帖子评论列表 */
    @GetMapping("/list/{postId}")
    public Result<List<Comment>> list(@PathVariable Long postId) {
        return Result.ok(commentService.listByPost(postId));
    }

    /** 发表评论 */
    @PostMapping("/save")
    public Result<Comment> save(@RequestBody Comment comment) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(commentService.save(comment, userId));
    }

    /** 删除评论 */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        try {
            commentService.delete(id, userId);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }
}
