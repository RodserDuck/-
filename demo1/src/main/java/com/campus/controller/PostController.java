package com.campus.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.common.Result;
import com.campus.entity.Post;
import com.campus.service.PostService;
import com.campus.utils.ServletUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/post")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    /** 帖子列表（分页） */
    @GetMapping("/list")
    public Result<IPage<Post>> list(
            @RequestParam(defaultValue = "1") int pageNum,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword) {
        return Result.ok(postService.page(pageNum, pageSize, category, keyword));
    }

    /** 帖子详情 */
    @GetMapping("/detail/{id}")
    public Result<Post> detail(@PathVariable Long id) {
        postService.incrementView(id);
        return Result.ok(postService.getById(id));
    }

    /** 发布帖子 */
    @PostMapping("/publish")
    public Result<Post> publish(@RequestBody Post post) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(postService.save(post, userId));
    }

    /** 删除帖子 */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        try {
            postService.delete(id, userId);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 点赞帖子 */
    @PostMapping("/like/{id}")
    public Result<?> like(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        try {
            postService.like(id, userId);
            return Result.ok();
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }

    /** 取消点赞 */
    @PostMapping("/unlike/{id}")
    public Result<?> unlike(@PathVariable Long id) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        postService.unlike(id, userId);
        return Result.ok();
    }

    /** 我的帖子列表 */
    @GetMapping("/my")
    public Result<List<Post>> my() {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        return Result.ok(postService.getMyPosts(userId));
    }
}
