package com.campus.vo;

import lombok.Data;

@Data
public class UserRegisterRequest {
    private String studentNo;
    private String username;
    private String password;
    private String phone;
    private String college;
    private String major;
    private String className;
}
