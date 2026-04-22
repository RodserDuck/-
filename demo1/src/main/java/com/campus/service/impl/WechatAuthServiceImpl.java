package com.campus.service.impl;

import com.campus.config.WechatMiniProperties;
import com.campus.service.WechatAuthService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class WechatAuthServiceImpl implements WechatAuthService {

    private final WechatMiniProperties props;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public WechatAuthServiceImpl(WechatMiniProperties props, ObjectMapper objectMapper) {
        this.props = props;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder()
            .baseUrl("https://api.weixin.qq.com")
            .build();
    }

    @Override
    public WechatSession code2Session(String code) {
        if (code == null || code.trim().isEmpty()) {
            throw new RuntimeException("code 不能为空");
        }
        if (props.getAppid() == null || props.getAppid().isBlank()
            || props.getSecret() == null || props.getSecret().isBlank()) {
            throw new RuntimeException("服务端未配置 wechat.mini.appid/secret");
        }

        String body = restClient.get()
            .uri(uriBuilder -> uriBuilder
                .path("/sns/jscode2session")
                .queryParam("appid", props.getAppid())
                .queryParam("secret", props.getSecret())
                .queryParam("js_code", code.trim())
                .queryParam("grant_type", "authorization_code")
                .build())
            .accept(MediaType.APPLICATION_JSON)
            .retrieve()
            .body(String.class);

        try {
            JsonNode n = objectMapper.readTree(body);
            if (n.hasNonNull("errcode") && n.get("errcode").asInt() != 0) {
                String msg = n.hasNonNull("errmsg") ? n.get("errmsg").asText() : "微信登录失败";
                throw new RuntimeException("微信登录失败：" + msg);
            }
            String openid = n.hasNonNull("openid") ? n.get("openid").asText() : null;
            String unionid = n.hasNonNull("unionid") ? n.get("unionid").asText() : null;
            String sessionKey = n.hasNonNull("session_key") ? n.get("session_key").asText() : null;
            if (openid == null || openid.isBlank()) {
                throw new RuntimeException("微信登录失败：未获取到 openid");
            }
            return new WechatSession(openid, unionid, sessionKey);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("微信登录失败：响应解析错误");
        }
    }
}

