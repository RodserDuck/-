package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.Club;

import java.util.List;

public interface ClubService {
    List<Club> listAll();
    Club getById(Long id);
    IPage<Club> page(int pageNum, int pageSize, String category, String keyword);
    Club saveClub(Club club, Long userId);
    Club joinClub(Long userId, Long clubId);
    void leaveClub(Long userId, Long clubId);
    List<Club> getMyClubs(Long userId);
}
