package com.campus.controller;

import com.campus.common.Result;
import com.campus.entity.College;
import com.campus.service.CollegeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/college")
public class CollegeController {

    private final CollegeService collegeService;

    public CollegeController(CollegeService collegeService) {
        this.collegeService = collegeService;
    }

    @GetMapping("/list")
    public Result<List<College>> list() {
        return Result.ok(collegeService.getAllColleges());
    }
}
