package com.campus.service;

import com.campus.entity.User;
import com.campus.mapper.UserMapper;
import com.campus.utils.JwtUtils;
import com.campus.vo.LoginVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final JwtUtils jwtUtils;

    public UserServiceImpl(UserMapper userMapper, JwtUtils jwtUtils) {
        this.userMapper = userMapper;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public User register(String openid, String username) {
        User user = new User();
        user.setOpenid(openid);
        user.setUsername(username);
        user.setStatus(1);
        user.setCreateTime(LocalDateTime.now());
        userMapper.insert(user);
        return user;
    }

    @Override
    public User login(String openid) {
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getOpenid, openid);
        return userMapper.selectOne(q);
    }

    @Override
    public User getUserById(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    public User updateUser(User user) {
        userMapper.updateById(user);
        return userMapper.selectById(user.getUserId());
    }
}
