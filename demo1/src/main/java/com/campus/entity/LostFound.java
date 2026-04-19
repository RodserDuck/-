package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_lost_found")
public class LostFound {
    @TableId(type = IdType.AUTO)
    private Long lostFoundId;
    private Long userId;
    private Integer type;
    private String title;
    private String itemName;
    private String description;
    private String location;
    private LocalDateTime lostTime;
    private String itemImage;
    private String contact;
    private Integer status;
    private Integer viewCount;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    @TableLogic
    private Integer deleted;
}
