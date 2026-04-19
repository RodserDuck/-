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
    private String studentNo;
    private String college;
    private String major;
    private String password;
}
