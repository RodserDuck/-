package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_post_like")
public class PostLike {
    @TableId(type = IdType.AUTO)
    private Long likeId;
    private Long userId;
    private Long postId;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableLogic
    private Integer deleted;
}
