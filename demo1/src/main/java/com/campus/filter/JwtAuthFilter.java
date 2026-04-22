package com.campus.filter;

import com.campus.utils.JwtUtils;
import com.campus.utils.ServletUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtAuthFilter implements HandlerInterceptor {

    private final JwtUtils jwtUtils;

    public JwtAuthFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = ServletUtils.getToken();
        if (token != null) {
            try {
                if (jwtUtils.isTokenValid(token)) {
                    // 正式登录 token：subject 为 userId
                    try {
                        Long userId = jwtUtils.getUserIdFromToken(token);
                        request.setAttribute("userId", userId);
                    } catch (Exception ignored) {
                        // 微信首次登录临时 token：subject 为 wx:openid
                        String wxOpenid = jwtUtils.getWxOpenidFromToken(token);
                        if (wxOpenid != null && !wxOpenid.isBlank()) {
                            request.setAttribute("wxOpenid", wxOpenid);
                        }
                    }
                }
            } catch (Exception ignored) {}
        }
        return true;
    }
}
