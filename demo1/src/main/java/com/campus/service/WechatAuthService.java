package com.campus.service;

public interface WechatAuthService {
    WechatSession code2Session(String code);

    record WechatSession(String openid, String unionid, String sessionKey) {}
}

