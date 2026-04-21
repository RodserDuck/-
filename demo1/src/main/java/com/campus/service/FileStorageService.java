package com.campus.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {

    /**
     * 保存文件并返回可写入数据库的访问路径，如 /uploads/post/post_1_xx.png
     *
     * @param category 目录名：user、goods、post、lostfound、club、activity、notice
     */
    String store(MultipartFile file, String category, Long userId) throws IOException;
}
