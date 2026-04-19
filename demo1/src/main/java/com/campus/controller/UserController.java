package com.campus.controller;

import com.campus.common.Result;
import com.campus.entity.User;
import com.campus.service.UserService;
import com.campus.utils.JwtUtils;
import com.campus.utils.ServletUtils;
import com.campus.vo.LoginVO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    public UserController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    /** 微信登录（通过openid） */
    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody User user) {
        User exist = userService.login(user.getOpenid());
        LoginVO vo = new LoginVO();
        if (exist != null) {
            String token = jwtUtils.generateToken(exist.getUserId(), exist.getUsername());
            vo.setToken(token);
            vo.setUserId(exist.getUserId());
            vo.setUsername(exist.getUsername());
            vo.setAvatar(exist.getAvatar());
            vo.setOpenid(exist.getOpenid());
            vo.setStudentNo(exist.getStudentNo());
            vo.setCollege(exist.getCollege());
        } else {
            User newUser = userService.register(user.getOpenid(), user.getUsername());
            String token = jwtUtils.generateToken(newUser.getUserId(), newUser.getUsername());
            vo.setToken(token);
            vo.setUserId(newUser.getUserId());
            vo.setUsername(newUser.getUsername());
            vo.setAvatar(newUser.getAvatar());
            vo.setOpenid(newUser.getOpenid());
        }
        return Result.ok(vo);
    }

    /** 获取当前用户信息 */
    @GetMapping("/info")
    public Result<User> getInfo() {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        User user = userService.getUserById(userId);
        return Result.ok(user);
    }

    /** 更新用户信息 */
    @PutMapping("/update")
    public Result<User> update(@RequestBody User user) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) return Result.fail("请先登录");
        user.setUserId(userId);
        return Result.ok(userService.updateUser(user));
    }

    /** 注册 */
    @PostMapping("/register")
    public Result<LoginVO> register(@RequestBody User req) {
        User exist = userService.getByOpenid(req.getOpenid());
        if (exist != null) {
            return Result.fail("该账号已注册，请直接登录");
        }
        User user = userService.registerWithFull(req);
        String token = jwtUtils.generateToken(user.getUserId(), user.getUsername());
        LoginVO vo = new LoginVO();
        vo.setToken(token);
        vo.setUserId(user.getUserId());
        vo.setUsername(user.getUsername());
        vo.setAvatar(user.getAvatar());
        vo.setOpenid(user.getOpenid());
        vo.setStudentNo(user.getStudentNo());
        vo.setCollege(user.getCollege());
        return Result.ok(vo);
    }
}
