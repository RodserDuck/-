package com.campus.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {

    /**
     * 保存文件并返回可写入数据库的路径，如 /uploads/post/post_1_xx.png（不含 /api，由各端拼接）
     *
     * @param category 目录名：user、goods、post、lostfound、club、activity、notice
     */
    String store(MultipartFile file, String category, Long userId) throws IOException;
}
