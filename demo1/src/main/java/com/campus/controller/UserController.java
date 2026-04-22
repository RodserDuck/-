package com.campus.controller;

import com.campus.common.Result;
import com.campus.entity.User;
import com.campus.service.UserService;
import com.campus.utils.JwtUtils;
import com.campus.utils.ServletUtils;
import com.campus.vo.ChangePasswordRequest;
import com.campus.vo.CompleteProfileRequest;
import com.campus.vo.LoginVO;
import com.campus.vo.UserRegisterRequest;
import com.campus.vo.WxCodeLoginRequest;
import com.campus.service.WechatAuthService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final BCryptPasswordEncoder passwordEncoder;
    private final WechatAuthService wechatAuthService;

    public UserController(UserService userService, JwtUtils jwtUtils,
                          BCryptPasswordEncoder passwordEncoder,
                          WechatAuthService wechatAuthService) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.wechatAuthService = wechatAuthService;
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
     * 微信登录（旧接口：通过 openid 自动注册）
     */
    @PostMapping("/wx-login")
    public Result<LoginVO> wxLogin(@RequestBody User req) {
        User exist = userService.getByWxOpenid(req.getOpenid());
        if (exist != null) {
            LoginVO vo = buildLoginVO(exist);
            vo.setNeedCompleteProfile(needsCompleteProfile(exist));
            return Result.ok(vo);
        }
        // 自动注册新用户
        User newUser = userService.registerWxShell(req.getOpenid(),
                req.getUsername() != null ? req.getUsername() : "新用户", req.getAvatar());
        LoginVO vo = buildLoginVO(newUser);
        vo.setNeedCompleteProfile(true);
        return Result.ok(vo);
    }

    /**
     * 微信一键登录（推荐）：小程序端传 wx.login() 的 code，由后端换取 openid/unionid。
     * 首次登录仅创建“空壳账号”（无密码），并返回 needCompleteProfile=true 让前端引导补全资料。
     */
    @PostMapping("/wx-code-login")
    public Result<LoginVO> wxCodeLogin(@RequestBody WxCodeLoginRequest req) {
        var session = wechatAuthService.code2Session(req.getCode());
        User user = userService.getByWxOpenid(session.openid());
        if (user == null) {
            // 不落库：发放临时 token，引导前端完善资料后再创建用户
            LoginVO vo = new LoginVO();
            vo.setToken(jwtUtils.generateWxPreRegisterToken(session.openid()));
            vo.setNeedCompleteProfile(true);
            vo.setWxOpenid(session.openid());
            return Result.ok(vo);
        } else {
            boolean changed = false;
            if (session.unionid() != null && !session.unionid().isBlank()
                && (user.getWxUnionid() == null || user.getWxUnionid().isBlank())) {
                user.setWxUnionid(session.unionid());
                changed = true;
            }
            if (changed) userService.updateUser(user);
        }

        LoginVO vo = buildLoginVO(user);
        vo.setNeedCompleteProfile(needsCompleteProfile(user));
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
        vo.setNeedCompleteProfile(false);
        return Result.ok(vo);
    }

    /**
     * 首次登录补全资料（无密码）
     */
    @PutMapping("/complete-profile")
    public Result<LoginVO> completeProfile(@RequestBody CompleteProfileRequest req) {
        Long userId = ServletUtils.getUserId();
        User updated;
        if (userId != null) {
            updated = userService.completeProfile(userId, req);
        } else {
            String wxOpenid = ServletUtils.getWxOpenid();
            if (wxOpenid == null || wxOpenid.isBlank()) return Result.fail("请先登录");
            updated = userService.completeProfileByWxOpenid(wxOpenid, req);
        }
        LoginVO vo = buildLoginVO(updated);
        vo.setNeedCompleteProfile(needsCompleteProfile(updated));
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
        vo.setWxOpenid(user.getWxOpenid());
        vo.setStudentNo(user.getStudentNo());
        vo.setCollege(user.getCollege());
        vo.setMajor(user.getMajor());
        vo.setNeedCompleteProfile(false);
        return vo;
    }

    private boolean needsCompleteProfile(User user) {
        if (user == null) return true;
        return user.getUsername() == null || user.getUsername().isBlank()
            || user.getStudentNo() == null || user.getStudentNo().isBlank()
            || user.getCollege() == null || user.getCollege().isBlank();
    }
}
