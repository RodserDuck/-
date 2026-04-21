package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.Activity;
import com.campus.entity.ActivityRegistration;
import com.campus.entity.Club;
import com.campus.entity.ClubMember;
import com.campus.mapper.ActivityMapper;
import com.campus.mapper.ActivityRegistrationMapper;
import com.campus.mapper.ClubMapper;
import com.campus.mapper.ClubMemberMapper;
import com.campus.service.ActivityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ActivityServiceImpl implements ActivityService {

    private final ActivityMapper activityMapper;
    private final ActivityRegistrationMapper registrationMapper;
    private final ClubMapper clubMapper;
    private final ClubMemberMapper clubMemberMapper;

    public ActivityServiceImpl(ActivityMapper activityMapper,
                               ActivityRegistrationMapper registrationMapper,
                               ClubMapper clubMapper,
                               ClubMemberMapper clubMemberMapper) {
        this.activityMapper = activityMapper;
        this.registrationMapper = registrationMapper;
        this.clubMapper = clubMapper;
        this.clubMemberMapper = clubMemberMapper;
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
    public IPage<Activity> adminPage(int pageNum, int pageSize, String keyword) {
        Page<Activity> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Activity> q = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.trim().isEmpty()) {
            String k = keyword.trim();
            q.and(w -> w.like(Activity::getTitle, k).or().like(Activity::getDescription, k));
        }
        q.orderByDesc(Activity::getCreateTime);
        return activityMapper.selectPage(page, q);
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
        if (userId == null) throw new RuntimeException("请先登录");
        if (activity == null || activity.getClubId() == null) throw new RuntimeException("clubId 不能为空");
        // 发布活动仅团长可操作
        requireLeader(activity.getClubId(), userId);
        activity.setCreateTime(LocalDateTime.now());
        if (activity.getCurrentParticipants() == null) activity.setCurrentParticipants(0);
        activityMapper.insert(activity);
        return activity;
    }

    @Override
    @Transactional
    public Activity adminSave(Activity activity) {
        if (activity == null) throw new RuntimeException("参数错误");
        activity.setActivityId(null);
        if (activity.getCreateTime() == null) activity.setCreateTime(LocalDateTime.now());
        if (activity.getCurrentParticipants() == null) activity.setCurrentParticipants(0);
        activityMapper.insert(activity);
        return activity;
    }

    @Override
    @Transactional
    public Activity adminUpdate(Activity activity) {
        if (activity == null || activity.getActivityId() == null) throw new RuntimeException("参数错误");
        Activity existing = activityMapper.selectById(activity.getActivityId());
        if (existing == null) throw new RuntimeException("活动不存在");
        activityMapper.updateById(activity);
        return activityMapper.selectById(activity.getActivityId());
    }

    @Override
    @Transactional
    public void adminDelete(Long activityId) {
        if (activityId == null) throw new RuntimeException("参数错误");
        activityMapper.deleteById(activityId);
    }

    @Override
    @Transactional
    public Activity leaderSave(Activity activity, Long userId) {
        if (userId == null) throw new RuntimeException("请先登录");
        if (activity == null || activity.getClubId() == null) throw new RuntimeException("clubId 不能为空");
        requireLeader(activity.getClubId(), userId);
        activity.setActivityId(null);
        if (activity.getCreateTime() == null) activity.setCreateTime(LocalDateTime.now());
        if (activity.getCurrentParticipants() == null) activity.setCurrentParticipants(0);
        activityMapper.insert(activity);
        return activity;
    }

    @Override
    @Transactional
    public Activity leaderUpdate(Activity activity, Long userId) {
        if (userId == null) throw new RuntimeException("请先登录");
        if (activity == null || activity.getActivityId() == null) throw new RuntimeException("参数错误");
        Activity existing = activityMapper.selectById(activity.getActivityId());
        if (existing == null) throw new RuntimeException("活动不存在");
        requireLeader(existing.getClubId(), userId);

        // 团长不可将活动挪到其他社团
        activity.setClubId(existing.getClubId());
        activityMapper.updateById(activity);
        return activityMapper.selectById(activity.getActivityId());
    }

    @Override
    @Transactional
    public void leaderDelete(Long activityId, Long userId) {
        if (userId == null) throw new RuntimeException("请先登录");
        Activity existing = activityMapper.selectById(activityId);
        if (existing == null) throw new RuntimeException("活动不存在");
        requireLeader(existing.getClubId(), userId);
        activityMapper.deleteById(activityId);
    }

    @Override
    public List<Activity> leaderListByClub(Long clubId, Long userId) {
        if (userId == null) throw new RuntimeException("请先登录");
        if (clubId == null) throw new RuntimeException("clubId 不能为空");
        requireLeader(clubId, userId);
        return activityMapper.selectList(
            new LambdaQueryWrapper<Activity>()
                .eq(Activity::getClubId, clubId)
                .orderByDesc(Activity::getCreateTime)
        );
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

        // 社团外参与者人数上限：社团成员不受该上限限制
        Integer outsiderLimit = a.getOutsiderLimit();
        if (outsiderLimit != null && outsiderLimit > 0) {
            boolean isMember = clubMemberMapper.selectCount(new LambdaQueryWrapper<ClubMember>()
                .eq(ClubMember::getClubId, a.getClubId())
                .eq(ClubMember::getUserId, userId)
                .eq(ClubMember::getStatus, 1)
                .eq(ClubMember::getDeleted, 0)
            ).intValue() > 0;

            if (!isMember) {
                // 统计已报名的“社团外参与者”人数
                List<ActivityRegistration> regs = registrationMapper.selectList(
                    new LambdaQueryWrapper<ActivityRegistration>()
                        .eq(ActivityRegistration::getActivityId, activityId)
                        .eq(ActivityRegistration::getStatus, 1)
                );
                if (regs != null && !regs.isEmpty()) {
                    Set<Long> regUserIds = regs.stream().map(ActivityRegistration::getUserId).collect(Collectors.toSet());
                    if (!regUserIds.isEmpty()) {
                        List<ClubMember> members = clubMemberMapper.selectList(
                            new LambdaQueryWrapper<ClubMember>()
                                .select(ClubMember::getUserId)
                                .eq(ClubMember::getClubId, a.getClubId())
                                .eq(ClubMember::getStatus, 1)
                                .eq(ClubMember::getDeleted, 0)
                                .in(ClubMember::getUserId, regUserIds)
                        );
                        Set<Long> memberUserIds = members == null ? Set.of() : members.stream().map(ClubMember::getUserId).collect(Collectors.toSet());
                        int outsiderCount = regUserIds.size() - memberUserIds.size();
                        if (outsiderCount >= outsiderLimit) {
                            throw new RuntimeException("社团外参与者名额已满");
                        }
                    }
                }
            }
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

    @Override
    public List<Activity> getMyActivities(Long userId) {
        LambdaQueryWrapper<ActivityRegistration> q = new LambdaQueryWrapper<>();
        q.eq(ActivityRegistration::getUserId, userId)
         .eq(ActivityRegistration::getStatus, 1);
        List<ActivityRegistration> regs = registrationMapper.selectList(q);
        if (regs == null || regs.isEmpty()) return List.of();
        List<Long> activityIds = regs.stream()
            .map(ActivityRegistration::getActivityId)
            .collect(Collectors.toList());
        List<Activity> activities = activityMapper.selectBatchIds(activityIds);
        activities.sort((a, b) -> b.getCreateTime().compareTo(a.getCreateTime()));
        return activities;
    }

    private void requireLeader(Long clubId, Long userId) {
        Club club = clubMapper.selectById(clubId);
        if (club != null && Objects.equals(club.getLeaderId(), userId)) return;
        int cnt = clubMemberMapper.selectCount(new LambdaQueryWrapper<ClubMember>()
            .eq(ClubMember::getClubId, clubId)
            .eq(ClubMember::getUserId, userId)
            .eq(ClubMember::getStatus, 1)
            .eq(ClubMember::getRole, 2)).intValue();
        if (cnt == 0) throw new RuntimeException("仅团长可操作");
    }
}
