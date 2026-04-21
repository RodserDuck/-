package com.campus.admin;

import com.campus.entity.Admin;
import com.campus.mapper.AdminMapper;
import com.campus.utils.ServletUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class AdminAuthHelper {

    private final AdminMapper adminMapper;

    public AdminAuthHelper(AdminMapper adminMapper) {
        this.adminMapper = adminMapper;
    }

    /** 校验当前 JWT 对应管理员账号，返回管理员主键 */
    public Long requireAdminId() {
        Long uid = ServletUtils.getUserId();
        if (uid == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "请先登录");
        }
        Admin admin = adminMapper.selectById(uid);
        if (admin == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "非管理员账号");
        }
        return uid;
    }
}
