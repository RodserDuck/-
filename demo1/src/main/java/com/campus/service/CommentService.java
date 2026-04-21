package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.Comment;
import java.util.List;

public interface CommentService {
    List<Comment> listByPost(Long postId);
    Comment save(Comment comment, Long userId);
    void delete(Long commentId, Long userId);

    IPage<Comment> adminPage(int pageNum, int pageSize, Long postId, String keyword, String userKeyword);

    void adminDelete(Long commentId);
}
