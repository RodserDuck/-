package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.Activity;
import com.campus.entity.ActivityRegistration;
import com.campus.mapper.ActivityMapper;
import com.campus.mapper.ActivityRegistrationMapper;
import com.campus.service.ActivityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityServiceImpl implements ActivityService {

    private final ActivityMapper activityMapper;
    private final ActivityRegistrationMapper registrationMapper;

    public ActivityServiceImpl(ActivityMapper activityMapper,
                               ActivityRegistrationMapper registrationMapper) {
        this.activityMapper = activityMapper;
        this.registrationMapper = registrationMapper;
    }

    @Override
    public List<Activity> listAll() {
        return activityMapper.selectList(
            new LambdaQueryWrapper<Activity>()
                .eq(Activity::getStatus, 1)
                .orderByDesc(Activity::getCreateTime)
        );
    }

    @Override
    public List<Activity> listByClub(Long clubId) {
        return activityMapper.selectList(
            new LambdaQueryWrapper<Activity>()
                .eq(Activity::getClubId, clubId)
                .eq(Activity::getStatus, 1)
                .orderByDesc(Activity::getStartTime)
        );
    }

    @Override
    public Activity getById(Long id) {
        return activityMapper.selectById(id);
    }

    @Override
    public IPage<Activity> page(int pageNum, int pageSize) {
        Page<Activity> page = new Page<>(pageNum, pageSize);
        return activityMapper.selectPage(page,
            new LambdaQueryWrapper<Activity>()
                .eq(Activity::getStatus, 1)
                .orderByDesc(Activity::getCreateTime)
        );
    }

    @Override
    public void incrementView(Long id) {
        Activity a = activityMapper.selectById(id);
        if (a != null) {
            a.setViewCount(a.getViewCount() + 1);
            activityMapper.updateById(a);
        }
    }

    @Override
    public Activity saveActivity(Activity activity, Long userId) {
        activity.setCreateTime(LocalDateTime.now());
        activityMapper.insert(activity);
        return activity;
    }

    @Override
    @Transactional
    public void register(Long activityId, Long userId) {
        LambdaQueryWrapper<ActivityRegistration> q = new LambdaQueryWrapper<>();
        q.eq(ActivityRegistration::getUserId, userId)
         .eq(ActivityRegistration::getActivityId, activityId);
        if (registrationMapper.selectCount(q).intValue() > 0) {
            throw new RuntimeException("已报名该活动");
        }
        Activity a = activityMapper.selectById(activityId);
        if (a.getMaxParticipants() > 0 &&
            a.getCurrentParticipants() >= a.getMaxParticipants()) {
            throw new RuntimeException("报名人数已满");
        }
        ActivityRegistration r = new ActivityRegistration();
        r.setActivityId(activityId);
        r.setUserId(userId);
        r.setStatus(1);
        r.setCreateTime(LocalDateTime.now());
        registrationMapper.insert(r);
        a.setCurrentParticipants(a.getCurrentParticipants() + 1);
        activityMapper.updateById(a);
    }

    @Override
    @Transactional
    public void cancelRegister(Long activityId, Long userId) {
        LambdaQueryWrapper<ActivityRegistration> q = new LambdaQueryWrapper<>();
        q.eq(ActivityRegistration::getUserId, userId)
         .eq(ActivityRegistration::getActivityId, activityId);
        registrationMapper.delete(q);
        Activity a = activityMapper.selectById(activityId);
        if (a != null && a.getCurrentParticipants() > 0) {
            a.setCurrentParticipants(a.getCurrentParticipants() - 1);
            activityMapper.updateById(a);
        }
    }
}
