package com.campus.service;

import com.campus.entity.Admin;
import com.campus.vo.LoginVO;

public interface AdminService {
    LoginVO login(String username, String password);
}
