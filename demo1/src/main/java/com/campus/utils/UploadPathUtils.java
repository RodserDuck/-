package com.campus.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.TextNode;

/**
 * 图片路径入库规范：仅存 /uploads/...，去掉误带的 /api 前缀（与小程序、管理端约定一致）。
 */
public final class UploadPathUtils {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private UploadPathUtils() {}

    /** images 字段为 JSON 数组字符串，逐条规范化路径 */
    public static String normalizeImagesJson(String imagesJson) {
        if (imagesJson == null || imagesJson.isBlank()) {
            return imagesJson;
        }
        try {
            JsonNode root = MAPPER.readTree(imagesJson);
            if (!root.isArray()) {
                return imagesJson;
            }
            ArrayNode arr = (ArrayNode) root;
            for (int i = 0; i < arr.size(); i++) {
                JsonNode n = arr.get(i);
                if (n != null && n.isTextual()) {
                    arr.set(i, TextNode.valueOf(normalizePath(n.asText())));
                }
            }
            return MAPPER.writeValueAsString(arr);
        } catch (Exception e) {
            return imagesJson;
        }
    }

    public static String normalizePath(String path) {
        if (path == null || path.isBlank()) {
            return path;
        }
        String p = path.trim();
        if (p.startsWith("http://") || p.startsWith("https://")) {
            return p;
        }
        while (p.startsWith("/api")) {
            p = p.substring(4);
            if (!p.startsWith("/")) {
                p = "/" + p;
            }
        }
        if (!p.startsWith("/")) {
            p = "/" + p;
        }
        return p;
    }
}
