package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.Post;
import com.campus.entity.PostLike;
import com.campus.entity.User;
import com.campus.mapper.PostLikeMapper;
import com.campus.mapper.PostMapper;
import com.campus.mapper.UserMapper;
import com.campus.service.PostService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    private final PostMapper postMapper;
    private final PostLikeMapper postLikeMapper;
    private final UserMapper userMapper;

    public PostServiceImpl(PostMapper postMapper, PostLikeMapper postLikeMapper,
                           UserMapper userMapper) {
        this.postMapper = postMapper;
        this.postLikeMapper = postLikeMapper;
        this.userMapper = userMapper;
    }

    @Override
    public IPage<Post> page(int pageNum, int pageSize, String category, String keyword) {
        Page<Post> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Post> q = new LambdaQueryWrapper<>();
        q.eq(Post::getStatus, 1);
        if (category != null && !category.isEmpty()) q.eq(Post::getCategory, category);
        if (keyword != null && !keyword.trim().isEmpty()) {
            String k = keyword.trim();
            q.and(w -> w.like(Post::getTitle, k).or().like(Post::getContent, k));
        }
        q.orderByDesc(Post::getIsTop).orderByDesc(Post::getCreateTime);
        IPage<Post> result = postMapper.selectPage(page, q);
        // 填充用户头像和昵称
        fillUserInfo(result.getRecords());
        return result;
    }

    @Override
    public Post getById(Long id) {
        Post post = postMapper.selectById(id);
        if (post != null) {
            User user = userMapper.selectById(post.getUserId());
            if (user != null) {
                post.setAvatar(user.getAvatar());
                post.setNickname(user.getUsername());
                post.setCollege(user.getCollege());
            }
        }
        return post;
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
        normalizeTitle(post);
        postMapper.insert(post);
        return getById(post.getPostId());
    }

    /** 标题：去空白、限长；若仍为空则从正文截取前若干字作为标题（兼容仅发图） */
    private void normalizeTitle(Post post) {
        String t = post.getTitle();
        if (t != null) {
            t = t.trim();
            if (t.isEmpty()) {
                t = null;
            }
        }
        if (t == null) {
            String c = post.getContent();
            if (c != null && !c.trim().isEmpty()) {
                c = c.trim();
                t = c.length() <= 80 ? c : c.substring(0, 77) + "...";
            } else {
                t = "分享";
            }
        }
        if (t.length() > 200) {
            t = t.substring(0, 200);
        }
        post.setTitle(t);
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
    public IPage<Post> adminPage(int pageNum, int pageSize, String category, String keyword, String userKeyword) {
        Page<Post> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Post> q = new LambdaQueryWrapper<>();
        if (category != null && !category.isEmpty()) q.eq(Post::getCategory, category);
        if (keyword != null && !keyword.trim().isEmpty()) {
            String k = keyword.trim();
            q.and(w -> w.like(Post::getTitle, k).or().like(Post::getContent, k));
        }
        if (userKeyword != null && !userKeyword.trim().isEmpty()) {
            String k = userKeyword.trim();
            List<User> users = userMapper.selectList(new LambdaQueryWrapper<User>()
                .select(User::getUserId)
                .and(w -> w.like(User::getUsername, k)
                    .or().like(User::getStudentNo, k)
                    .or().like(User::getPhone, k)));
            if (users.isEmpty()) {
                q.eq(Post::getPostId, -1L);
            } else {
                q.in(Post::getUserId, users.stream().map(User::getUserId).toList());
            }
        }
        q.orderByDesc(Post::getPostId);
        IPage<Post> result = postMapper.selectPage(page, q);
        fillUserInfo(result.getRecords());
        return result;
    }

    @Override
    public Post adminDetail(Long postId) {
        Post p = postMapper.selectById(postId);
        if (p == null) throw new RuntimeException("帖子不存在");
        fillUserInfo(java.util.List.of(p));
        return p;
    }

    @Override
    public void adminDelete(Long postId) {
        Post p = postMapper.selectById(postId);
        if (p == null) throw new RuntimeException("帖子不存在");
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

    @Override
    public List<Post> getMyPosts(Long userId) {
        LambdaQueryWrapper<Post> q = new LambdaQueryWrapper<>();
        q.eq(Post::getUserId, userId).orderByDesc(Post::getCreateTime);
        List<Post> posts = postMapper.selectList(q);
        fillUserInfo(posts);
        return posts;
    }

    private void fillUserInfo(List<Post> posts) {
        if (posts == null || posts.isEmpty()) return;
        for (Post post : posts) {
            User user = userMapper.selectById(post.getUserId());
            if (user != null) {
                post.setAvatar(user.getAvatar());
                post.setNickname(user.getUsername());
                post.setCollege(user.getCollege());
            }
        }
    }
}
