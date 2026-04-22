package com.campus.vo;

import lombok.Data;

@Data
public class WxCodeLoginRequest {
    /** wx.login() 获取的临时登录凭证 */
    private String code;
    /** 可选：小程序端展示昵称（用于首次创建空壳账号时占位） */
    private String nickname;
    /** 可选：头像 URL（若你使用头像组件或用户已授权） */
    private String avatar;
}

