package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_post")
public class Post {
    @TableId(type = IdType.AUTO)
    private Long postId;
    private Long userId;
    private String title;
    private String content;
    private String images;
    private String category;
    private Integer likeCount;
    private Integer commentCount;
    private Integer viewCount;
    private Integer isTop;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    @TableLogic
    private Integer deleted;
}
