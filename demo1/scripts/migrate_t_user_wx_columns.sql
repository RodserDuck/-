-- 升级已有库：为 t_user 增加微信登录字段（与后端 User 实体一致）
-- 在 Navicat / mysql 命令行中执行，库名按实际修改（默认 campus_life）

USE `campus_life`;

-- 若已执行过会报 Duplicate column name，可忽略该行后重新执行剩余语句
ALTER TABLE `t_user`
  ADD COLUMN `wx_openid` varchar(100) NULL DEFAULT NULL COMMENT '微信小程序openid（code2Session）' AFTER `openid`;

ALTER TABLE `t_user`
  ADD COLUMN `wx_unionid` varchar(100) NULL DEFAULT NULL COMMENT '微信unionid（若已绑定开放平台）' AFTER `wx_openid`;

-- 若已存在会报 Duplicate key name，可忽略
ALTER TABLE `t_user`
  ADD UNIQUE INDEX `uk_user_wx_openid` (`wx_openid`);
