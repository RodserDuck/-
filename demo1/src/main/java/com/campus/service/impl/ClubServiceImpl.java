package com.campus.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.Club;
import com.campus.entity.ClubMember;
import com.campus.entity.User;
import com.campus.mapper.ClubMapper;
import com.campus.mapper.ClubMemberMapper;
import com.campus.mapper.UserMapper;
import com.campus.service.ClubService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClubServiceImpl implements ClubService {

    private final ClubMapper clubMapper;
    private final ClubMemberMapper clubMemberMapper;
    private final UserMapper userMapper;

    public ClubServiceImpl(ClubMapper clubMapper, ClubMemberMapper clubMemberMapper, UserMapper userMapper) {
        this.clubMapper = clubMapper;
        this.clubMemberMapper = clubMemberMapper;
        this.userMapper = userMapper;
    }

    @Override
    public List<Club> listAll() {
        return clubMapper.selectList(
            new LambdaQueryWrapper<Club>().eq(Club::getStatus, 1)
                .orderByDesc(Club::getMemberCount)
        );
    }

    @Override
    public Club getById(Long id) {
        return clubMapper.selectById(id);
    }

    @Override
    public IPage<Club> page(int pageNum, int pageSize, String category, String keyword) {
        Page<Club> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Club> q = new LambdaQueryWrapper<>();
        q.eq(Club::getStatus, 1);
        if (category != null && !category.isEmpty()) q.eq(Club::getCategory, category);
        if (keyword != null && !keyword.trim().isEmpty()) {
            String k = keyword.trim();
            q.and(w -> w.like(Club::getName, k).or().like(Club::getDescription, k));
        }
        q.orderByDesc(Club::getMemberCount);
        return clubMapper.selectPage(page, q);
    }

    @Override
    public IPage<Club> adminPage(int pageNum, int pageSize, String category, String keyword) {
        Page<Club> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<Club> q = new LambdaQueryWrapper<>();
        if (category != null && !category.isEmpty()) q.eq(Club::getCategory, category);
        if (keyword != null && !keyword.trim().isEmpty()) {
            String k = keyword.trim();
            q.and(w -> w.like(Club::getName, k).or().like(Club::getDescription, k));
        }
        q.orderByDesc(Club::getCreateTime);
        return clubMapper.selectPage(page, q);
    }

    @Override
    public Club saveClub(Club club, Long userId) {
        club.setLeaderId(userId);
        club.setCreateTime(LocalDateTime.now());
        clubMapper.insert(club);
        ClubMember m = new ClubMember();
        m.setClubId(club.getClubId());
        m.setUserId(userId);
        m.setRole(2);
        m.setStatus(1); // 团长直接通过
        m.setJoinTime(LocalDateTime.now());
        clubMemberMapper.insert(m);
        return club;
    }

    /**
     * 申请加入社团（需要审核）
     */
    @Override
    @Transactional
    public Club joinClub(Long userId, Long clubId) {
        LambdaQueryWrapper<ClubMember> q = new LambdaQueryWrapper<>();
        q.eq(ClubMember::getUserId, userId).eq(ClubMember::getClubId, clubId);
        ClubMember existing = clubMemberMapper.selectOne(q);
        if (existing != null) {
            if (existing.getStatus() == 1) {
                throw new RuntimeException("已加入该社团");
            } else {
                throw new RuntimeException("申请正在审核中，请等待");
            }
        }
        ClubMember m = new ClubMember();
        m.setClubId(clubId);
        m.setUserId(userId);
        m.setRole(0);
        m.setStatus(0); // 申请中
        m.setJoinTime(LocalDateTime.now());
        clubMemberMapper.insert(m);
        return clubMapper.selectById(clubId);
    }

    @Override
    @Transactional
    public void leaveClub(Long userId, Long clubId) {
        LambdaQueryWrapper<ClubMember> q = new LambdaQueryWrapper<>();
        q.eq(ClubMember::getUserId, userId).eq(ClubMember::getClubId, clubId);
        clubMemberMapper.delete(q);
        Club club = clubMapper.selectById(clubId);
        if (club != null && club.getMemberCount() > 0) {
            club.setMemberCount(club.getMemberCount() - 1);
            clubMapper.updateById(club);
        }
    }

    @Override
    public List<Club> getMyClubs(Long userId) {
        LambdaQueryWrapper<ClubMember> qm = new LambdaQueryWrapper<>();
        qm.eq(ClubMember::getUserId, userId).eq(ClubMember::getStatus, 1);
        List<ClubMember> members = clubMemberMapper.selectList(qm);
        if (members.isEmpty()) return List.of();
        List<Long> clubIds = members.stream().map(ClubMember::getClubId).toList();
        return clubMapper.selectList(
            new LambdaQueryWrapper<Club>()
                .in(Club::getClubId, clubIds)
                .eq(Club::getStatus, 1)
        );
    }

    @Override
    public IPage<ClubMember> adminApplicationPage(int pageNum, int pageSize, Long clubId, String keyword) {
        Page<ClubMember> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<ClubMember> q = new LambdaQueryWrapper<>();
        q.eq(ClubMember::getStatus, 0);
        if (clubId != null) {
            q.eq(ClubMember::getClubId, clubId);
        }
        if (keyword != null && !keyword.trim().isEmpty()) {
            String k = keyword.trim();
            List<User> users = userMapper.selectList(new LambdaQueryWrapper<User>()
                .select(User::getUserId)
                .and(w -> w.like(User::getUsername, k)
                    .or().like(User::getStudentNo, k)
                    .or().like(User::getPhone, k)));
            if (users.isEmpty()) {
                q.eq(ClubMember::getMemberId, -1L);
            } else {
                q.in(ClubMember::getUserId, users.stream().map(User::getUserId).toList());
            }
        }
        q.orderByDesc(ClubMember::getJoinTime);
        IPage<ClubMember> result = clubMemberMapper.selectPage(page, q);
        fillApplicantInfo(result.getRecords());
        return result;
    }

    @Override
    @Transactional
    public void approveApplication(Long memberId) {
        ClubMember m = clubMemberMapper.selectById(memberId);
        if (m == null) throw new RuntimeException("申请记录不存在");
        if (m.getStatus() != null && m.getStatus() == 1) return;
        m.setStatus(1);
        clubMemberMapper.updateById(m);
        Club club = clubMapper.selectById(m.getClubId());
        if (club != null) {
            int cnt = club.getMemberCount() == null ? 0 : club.getMemberCount();
            club.setMemberCount(cnt + 1);
            clubMapper.updateById(club);
        }
    }

    @Override
    @Transactional
    public void rejectApplication(Long memberId) {
        ClubMember m = clubMemberMapper.selectById(memberId);
        if (m == null) throw new RuntimeException("申请记录不存在");
        clubMemberMapper.deleteById(memberId);
    }

    private void fillApplicantInfo(List<ClubMember> members) {
        if (members == null || members.isEmpty()) return;
        for (ClubMember m : members) {
            User u = userMapper.selectById(m.getUserId());
            if (u != null) {
                m.setUsername(u.getUsername());
                m.setStudentNo(u.getStudentNo());
                m.setPhone(u.getPhone());
            }
        }
    }
}
