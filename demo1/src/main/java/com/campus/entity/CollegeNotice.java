package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_college_notice")
public class CollegeNotice {
    @TableId(type = IdType.AUTO)
    private Long noticeId;
    private String title;
    private String content;
    private Long adminId;
    private String college;
    private String images;
    private Integer viewCount;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    @TableLogic
    private Integer deleted;
}
