package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("t_lost_found_claim_record")
public class LostFoundClaimRecord {
    @TableId(type = IdType.AUTO)
    private Long claimId;
    private Long lostFoundId;
    private Long publisherId;
    private Long claimantId;
    private Integer type; // 1-寻物 2-招领
    private Integer status; // 0-待处理 1-已匹配 2-已驳回
    private String remark;
    private LocalDateTime claimTime;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    @TableLogic
    private Integer deleted;

    @TableField(exist = false)
    private String publisherName;
    @TableField(exist = false)
    private String claimantName;
}
