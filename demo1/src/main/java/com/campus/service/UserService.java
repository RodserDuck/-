package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.User;
import com.campus.vo.CompleteProfileRequest;
import com.campus.vo.UserRegisterRequest;

public interface UserService {
    User register(String openid, String username);
    User registerWxShell(String wxOpenid, String username, String avatar);
    User registerWithFull(UserRegisterRequest req);
    User login(String openid);
    User getUserById(Long userId);
    User getByOpenid(String openid);
    User getByWxOpenid(String wxOpenid);
    User updateUser(User user);
    void changePassword(Long userId, String oldPassword, String newPassword);
    User completeProfile(Long userId, CompleteProfileRequest req);
    User completeProfileByWxOpenid(String wxOpenid, CompleteProfileRequest req);

    IPage<User> adminPage(int pageNum, int pageSize, String keyword);

    void updateStatus(Long userId, Integer status);
}
