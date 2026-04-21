package com.campus.controller;

import com.campus.common.Result;
import com.campus.service.FileStorageService;
import com.campus.utils.ServletUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * 单文件上传。表单字段：file、category（user/goods/post/lostfound/club/activity/notice/college）
     */
    @PostMapping
    public Result<Map<String, String>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category) {
        Long userId = ServletUtils.getUserId();
        if (userId == null) {
            return Result.fail("请先登录");
        }
        if (file == null || file.isEmpty()) {
            return Result.fail("请选择图片文件");
        }
        try {
            String url = fileStorageService.store(file, category, userId);
            return Result.ok(Map.of("url", url));
        } catch (IllegalArgumentException e) {
            return Result.fail(400, e.getMessage());
        } catch (Exception e) {
            return Result.fail(500, "上传失败");
        }
    }
}
