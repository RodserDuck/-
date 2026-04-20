package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.entity.Comment;
import com.campus.entity.Post;
import com.campus.entity.User;
import com.campus.mapper.CommentMapper;
import com.campus.mapper.PostMapper;
import com.campus.mapper.UserMapper;
import com.campus.service.CommentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentMapper commentMapper;
    private final PostMapper postMapper;
    private final UserMapper userMapper;

    public CommentServiceImpl(CommentMapper commentMapper, PostMapper postMapper,
                              UserMapper userMapper) {
        this.commentMapper = commentMapper;
        this.postMapper = postMapper;
        this.userMapper = userMapper;
    }

    @Override
    public List<Comment> listByPost(Long postId) {
        List<Comment> all = commentMapper.selectList(
            new LambdaQueryWrapper<Comment>()
                .eq(Comment::getPostId, postId)
                .orderByDesc(Comment::getCreateTime)
        );
        if (all == null || all.isEmpty()) return new ArrayList<>();

        // 填充所有评论的用户信息
        fillUserInfo(all);

        // 按 parentId 分组：null -> 顶层评论，其他 -> 子评论
        Map<Long, List<Comment>> byParent = new HashMap<>();
        for (Comment c : all) {
            byParent.computeIfAbsent(c.getParentId(), k -> new ArrayList<>()).add(c);
        }

        // 顶层评论（parentId 为 null）
        List<Comment> roots = byParent.getOrDefault(null, new ArrayList<>());
        // 子评论挂到顶层评论的 replies 字段
        for (Comment root : roots) {
            root.setReplies(byParent.getOrDefault(root.getCommentId(), new ArrayList<>()));
        }
        return roots;
    }

    @Override
    @Transactional
    public Comment save(Comment comment, Long userId) {
        comment.setUserId(userId);
        comment.setLikeCount(0);
        comment.setCreateTime(LocalDateTime.now());
        commentMapper.insert(comment);
        // 填充用户信息后返回
        User user = userMapper.selectById(userId);
        if (user != null) {
            comment.setAvatar(user.getAvatar());
            comment.setNickname(user.getUsername());
        }
        if (comment.getReplyToUserId() != null) {
            User replyTo = userMapper.selectById(comment.getReplyToUserId());
            if (replyTo != null) comment.setReplyToNickname(replyTo.getUsername());
        }
        // 更新帖子评论数
        Post p = postMapper.selectById(comment.getPostId());
        if (p != null) {
            p.setCommentCount(p.getCommentCount() + 1);
            postMapper.updateById(p);
        }
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

    private void fillUserInfo(List<Comment> comments) {
        // 收集所有涉及的 userId（包括回复目标）
        List<Long> userIds = comments.stream()
            .flatMap(c -> {
                List<Long> ids = new ArrayList<>();
                ids.add(c.getUserId());
                if (c.getReplyToUserId() != null) ids.add(c.getReplyToUserId());
                return ids.stream();
            })
            .distinct()
            .collect(Collectors.toList());

        Map<Long, User> userMap = new HashMap<>();
        for (Long uid : userIds) {
            User u = userMapper.selectById(uid);
            if (u != null) userMap.put(uid, u);
        }

        for (Comment c : comments) {
            User author = userMap.get(c.getUserId());
            if (author != null) {
                c.setAvatar(author.getAvatar());
                c.setNickname(author.getUsername());
            }
            if (c.getReplyToUserId() != null) {
                User replyTo = userMap.get(c.getReplyToUserId());
                if (replyTo != null) c.setReplyToNickname(replyTo.getUsername());
            }
        }
    }
}
