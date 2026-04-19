package com.campus.service;

import com.campus.entity.Category;
import java.util.List;

public interface CategoryService {
    List<Category> listByType(String type);
}
