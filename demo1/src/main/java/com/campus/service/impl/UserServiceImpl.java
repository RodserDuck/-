package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.User;
import com.campus.mapper.UserMapper;
import com.campus.service.UserService;
import com.campus.utils.JwtUtils;
import com.campus.vo.UserRegisterRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final JwtUtils jwtUtils;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserServiceImpl(UserMapper userMapper, JwtUtils jwtUtils,
                           BCryptPasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 学号+密码登录
     */
    @Override
    public User login(String openid) {
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getOpenid, openid);
        return userMapper.selectOne(q);
    }

    /**
     * 通过学号查找用户（内部使用）
     */
    public User getByStudentNo(String studentNo) {
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getStudentNo, studentNo);
        return userMapper.selectOne(q);
    }

    /**
     * 注册（微信自动注册，保持兼容）
     */
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

    /**
     * 完整信息注册（使用密码）
     */
    @Override
    public User registerWithFull(UserRegisterRequest req) {
        User user = new User();
        user.setOpenid("student_" + req.getStudentNo());
        user.setStudentNo(req.getStudentNo());
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setPhone(req.getPhone());
        user.setCollege(req.getCollege());
        user.setMajor(req.getMajor());
        user.setClassName(req.getClassName());
        user.setStatus(1);
        user.setCreateTime(LocalDateTime.now());
        userMapper.insert(user);
        return user;
    }

    @Override
    public User getUserById(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    public User getByOpenid(String openid) {
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getOpenid, openid);
        return userMapper.selectOne(q);
    }

    @Override
    public User updateUser(User user) {
        userMapper.updateById(user);
        return userMapper.selectById(user.getUserId());
    }

    @Override
    public IPage<User> adminPage(int pageNum, int pageSize, String keyword) {
        Page<User> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.trim().isEmpty()) {
            String k = keyword.trim();
            q.and(w -> w.like(User::getUsername, k)
                .or().like(User::getStudentNo, k)
                .or().like(User::getCollege, k)
                .or().like(User::getPhone, k));
        }
        q.orderByDesc(User::getCreateTime);
        return userMapper.selectPage(page, q);
    }

    @Override
    public void updateStatus(Long userId, Integer status) {
        User u = userMapper.selectById(userId);
        if (u == null) {
            throw new RuntimeException("用户不存在");
        }
        u.setStatus(status);
        userMapper.updateById(u);
    }
}
