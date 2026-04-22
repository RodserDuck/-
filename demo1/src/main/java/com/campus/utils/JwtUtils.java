package com.campus.utils;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String username) {
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("username", username)
                .claim("type", "USER")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey())
                .compact();
    }

    /**
     * 微信首次登录临时 token：不落库，只用于引导“完善资料”提交。
     */
    public String generateWxPreRegisterToken(String wxOpenid) {
        if (wxOpenid == null || wxOpenid.isBlank()) {
            throw new RuntimeException("wxOpenid 不能为空");
        }
        return Jwts.builder()
            .subject("wx:" + wxOpenid)
            .claim("type", "WX_PRE")
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + Math.min(expiration, 10 * 60 * 1000L)))
            .signWith(getKey())
            .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        return Long.parseLong(claims.getSubject());
    }

    public String getWxOpenidFromToken(String token) {
        Claims claims = parseToken(token);
        String sub = claims.getSubject();
        if (sub != null && sub.startsWith("wx:")) {
            return sub.substring(3);
        }
        return null;
    }

    public boolean isTokenValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
