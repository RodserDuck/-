package com.campus.vo;

import lombok.Data;

@Data
public class CompleteProfileRequest {
    private String username;
    private String studentNo;
    private String phone;
    private String college;
    private String major;
    private String className;
}

