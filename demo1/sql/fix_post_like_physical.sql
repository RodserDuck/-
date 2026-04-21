-- 修复：历史上若曾使用逻辑删除，t_post_like 中会残留 deleted=1 的行，
-- 仍占用 uk_post_like(user_id,post_id)，导致取消赞后再点赞 INSERT 报 Duplicate entry。
-- 在更新后端代码后执行一次本脚本即可清理（仅影响“已逻辑删除”的点赞记录）。

DELETE FROM `t_post_like` WHERE `deleted` = 1;
