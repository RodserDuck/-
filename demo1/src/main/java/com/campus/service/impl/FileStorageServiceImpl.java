package com.campus.service.impl;

import com.campus.config.UploadProperties;
import com.campus.service.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final Set<String> ALLOWED_DIRS = Set.of(
            "user", "goods", "post", "lostfound", "club", "activity", "notice", "college"
    );

    private static final Set<String> ALLOWED_EXT = Set.of(
            ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"
    );

    private final UploadProperties uploadProperties;

    public FileStorageServiceImpl(UploadProperties uploadProperties) {
        this.uploadProperties = uploadProperties;
    }

    @Override
    public String store(MultipartFile file, String category, Long userId) throws IOException {
        if (category == null || category.isBlank()) {
            throw new IllegalArgumentException("请指定分类 category");
        }
        String dir = category.trim().toLowerCase(Locale.ROOT);
        if (!ALLOWED_DIRS.contains(dir)) {
            throw new IllegalArgumentException("不支持的分类目录: " + category);
        }
        String original = file.getOriginalFilename();
        String ext = extractExt(original);
        if (!ALLOWED_EXT.contains(ext)) {
            throw new IllegalArgumentException("仅支持图片格式: jpg/png/gif/webp/bmp");
        }

        String filename = dir + "_" + userId + "_" + System.currentTimeMillis()
                + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;

        Path base = uploadProperties.resolvedRoot();
        Path targetDir = base.resolve(dir);
        Files.createDirectories(targetDir);
        Path target = targetDir.resolve(filename);
        file.transferTo(target);
        // 仅存 /uploads/<分类>/文件名，不含 context-path；各端拼接 BASE_URL 或 /api 前缀访问
        return "/uploads/" + dir + "/" + filename;
    }

    private static String extractExt(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return ".png";
        }
        String ext = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase(Locale.ROOT);
        if (ext.length() > 8) {
            return ".png";
        }
        return ext;
    }
}
