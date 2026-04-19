package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.Post;
import com.campus.entity.PostLike;
import com.campus.mapper.PostLikeMapper;
import com.campus.mapper.PostMapper;
import com.campus.service.PostService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PostServiceImpl implements PostService {

    private final PostMapper postMapper;
    private final PostLikeMapper postLikeMapper;

    public PostServiceImpl(PostMapper postMapper, PostLikeMapper postLikeMapper) {
        this.postMapper = postMapper;
        this.postLikeMapper = postLikeMapper;
    }

    @Override
    public IPage<Post> page(int pageNum, int pageSize, String category, String keyword) {
        Page<Post> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Post> q = new LambdaQueryWrapper<>();
        q.eq(Post::getStatus, 1);
        if (category != null && !category.isEmpty()) q.eq(Post::getCategory, category);
        if (keyword != null && !keyword.isEmpty()) q.like(Post::getContent, keyword);
        q.orderByDesc(Post::getIsTop).orderByDesc(Post::getCreateTime);
        return postMapper.selectPage(page, q);
    }

    @Override
    public Post getById(Long id) {
        return postMapper.selectById(id);
    }

    @Override
    public void incrementView(Long id) {
        Post p = postMapper.selectById(id);
        if (p != null) {
            p.setViewCount(p.getViewCount() + 1);
            postMapper.updateById(p);
        }
    }

    @Override
    public Post save(Post post, Long userId) {
        post.setUserId(userId);
        post.setLikeCount(0);
        post.setCommentCount(0);
        post.setViewCount(0);
        post.setStatus(1);
        post.setCreateTime(LocalDateTime.now());
        postMapper.insert(post);
        return post;
    }

    @Override
    public void delete(Long postId, Long userId) {
        Post p = postMapper.selectById(postId);
        if (p == null) throw new RuntimeException("帖子不存在");
        if (!p.getUserId().equals(userId)) throw new RuntimeException("无权删除");
        p.setStatus(0);
        postMapper.updateById(p);
    }

    @Override
    @Transactional
    public void like(Long postId, Long userId) {
        LambdaQueryWrapper<PostLike> q = new LambdaQueryWrapper<>();
        q.eq(PostLike::getUserId, userId).eq(PostLike::getPostId, postId);
        if (postLikeMapper.selectCount(q).intValue() > 0) {
            throw new RuntimeException("已点赞");
        }
        PostLike like = new PostLike();
        like.setUserId(userId);
        like.setPostId(postId);
        like.setCreateTime(LocalDateTime.now());
        postLikeMapper.insert(like);
        Post p = postMapper.selectById(postId);
        p.setLikeCount(p.getLikeCount() + 1);
        postMapper.updateById(p);
    }

    @Override
    @Transactional
    public void unlike(Long postId, Long userId) {
        LambdaQueryWrapper<PostLike> q = new LambdaQueryWrapper<>();
        q.eq(PostLike::getUserId, userId).eq(PostLike::getPostId, postId);
        postLikeMapper.delete(q);
        Post p = postMapper.selectById(postId);
        if (p != null && p.getLikeCount() > 0) {
            p.setLikeCount(p.getLikeCount() - 1);
            postMapper.updateById(p);
        }
    }
}
