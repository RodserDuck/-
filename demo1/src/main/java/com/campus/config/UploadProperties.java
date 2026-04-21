package com.campus.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 本地上传根目录（相对运行目录或绝对路径），其下按类型分子目录：user、goods、post 等。
 */
@Component
@ConfigurationProperties(prefix = "campus.upload")
public class UploadProperties {

    /** 例如 uploads，对应磁盘目录 uploads/user、uploads/goods … */
    private String root = "uploads";

    public String getRoot() {
        return root;
    }

    public void setRoot(String root) {
        this.root = root;
    }

    public Path resolvedRoot() {
        if (root == null || root.isBlank()) {
            return Paths.get("uploads").toAbsolutePath().normalize();
        }

        Path configured = Paths.get(root);
        if (configured.isAbsolute()) {
            return configured.normalize();
        }

        Path abs = configured.toAbsolutePath().normalize();
        if (Files.exists(abs)) {
            return abs;
        }

        // 兼容：从仓库根目录启动时，实际目录可能在 demo1/uploads
        Path demo1Fallback = Paths.get("demo1").resolve(configured).toAbsolutePath().normalize();
        if (Files.exists(demo1Fallback)) {
            return demo1Fallback;
        }

        return abs;
    }
}
