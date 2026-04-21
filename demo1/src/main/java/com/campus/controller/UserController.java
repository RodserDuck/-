package com.campus.controller;

import com.campus.common.Result;
import com.campus.entity.User;
import com.campus.service.UserService;
import com.campus.utils.JwtUtils;
import com.campus.utils.ServletUtils;
import com.campus.vo.ChangePasswordRequest;
import com.campus.vo.LoginVO;
import com.campus.vo.UserRegisterRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserController(UserService userService, JwtUtils jwtUtils,
                          BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 学生账号密码登录
     */
    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody LoginVO req) {
        String studentNo = req.getStudentNo();
        String password = req.getPassword();

        if (studentNo == null || studentNo.trim().isEmpty()) {
            return Result.fail("请输入学号");
        }
        if (password == null || password.trim().isEmpty()) {
            return Result.fail("请输入密码");
        }

        // openid = "student_" + 学号
        String openid = "student_" + studentNo;
        User user = userService.login(openid);

        if (user == null) {
            return Result.fail("学号不存在，请先注册");
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return Result.fail("账号未设置密码，请使用微信登录或联系管理员");
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return Result.fail("密码错误，请重新输入");
        }
        if (user.getStatus() == null || user.getStatus() != 1) {
            return Result.fail("账号已被禁用，请联系管理员");
        }

        LoginVO vo = buildLoginVO(user);
        return Result.ok(vo);
    }

    /**
     * 微信登录（通过openid，自动注册）
     */
    @PostMapping("/wx-login")
    public Result<LoginVO> wxLogin(@RequestBody User req) {
        User exist = userService.login(req.getOpenid());
        if (exist != null) {
            LoginVO vo = buildLoginVO(exist);
            return Result.ok(vo);
        }
        // 自动注册新用户
        User newUser = userService.register(req.getOpenid(),
                req.getUsername() != null ? req.getUsername() : "新用户");
        LoginVO vo = buildLoginVO(newUser);
        return Result.ok(vo);
    }

    /**
     * 完整信息注册（学号+密码+学院等）
     */
    @PostMapping("/register")
    public Result<LoginVO> register(@RequestBody UserRegisterRequest req) {
        // 校验学号是否已注册
        String openid = "student_" + req.getStudentNo();
        User exist = userService.getByOpenid(openid);
        if (exist != null) {
            return Result.fail("该学号已注册，请直接登录");
        }

        User user = userService.registerWithFull(req);
        LoginVO vo = buildLoginVO(user);
        return Result.ok(vo);
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/info")
    public Result<User> getInfo() {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        User user = userService.getUserById(userId);
        return Result.ok(user);
    }

    /**
     * 更新用户信息
     */
    @PutMapping("/update")
    public Result<User> update(@RequestBody User user) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        user.setUserId(userId);
        return Result.ok(userService.updateUser(user));
    }

    /**
     * 修改密码（需要登录，校验旧密码）
     */
    @PutMapping("/password")
    public Result<Void> changePassword(@RequestBody ChangePasswordRequest req) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        userService.changePassword(userId, req.getOldPassword(), req.getNewPassword());
        return Result.ok(null);
    }

    private LoginVO buildLoginVO(User user) {
        String token = jwtUtils.generateToken(user.getUserId(), user.getUsername());
        LoginVO vo = new LoginVO();
        vo.setToken(token);
        vo.setUserId(user.getUserId());
        vo.setUsername(user.getUsername());
        vo.setAvatar(user.getAvatar());
        vo.setOpenid(user.getOpenid());
        vo.setStudentNo(user.getStudentNo());
        vo.setCollege(user.getCollege());
        vo.setMajor(user.getMajor());
        return vo;
    }
}
