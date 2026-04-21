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
    /**
     * 注意：不使用逻辑删除。点赞关系表有 uk_post_like(user_id,post_id)，逻辑删会保留行导致无法再次插入。
     * 取消点赞使用物理删除，表中若仍有 deleted 列可忽略或由运维执行 fix_post_like_physical.sql 清理。
     */
}
