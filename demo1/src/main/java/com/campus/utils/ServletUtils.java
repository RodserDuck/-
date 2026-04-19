package com.campus.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class ServletUtils {

    public static HttpServletRequest getRequest() {
        ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attrs != null ? attrs.getRequest() : null;
    }

    public static Long getUserId() {
        HttpServletRequest req = getRequest();
        if (req == null) return null;
        Object userId = req.getAttribute("userId");
        return userId != null ? Long.parseLong(userId.toString()) : null;
    }

    public static String getToken() {
        HttpServletRequest req = getRequest();
        if (req == null) return null;
        String auth = req.getHeader("Authorization");
        if (auth != null && auth.startsWith("Bearer ")) {
            return auth.substring(7);
        }
        return null;
    }
}
