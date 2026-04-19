package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_club")
public class Club {
    @TableId(type = IdType.AUTO)
    private Long clubId;
    private String name;
    private String description;
    private String coverImage;
    private String category;
    private Integer memberCount;
    private Integer activityCount;
    private String location;
    private Long leaderId;
    private String contact;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    @TableLogic
    private Integer deleted;
}
