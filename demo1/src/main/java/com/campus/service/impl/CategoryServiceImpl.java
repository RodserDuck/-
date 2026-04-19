package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.entity.Category;
import com.campus.mapper.CategoryMapper;
import com.campus.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    @Override
    public List<Category> listByType(String type) {
        return categoryMapper.selectList(
            new LambdaQueryWrapper<Category>()
                .eq(Category::getType, type)
                .eq(Category::getStatus, 1)
                .orderByAsc(Category::getSortOrder)
        );
    }
}
