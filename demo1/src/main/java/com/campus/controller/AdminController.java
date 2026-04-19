package com.campus.controller;

import com.campus.common.Result;
import com.campus.service.AdminService;
import com.campus.vo.LoginVO;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody LoginVO req) {
        try {
            LoginVO vo = adminService.login(req.getUsername(), req.getPassword());
            return Result.ok(vo);
        } catch (Exception e) {
            return Result.fail(e.getMessage());
        }
    }
}
