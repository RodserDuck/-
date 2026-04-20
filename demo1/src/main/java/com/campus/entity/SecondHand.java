package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("t_second_hand")
public class SecondHand {
    @TableId(type = IdType.AUTO)
    private Long itemId;
    private Long userId;
    private String title;
    private String description;
    private String images;
    private Long categoryId;
    private BigDecimal originalPrice;
    private BigDecimal price;
    private Integer conditionLevel;
    private String tradeLocation;
    private String contact;
    private Integer viewCount;
    private Integer favoriteCount;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    @TableLogic
    private Integer deleted;

    /** 以下为关联查询字段（非数据库字段） */
    @TableField(exist = false)
    private String sellerName;
    @TableField(exist = false)
    private String sellerAvatar;
    @TableField(exist = false)
    private String sellerCollege;
}
