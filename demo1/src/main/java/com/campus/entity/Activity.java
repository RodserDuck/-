package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_activity")
public class Activity {
    @TableId(type = IdType.AUTO)
    private Long activityId;
    private Long clubId;
    private String title;
    private String description;
    private String coverImage;
    private Integer maxParticipants;
    private Integer currentParticipants;
    /** 社团外参与者人数上限（0 或 null 表示不限制） */
    private Integer outsiderLimit;
    private String location;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String contact;
    private String organizer;
    private Integer viewCount;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    @TableLogic
    private Integer deleted;
}
