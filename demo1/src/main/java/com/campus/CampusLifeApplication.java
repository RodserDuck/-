package com.campus;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.campus.config.WechatMiniProperties;

@SpringBootApplication
@MapperScan("com.campus.mapper")
@EnableConfigurationProperties(WechatMiniProperties.class)
public class CampusLifeApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampusLifeApplication.class, args);
    }
}
