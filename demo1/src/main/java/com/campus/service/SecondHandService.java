package com.campus.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.campus.entity.SecondHand;

import java.util.List;

public interface SecondHandService {
    List<SecondHand> listAll();
    IPage<SecondHand> page(int pageNum, int pageSize, Long categoryId, String keyword);
    SecondHand getById(Long id);
    void incrementView(Long id);
    SecondHand save(SecondHand goods, Long userId);
    void delete(Long itemId, Long userId);
    List<SecondHand> getMyGoods(Long userId);
    SecondHand updateMyGoods(Long itemId, Long userId, SecondHand patch);
    void updateMyGoodsStatus(Long itemId, Long userId, Integer status);

    IPage<SecondHand> adminPage(int pageNum, int pageSize, Long categoryId, String keyword, String userKeyword);

    void adminDelete(Long itemId);
}
