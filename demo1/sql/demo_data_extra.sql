-- ============================================================
-- 校园生活服务平台 - 追加演示数据（可在 campus_life.sql 之后执行）
-- 说明：
-- 1) 默认数据库名：campus_life
-- 2) 图片文件需存在于后端运行目录下 uploads/ 对应子目录：
--    uploads/user, uploads/post, uploads/goods, uploads/club, uploads/activity, uploads/notice, uploads/college, uploads/lostfound
-- 3) 本项目后端通过 /api/uploads/** 映射到磁盘 uploads/**（见 WebConfig + UploadProperties）
-- ============================================================

USE `campus_life`;
SET NAMES utf8mb4;

-- ------------------------------
-- A. 将已有 demo 数据的 picsum 图片替换为本地 uploads（与 demo1/uploads/* 对应）
-- ------------------------------
UPDATE `t_user` SET `avatar` = '/uploads/user/user_1.jpg' WHERE `user_id` = 1;
UPDATE `t_user` SET `avatar` = '/uploads/user/user_2.jpg' WHERE `user_id` = 2;
UPDATE `t_user` SET `avatar` = '/uploads/user/user_3.jpg' WHERE `user_id` = 3;

UPDATE `t_notice` SET `images` = '["/uploads/notice/notice_1.jpg"]' WHERE `notice_id` = 1;
UPDATE `t_notice` SET `images` = '["/uploads/notice/notice_2.jpg"]' WHERE `notice_id` = 2;
UPDATE `t_notice` SET `images` = '["/uploads/notice/notice_3.jpg"]' WHERE `notice_id` = 3;

UPDATE `t_college_notice` SET `images` = '["/uploads/college/college_1.jpg"]' WHERE `notice_id` = 1;
UPDATE `t_college_notice` SET `images` = '["/uploads/college/college_2.jpg"]' WHERE `notice_id` = 2;

UPDATE `t_post` SET `images` = '["/uploads/post/post_1.jpg","/uploads/post/post_2.jpg"]' WHERE `post_id` = 1;
UPDATE `t_post` SET `images` = '["/uploads/post/post_3.jpg"]' WHERE `post_id` = 2;

UPDATE `t_club` SET `cover_image` = '/uploads/club/club_1.jpg' WHERE `club_id` = 1;
UPDATE `t_club` SET `cover_image` = '/uploads/club/club_2.jpg' WHERE `club_id` = 2;
UPDATE `t_club` SET `cover_image` = '/uploads/club/club_3.jpg' WHERE `club_id` = 3;
UPDATE `t_club` SET `cover_image` = '/uploads/club/club_4.jpg' WHERE `club_id` = 4;
UPDATE `t_club` SET `cover_image` = '/uploads/club/club_5.jpg' WHERE `club_id` = 5;

UPDATE `t_activity` SET `cover_image` = '/uploads/activity/activity_1.jpg' WHERE `activity_id` = 1;
UPDATE `t_activity` SET `cover_image` = '/uploads/activity/activity_2.jpg' WHERE `activity_id` = 2;
UPDATE `t_activity` SET `cover_image` = '/uploads/activity/activity_3.jpg' WHERE `activity_id` = 3;
UPDATE `t_activity` SET `cover_image` = '/uploads/activity/activity_4.jpg' WHERE `activity_id` = 4;

UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_1.jpg","/uploads/goods/goods_2.jpg"]' WHERE `item_id` = 1;
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_3.jpg"]' WHERE `item_id` = 2;
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_4.jpg","/uploads/goods/goods_5.jpg"]' WHERE `item_id` = 3;
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_6.jpg"]' WHERE `item_id` = 4;
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_7.jpg"]' WHERE `item_id` = 5;

-- lost_found 表主键为 lost_found_id
UPDATE `t_lost_found` SET `item_image` = '/uploads/lostfound/lostfound_1.jpg' WHERE `lost_found_id` = 1;
UPDATE `t_lost_found` SET `item_image` = '/uploads/lostfound/lostfound_2.jpg' WHERE `lost_found_id` = 2;
UPDATE `t_lost_found` SET `item_image` = '/uploads/lostfound/lostfound_3.jpg' WHERE `lost_found_id` = 3;
UPDATE `t_lost_found` SET `item_image` = '/uploads/lostfound/lostfound_4.jpg' WHERE `lost_found_id` = 4;
UPDATE `t_lost_found` SET `item_image` = '/uploads/lostfound/lostfound_5.jpg' WHERE `lost_found_id` = 5;

-- ------------------------------
-- B. 追加用户（密码同 campus_life.sql：123456 的 BCrypt）
-- ------------------------------
INSERT INTO `t_user` (`user_id`,`openid`,`username`,`student_no`,`password`,`avatar`,`phone`,`email`,`college`,`major`,`class_name`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 4,'student_20220200652','吉他少年','20220200652','$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2','/uploads/user/user_4.jpg','13800004444','guitar@example.com','文学院','汉语言文学','C2210',1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_user` WHERE `user_id`=4);

INSERT INTO `t_user` (`user_id`,`openid`,`username`,`student_no`,`password`,`avatar`,`phone`,`email`,`college`,`major`,`class_name`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 5,'student_20220200653','志愿小队长','20220200653','$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2','/uploads/user/user_5.jpg','13800005555','vol@example.com','马克思主义学院','思想政治教育','D2209',1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_user` WHERE `user_id`=5);

INSERT INTO `t_user` (`user_id`,`openid`,`username`,`student_no`,`password`,`avatar`,`phone`,`email`,`college`,`major`,`class_name`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 6,'student_20220200654','二手达人','20220200654','$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2','/uploads/user/user_6.jpg','13800006666','trade@example.com','经济管理学院','市场营销','E2208',1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_user` WHERE `user_id`=6);

INSERT INTO `t_user` (`user_id`,`openid`,`username`,`student_no`,`password`,`avatar`,`phone`,`email`,`college`,`major`,`class_name`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 7,'student_20220200655','跑步打卡王','20220200655','$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2','/uploads/user/user_7.jpg','13800007777','run@example.com','体育学院','体育教育','B2211',1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_user` WHERE `user_id`=7);

INSERT INTO `t_user` (`user_id`,`openid`,`username`,`student_no`,`password`,`avatar`,`phone`,`email`,`college`,`major`,`class_name`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 8,'student_20220200656','社团活动控','20220200656','$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2','/uploads/user/user_8.jpg','13800008888','club@example.com','人工智能学院','人工智能','AI2210',1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_user` WHERE `user_id`=8);

-- ------------------------------
-- C. 追加公告/学院公告
-- ------------------------------
INSERT INTO `t_notice` (`notice_id`,`title`,`content`,`admin_id`,`type`,`images`,`is_top`,`view_count`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 4,'校园网升级维护通知','今晚 23:30-01:00 校园网升级维护，期间可能短暂断网。',1,'ALL','[\"/uploads/notice/notice_4.jpg\"]',0,42,1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_notice` WHERE `notice_id`=4);

INSERT INTO `t_notice` (`notice_id`,`title`,`content`,`admin_id`,`type`,`images`,`is_top`,`view_count`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 5,'五一假期出行安全提示','请同学们注意人身与财产安全，谨防诈骗，夜间结伴出行。',1,'SYSTEM','[\"/uploads/notice/notice_5.jpg\"]',0,31,1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_notice` WHERE `notice_id`=5);

INSERT INTO `t_college_notice` (`notice_id`,`title`,`content`,`admin_id`,`college`,`images`,`view_count`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 3,'计算机学院实验室开放预约','近期实验室开放预约系统更新，请同学们通过统一入口预约。',1,'计算机与大数据科学学院','[\"/uploads/college/college_3.jpg\"]',22,1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_college_notice` WHERE `notice_id`=3);

-- ------------------------------
-- D. 追加帖子（带本地图）
-- ------------------------------
INSERT INTO `t_post` (`post_id`,`user_id`,`title`,`content`,`images`,`category`,`like_count`,`comment_count`,`view_count`,`is_top`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 5,4,'吉他社招新｜零基础也欢迎','每周两次练习+月度小演出，欢迎来体验！','[\"/uploads/post/post_4.jpg\"]','活动',66,9,120,0,1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_post` WHERE `post_id`=5);

INSERT INTO `t_post` (`post_id`,`user_id`,`title`,`content`,`images`,`category`,`like_count`,`comment_count`,`view_count`,`is_top`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 6,6,'二手交易避坑指南（新生必看）','交易建议走线下当面验货，贵重物品最好录开箱视频。','[\"/uploads/post/post_5.jpg\",\"/uploads/post/post_6.jpg\"]','生活',88,12,210,0,1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_post` WHERE `post_id`=6);

INSERT INTO `t_post` (`post_id`,`user_id`,`title`,`content`,`images`,`category`,`like_count`,`comment_count`,`view_count`,`is_top`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 7,7,'操场夜跑搭子来一个','每天晚上 8 点操场，配速 6~7，想找一起坚持的同学。',NULL,'日常分享',54,6,90,0,1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_post` WHERE `post_id`=7);

-- ------------------------------
-- E. 追加社团/活动（封面本地化）
-- ------------------------------
INSERT INTO `t_club` (`club_id`,`name`,`description`,`cover_image`,`category`,`member_count`,`activity_count`,`location`,`leader_id`,`contact`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 6,'羽毛球社','以球会友，周末约球，欢迎零基础入门','/uploads/club/club_6.jpg','文艺体育',78,5,'体育馆羽毛球场',7,'微信：badminton_2026',1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_club` WHERE `club_id`=6);

INSERT INTO `t_club` (`club_id`,`name`,`description`,`cover_image`,`category`,`member_count`,`activity_count`,`location`,`leader_id`,`contact`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 7,'编程社','刷题、项目、比赛组队，互相成长','/uploads/club/club_7.jpg','科技学术',130,9,'计算机楼 4F',2,'微信：code_club',1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_club` WHERE `club_id`=7);

INSERT INTO `t_activity` (`activity_id`,`club_id`,`title`,`description`,`cover_image`,`max_participants`,`current_participants`,`location`,`start_time`,`end_time`,`contact`,`organizer`,`view_count`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 5,7,'ACM 周赛训练营','每周一次训练+讲题，适合想入门竞赛的同学','/uploads/activity/activity_5.jpg',60,19,'计算机楼报告厅','2026-04-28 19:00:00','2026-04-28 21:00:00','微信：code_club','编程社',80,1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_activity` WHERE `activity_id`=5);

INSERT INTO `t_activity` (`activity_id`,`club_id`,`title`,`description`,`cover_image`,`max_participants`,`current_participants`,`location`,`start_time`,`end_time`,`contact`,`organizer`,`view_count`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 6,6,'周末羽毛球友谊赛','随机组队双打，奖品丰富','/uploads/activity/activity_6.jpg',40,22,'体育馆羽毛球场','2026-04-27 14:00:00','2026-04-27 17:00:00','微信：badminton_2026','羽毛球社',120,1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_activity` WHERE `activity_id`=6);

-- ------------------------------
-- F. 追加二手商品（带本地图）
-- ------------------------------
INSERT INTO `t_second_hand`
(`item_id`,`user_id`,`title`,`description`,`images`,`category_id`,`original_price`,`price`,`condition_level`,`trade_location`,`contact`,`view_count`,`favorite_count`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 6,6,'罗技机械键盘 K840 95新','正常使用痕迹，功能完好，送键帽拔器',
'[\"/uploads/goods/goods_8.jpg\",\"/uploads/goods/goods_9.jpg\"]',1,399.00,188.00,3,'一教门口','微信：trade666',66,4,1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_second_hand` WHERE `item_id`=6);

INSERT INTO `t_second_hand`
(`item_id`,`user_id`,`title`,`description`,`images`,`category_id`,`original_price`,`price`,`condition_level`,`trade_location`,`contact`,`view_count`,`favorite_count`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 7,4,'民谣吉他 41寸 入门款','琴弦刚换，适合新手练习',
'[\"/uploads/goods/goods_10.jpg\"]',3,499.00,260.00,3,'艺术楼门口','微信：guitar666',35,2,1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_second_hand` WHERE `item_id`=7);

INSERT INTO `t_second_hand`
(`item_id`,`user_id`,`title`,`description`,`images`,`category_id`,`original_price`,`price`,`condition_level`,`trade_location`,`contact`,`view_count`,`favorite_count`,`status`,`create_time`,`update_time`,`deleted`)
SELECT 8,2,'线代习题册+笔记（含答案）','备考自用，标注清晰',
'[\"/uploads/goods/goods_11.jpg\",\"/uploads/goods/goods_12.jpg\"]',2,69.00,18.00,2,'图书馆','微信：xueba2026',120,9,1,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_second_hand` WHERE `item_id`=8);

-- ------------------------------
-- G. 追加失物招领（带本地图）
-- ------------------------------
INSERT INTO `t_lost_found`
(`lost_found_id`,`user_id`,`type`,`title`,`item_name`,`description`,`location`,`lost_time`,`item_image`,`contact`,`status`,`view_count`,`create_time`,`update_time`,`deleted`)
SELECT 6,5,1,'寻物：白色充电宝','充电宝','白色小米充电宝，侧面有贴纸','二教阶梯教室','2026-04-19 19:30:00','/uploads/lostfound/lostfound_6.jpg','微信：vol2026',1,20,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_lost_found` WHERE `lost_found_id`=6);

INSERT INTO `t_lost_found`
(`lost_found_id`,`user_id`,`type`,`title`,`item_name`,`description`,`location`,`lost_time`,`item_image`,`contact`,`status`,`view_count`,`create_time`,`update_time`,`deleted`)
SELECT 7,6,2,'招领：校园卡（计算机学院）','校园卡','在食堂一楼收银台附近捡到','北区食堂','2026-04-20 12:10:00','/uploads/lostfound/lostfound_7.jpg','微信：trade666',1,44,NOW(),NOW(),0
WHERE NOT EXISTS (SELECT 1 FROM `t_lost_found` WHERE `lost_found_id`=7);

