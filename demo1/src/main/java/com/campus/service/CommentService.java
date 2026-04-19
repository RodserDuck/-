package com.campus.service;

import com.campus.entity.Comment;
import java.util.List;

public interface CommentService {
    List<Comment> listByPost(Long postId);
    Comment save(Comment comment, Long userId);
    void delete(Long commentId, Long userId);
}
