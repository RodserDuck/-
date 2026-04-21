-- 为历史帖子补标题：从正文截取（最长 60 字符，超出加 ...）
-- 执行前请先备份；仅更新标题为空或纯空白的记录。
-- MySQL 5.7+ / 8.0

UPDATE `t_post`
SET `title` = CASE
  WHEN CHAR_LENGTH(TRIM(`content`)) <= 60 THEN TRIM(`content`)
  ELSE CONCAT(LEFT(TRIM(`content`), 57), '...')
END
WHERE `deleted` = 0
  AND `status` = 1
  AND (`title` IS NULL OR TRIM(IFNULL(`title`, '')) = '');
