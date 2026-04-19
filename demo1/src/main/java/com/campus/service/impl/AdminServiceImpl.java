package com.campus.service.impl;

import com.campus.entity.Admin;
import com.campus.mapper.AdminMapper;
import com.campus.service.AdminService;
import com.campus.utils.JwtUtils;
import com.campus.vo.LoginVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminMapper adminMapper;
    private final JwtUtils jwtUtils;

    public AdminServiceImpl(AdminMapper adminMapper, JwtUtils jwtUtils) {
        this.adminMapper = adminMapper;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public LoginVO login(String username, String password) {
        LambdaQueryWrapper<Admin> q = new LambdaQueryWrapper<>();
        q.eq(Admin::getUsername, username);
        Admin admin = adminMapper.selectOne(q);
        if (admin == null) throw new RuntimeException("用户名不存在");
        if (!admin.getPassword().equals(password)) throw new RuntimeException("密码错误");
        String token = jwtUtils.generateToken(admin.getAdminId(), admin.getUsername());
        admin.setLastLoginTime(LocalDateTime.now());
        adminMapper.updateById(admin);
        LoginVO vo = new LoginVO();
        vo.setToken(token);
        vo.setUserId(admin.getAdminId());
        vo.setUsername(admin.getUsername());
        vo.setName(admin.getName());
        return vo;
    }
}
