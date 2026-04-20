package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("t_trade_record")
public class TradeRecord {
    @TableId(type = IdType.AUTO)
    private Long recordId;
    private Long itemId;
    private Long sellerId;
    private Long buyerId;
    private String itemTitle;
    private BigDecimal price;
    private Integer status;
    private String remark;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    @TableLogic
    private Integer deleted;

    /** 以下为关联查询字段（非数据库字段） */
    @TableField(exist = false)
    private String buyerName;
    @TableField(exist = false)
    private String buyerAvatar;
    @TableField(exist = false)
    private String sellerName;
    @TableField(exist = false)
    private String sellerAvatar;
}
