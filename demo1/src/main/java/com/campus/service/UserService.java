package com.campus.service;

import com.campus.entity.User;

public interface UserService {
    User register(String openid, String username);
    User login(String openid);
    User getUserById(Long userId);
    User updateUser(User user);
}
