package com.campus.vo;

import lombok.Data;

@Data
public class LoginVO {
    private String token;
    private Long userId;
    private String username;
    private String name;
    private String avatar;
    private String openid;
    private String wxOpenid;
    private String studentNo;
    private String college;
    private String major;
    private String password;
    /** true 表示首次登录需补全必要资料完成注册（无密码） */
    private Boolean needCompleteProfile;
}
