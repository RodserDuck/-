package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.Activity;

import java.util.List;

public interface ActivityService {
    List<Activity> listAll();
    List<Activity> listByClub(Long clubId);
    Activity getById(Long id);
    IPage<Activity> page(int pageNum, int pageSize);
    void incrementView(Long id);
    Activity saveActivity(Activity activity, Long userId);
    void register(Long activityId, Long userId);
    void cancelRegister(Long activityId, Long userId);
    List<Activity> getMyActivities(Long userId);
}
