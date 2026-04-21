package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.User;
import com.campus.vo.UserRegisterRequest;

public interface UserService {
    User register(String openid, String username);
    User registerWithFull(UserRegisterRequest req);
    User login(String openid);
    User getUserById(Long userId);
    User getByOpenid(String openid);
    User updateUser(User user);
    void changePassword(Long userId, String oldPassword, String newPassword);

    IPage<User> adminPage(int pageNum, int pageSize, String keyword);

    void updateStatus(Long userId, Integer status);
}
