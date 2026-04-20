package com.campus.service;

import com.campus.entity.User;
import com.campus.vo.UserRegisterRequest;

public interface UserService {
    User register(String openid, String username);
    User registerWithFull(UserRegisterRequest req);
    User login(String openid);
    User getUserById(Long userId);
    User getByOpenid(String openid);
    User updateUser(User user);
}
