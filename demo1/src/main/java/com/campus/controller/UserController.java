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
}
