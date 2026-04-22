package com.campus.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "wechat.mini")
public class WechatMiniProperties {
    private String appid;
    private String secret;
}

