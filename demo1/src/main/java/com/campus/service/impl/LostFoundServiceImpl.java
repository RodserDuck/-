package com.campus.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.entity.LostFound;
import com.campus.mapper.LostFoundMapper;
import com.campus.service.LostFoundService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LostFoundServiceImpl implements LostFoundService {

    private final LostFoundMapper lostFoundMapper;

    public LostFoundServiceImpl(LostFoundMapper lostFoundMapper) {
        this.lostFoundMapper = lostFoundMapper;
    }

    @Override
    public IPage<LostFound> page(int pageNum, int pageSize, Integer type) {
        Page<LostFound> page = new Page<>(pageNum, pageSize);
        var q = new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<LostFound>();
        if (type != null) q.eq(LostFound::getType, type);
        q.eq(LostFound::getStatus, 1).orderByDesc(LostFound::getCreateTime);
        return lostFoundMapper.selectPage(page, q);
    }

    @Override
    public LostFound getById(Long id) {
        return lostFoundMapper.selectById(id);
    }

    @Override
    public void incrementView(Long id) {
        LostFound l = lostFoundMapper.selectById(id);
        if (l != null) {
            l.setViewCount(l.getViewCount() + 1);
            lostFoundMapper.updateById(l);
        }
    }

    @Override
    public LostFound save(LostFound lostFound, Long userId) {
        lostFound.setUserId(userId);
        lostFound.setStatus(1);
        lostFound.setViewCount(0);
        lostFound.setCreateTime(LocalDateTime.now());
        lostFoundMapper.insert(lostFound);
        return lostFound;
    }

    @Override
    public void updateStatus(Long id, Integer status) {
        LostFound l = lostFoundMapper.selectById(id);
        if (l != null) {
            l.setStatus(status);
            lostFoundMapper.updateById(l);
        }
    }
}
