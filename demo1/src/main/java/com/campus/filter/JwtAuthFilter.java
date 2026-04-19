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
                    Long userId = jwtUtils.getUserIdFromToken(token);
                    request.setAttribute("userId", userId);
                }
            } catch (Exception ignored) {}
        }
        return true;
    }
}
