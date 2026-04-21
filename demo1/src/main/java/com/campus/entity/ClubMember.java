package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_club_member")
public class ClubMember {
    @TableId(type = IdType.AUTO)
    private Long memberId;
    private Long clubId;
    private Long userId;
    private Integer role;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime joinTime;
    private Integer status;  // 0-申请中 1-已加入
    @TableLogic
    private Integer deleted;

    /** 以下为关联查询字段（非数据库字段） */
    @TableField(exist = false)
    private String username;
    @TableField(exist = false)
    private String studentNo;
    @TableField(exist = false)
    private String phone;
}
