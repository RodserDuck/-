package com.campus.controller;

import com.campus.common.Result;
import com.campus.entity.Category;
import com.campus.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /** 分类列表 */
    @GetMapping("/list")
    public Result<List<Category>> list(@RequestParam(required = false, defaultValue = "goods") String type) {
        return Result.ok(categoryService.listByType(type));
    }
}
