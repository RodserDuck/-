package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
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
        int affected = deleteCascade(commentId);
        Post p = postMapper.selectById(c.getPostId());
        if (p != null && p.getCommentCount() != null && p.getCommentCount() > 0) {
            int next = Math.max(0, p.getCommentCount() - affected);
            p.setCommentCount(next);
            postMapper.updateById(p);
        }
    }

    @Override
    public IPage<Comment> adminPage(int pageNum, int pageSize, Long postId, String keyword, String userKeyword) {
        Page<Comment> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Comment> q = new LambdaQueryWrapper<>();
        if (postId != null) q.eq(Comment::getPostId, postId);
        if (keyword != null && !keyword.trim().isEmpty()) {
            q.like(Comment::getContent, keyword.trim());
        }

        if (userKeyword != null && !userKeyword.trim().isEmpty()) {
            String k = userKeyword.trim();
            List<User> users = userMapper.selectList(new LambdaQueryWrapper<User>()
                .select(User::getUserId)
                .and(w -> w.like(User::getUsername, k)
                    .or().like(User::getStudentNo, k)
                    .or().like(User::getPhone, k)));
            if (users.isEmpty()) {
                q.eq(Comment::getCommentId, -1L);
            } else {
                q.in(Comment::getUserId, users.stream().map(User::getUserId).toList());
            }
        }

        q.orderByDesc(Comment::getCreateTime);
        IPage<Comment> result = commentMapper.selectPage(page, q);
        fillUserInfo(result.getRecords());
        return result;
    }

    @Override
    @Transactional
    public void adminDelete(Long commentId) {
        Comment c = commentMapper.selectById(commentId);
        if (c == null) throw new RuntimeException("评论不存在");
        int affected = deleteCascade(commentId);
        Post p = postMapper.selectById(c.getPostId());
        if (p != null && p.getCommentCount() != null && p.getCommentCount() > 0) {
            int next = Math.max(0, p.getCommentCount() - affected);
            p.setCommentCount(next);
            postMapper.updateById(p);
        }
    }

    /** 删除评论及其直接子评论，返回删除条数 */
    private int deleteCascade(Long commentId) {
        int cnt = 0;
        cnt += commentMapper.deleteById(commentId);
        cnt += commentMapper.delete(new LambdaQueryWrapper<Comment>().eq(Comment::getParentId, commentId));
        return cnt;
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
