package com.campus.config;

import com.campus.common.Result;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

/**
 * 统一 JSON 错误体；401/403 等与 Result 一致，便于管理端解析 code/msg。
 */
@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Result<Void>> handleResponseStatus(ResponseStatusException ex) {
        String msg = ex.getReason() != null ? ex.getReason() : ex.getStatusCode().toString();
        int code = ex.getStatusCode().value();
        return ResponseEntity.status(ex.getStatusCode()).body(Result.fail(code, msg));
    }

    @ExceptionHandler(RuntimeException.class)
    public Result<?> handle(RuntimeException e) {
        return Result.fail(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public Result<?> handle(Exception e) {
        return Result.fail(500, "服务器错误：" + e.getMessage());
    }
}
