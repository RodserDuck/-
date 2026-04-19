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
    @TableLogic
    private Integer deleted;
}
