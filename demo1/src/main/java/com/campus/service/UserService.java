package com.campus.service;

import com.campus.entity.User;

public interface UserService {
    User register(String openid, String username);
    User registerWithFull(User user);
    User login(String openid);
    User getUserById(Long userId);
    User getByOpenid(String openid);
    User updateUser(User user);
}
