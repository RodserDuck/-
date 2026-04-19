package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.Post;

public interface PostService {
    IPage<Post> page(int pageNum, int pageSize, String category, String keyword);
    Post getById(Long id);
    void incrementView(Long id);
    Post save(Post post, Long userId);
    void delete(Long postId, Long userId);
    void like(Long postId, Long userId);
    void unlike(Long postId, Long userId);
}
