package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.Club;
import com.campus.entity.ClubMember;

import java.util.List;

public interface ClubService {
    List<Club> listAll();
    Club getById(Long id);
    IPage<Club> page(int pageNum, int pageSize, String category, String keyword);
    Club saveClub(Club club, Long userId);
    Club joinClub(Long userId, Long clubId);
    void leaveClub(Long userId, Long clubId);
    List<Club> getMyClubs(Long userId);

    IPage<Club> adminPage(int pageNum, int pageSize, String category, String keyword);

    IPage<ClubMember> adminApplicationPage(int pageNum, int pageSize, Long clubId, String keyword);

    void approveApplication(Long memberId);

    void rejectApplication(Long memberId);

    Club adminSave(Club club);

    Club adminUpdate(Club club);

    List<ClubMember> adminMemberList(Long clubId, String keyword);

    List<ClubMember> leaderMemberList(Long clubId, Long userId, String keyword);
}
