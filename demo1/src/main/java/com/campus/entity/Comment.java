package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName("t_comment")
public class Comment {
    @TableId(type = IdType.AUTO)
    private Long commentId;
    private Long postId;
    private Long userId;
    private String content;
    private Long parentId;
    private Long replyToUserId;
    private Integer likeCount;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableLogic
    private Integer deleted;

    /** 以下为关联查询出来的用户信息（非数据库字段） */
    @TableField(exist = false)
    private String avatar;
    @TableField(exist = false)
    private String nickname;
    @TableField(exist = false)
    private String replyToNickname;
    @TableField(exist = false)
    private List<Comment> replies;
}
