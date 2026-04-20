package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.entity.College;
import com.campus.mapper.CollegeMapper;
import com.campus.service.CollegeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollegeServiceImpl implements CollegeService {

    private final CollegeMapper collegeMapper;

    public CollegeServiceImpl(CollegeMapper collegeMapper) {
        this.collegeMapper = collegeMapper;
    }

    @Override
    public List<College> getAllColleges() {
        LambdaQueryWrapper<College> q = new LambdaQueryWrapper<>();
        q.eq(College::getStatus, 1).orderByAsc(College::getSortOrder);
        return collegeMapper.selectList(q);
    }
}
