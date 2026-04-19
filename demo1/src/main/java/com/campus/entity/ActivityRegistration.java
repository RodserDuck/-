package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_activity_registration")
public class ActivityRegistration {
    @TableId(type = IdType.AUTO)
    private Long registrationId;
    private Long userId;
    private Long activityId;
    private String remark;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableLogic
    private Integer deleted;
}
