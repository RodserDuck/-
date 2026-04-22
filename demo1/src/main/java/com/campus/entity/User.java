package com.campus.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("t_user")
public class User {
    @TableId(type = IdType.AUTO)
    private Long userId;
    private String openid;
    /** 微信小程序用户 openid（code2Session 获取） */
    private String wxOpenid;
    /** 微信 unionid（若已绑定开放平台才会返回） */
    private String wxUnionid;
    private String username;
    private String studentNo;
    @JsonIgnore
    private String password;
    private String avatar;
    private String phone;
    private String email;
    private String college;
    private String major;
    private String className;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    @TableLogic
    private Integer deleted;
}
