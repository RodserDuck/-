package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.entity.Comment;
import com.campus.entity.Post;
import com.campus.mapper.CommentMapper;
import com.campus.mapper.PostMapper;
import com.campus.service.CommentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final PostMapper postMapper;

    public CommentServiceImpl(CommentMapper commentMapper, PostMapper postMapper) {
        this.commentMapper = commentMapper;
        this.postMapper = postMapper;
    }

    @Override
    public List<Comment> listByPost(Long postId) {
        return commentMapper.selectList(
            new LambdaQueryWrapper<Comment>()
                .eq(Comment::getPostId, postId)
                .isNull(Comment::getParentId)
                .orderByDesc(Comment::getCreateTime)
        );
    }

    @Override
    @Transactional
    public Comment save(Comment comment, Long userId) {
        comment.setUserId(userId);
        comment.setLikeCount(0);
        comment.setCreateTime(LocalDateTime.now());
        commentMapper.insert(comment);
        Post p = postMapper.selectById(comment.getPostId());
        p.setCommentCount(p.getCommentCount() + 1);
        postMapper.updateById(p);
        return comment;
    }

    @Override
    public void delete(Long commentId, Long userId) {
        Comment c = commentMapper.selectById(commentId);
        if (c == null) throw new RuntimeException("评论不存在");
        if (!c.getUserId().equals(userId)) throw new RuntimeException("无权删除");
        commentMapper.deleteById(commentId);
        Post p = postMapper.selectById(c.getPostId());
        if (p != null && p.getCommentCount() > 0) {
            p.setCommentCount(p.getCommentCount() - 1);
            postMapper.updateById(p);
        }
    }
}
