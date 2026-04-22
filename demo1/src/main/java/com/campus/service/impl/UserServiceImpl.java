package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.College;
import com.campus.entity.User;
import com.campus.mapper.CollegeMapper;
import com.campus.mapper.UserMapper;
import com.campus.service.UserService;
import com.campus.vo.CompleteProfileRequest;
import com.campus.vo.UserRegisterRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final CollegeMapper collegeMapper;

    public UserServiceImpl(UserMapper userMapper,
                           BCryptPasswordEncoder passwordEncoder,
                           CollegeMapper collegeMapper) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.collegeMapper = collegeMapper;
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

    @Override
    public User registerWxShell(String wxOpenid, String username, String avatar) {
        User user = new User();
        user.setWxOpenid(wxOpenid);
        user.setUsername(username);
        user.setAvatar(avatar);
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
    public User getByWxOpenid(String wxOpenid) {
        LambdaQueryWrapper<User> q = new LambdaQueryWrapper<>();
        q.eq(User::getWxOpenid, wxOpenid);
        return userMapper.selectOne(q);
    }

    @Override
    public User updateUser(User user) {
        userMapper.updateById(user);
        return userMapper.selectById(user.getUserId());
    }

    @Override
    public User completeProfile(Long userId, CompleteProfileRequest req) {
        User u = userMapper.selectById(userId);
        if (u == null) throw new RuntimeException("用户不存在");
        if (req == null) throw new RuntimeException("参数错误");

        String username = req.getUsername() == null ? "" : req.getUsername().trim();
        String studentNo = req.getStudentNo() == null ? "" : req.getStudentNo().trim();
        String college = req.getCollege() == null ? "" : req.getCollege().trim();
        if (username.isEmpty()) throw new RuntimeException("请输入昵称");
        if (studentNo.isEmpty()) throw new RuntimeException("请输入学号");
        if (college.isEmpty()) throw new RuntimeException("请选择学院");

        // 学号唯一校验（允许本人）
        User exist = getByStudentNo(studentNo);
        if (exist != null && !exist.getUserId().equals(userId)) {
            throw new RuntimeException("该学号已被占用");
        }

        // 学院有效性校验：必须存在且启用
        LambdaQueryWrapper<College> qc = new LambdaQueryWrapper<>();
        qc.eq(College::getName, college).eq(College::getStatus, 1);
        if (collegeMapper.selectCount(qc).intValue() == 0) {
            throw new RuntimeException("学院不存在或已停用");
        }

        u.setUsername(username);
        u.setStudentNo(studentNo);
        u.setPhone(req.getPhone() == null ? null : req.getPhone().trim());
        u.setCollege(college);
        u.setMajor(req.getMajor() == null ? null : req.getMajor().trim());
        u.setClassName(req.getClassName() == null ? null : req.getClassName().trim());
        userMapper.updateById(u);
        return userMapper.selectById(userId);
    }

    @Override
    public User completeProfileByWxOpenid(String wxOpenid, CompleteProfileRequest req) {
        if (wxOpenid == null || wxOpenid.isBlank()) throw new RuntimeException("微信登录态无效，请重新登录");
        if (req == null) throw new RuntimeException("参数错误");

        // 若已有用户（极少：例如重复提交/并发），直接当作补全
        User existing = getByWxOpenid(wxOpenid);
        if (existing != null) {
            return completeProfile(existing.getUserId(), req);
        }

        String username = req.getUsername() == null ? "" : req.getUsername().trim();
        String studentNo = req.getStudentNo() == null ? "" : req.getStudentNo().trim();
        String college = req.getCollege() == null ? "" : req.getCollege().trim();
        if (username.isEmpty()) throw new RuntimeException("请输入昵称");
        if (studentNo.isEmpty()) throw new RuntimeException("请输入学号");
        if (college.isEmpty()) throw new RuntimeException("请选择学院");

        // 学号唯一校验
        User existNo = getByStudentNo(studentNo);
        if (existNo != null) throw new RuntimeException("该学号已被占用");

        // 学院有效性校验：必须存在且启用
        LambdaQueryWrapper<College> qc = new LambdaQueryWrapper<>();
        qc.eq(College::getName, college).eq(College::getStatus, 1);
        if (collegeMapper.selectCount(qc).intValue() == 0) {
            throw new RuntimeException("学院不存在或已停用");
        }

        User u = new User();
        u.setWxOpenid(wxOpenid);
        u.setUsername(username);
        u.setStudentNo(studentNo);
        u.setPhone(req.getPhone() == null ? null : req.getPhone().trim());
        u.setCollege(college);
        u.setMajor(req.getMajor() == null ? null : req.getMajor().trim());
        u.setClassName(req.getClassName() == null ? null : req.getClassName().trim());
        u.setStatus(1);
        u.setCreateTime(LocalDateTime.now());
        userMapper.insert(u);
        return userMapper.selectById(u.getUserId());
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User u = userMapper.selectById(userId);
        if (u == null) throw new RuntimeException("用户不存在");
        if (oldPassword == null || oldPassword.trim().isEmpty()) throw new RuntimeException("请输入旧密码");
        if (newPassword == null || newPassword.trim().isEmpty()) throw new RuntimeException("请输入新密码");
        if (newPassword.trim().length() < 6) throw new RuntimeException("新密码至少 6 位");
        if (u.getPassword() == null || u.getPassword().isEmpty()) throw new RuntimeException("账号未设置密码，请联系管理员");
        if (!passwordEncoder.matches(oldPassword, u.getPassword())) throw new RuntimeException("旧密码错误");
        if (passwordEncoder.matches(newPassword, u.getPassword())) throw new RuntimeException("新密码不能与旧密码相同");
        u.setPassword(passwordEncoder.encode(newPassword));
        userMapper.updateById(u);
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
