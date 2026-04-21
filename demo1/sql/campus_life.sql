-- ============================================================
-- 校园生活服务平台 数据库脚本
-- 数据库名: campus_life
-- 编码: UTF-8MB4
-- 作者: 李炳德
-- 日期: 2026-04-19
-- ============================================================

CREATE DATABASE IF NOT EXISTS `campus_life`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE `campus_life`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------
-- 1. 管理员表
-- ------------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin` (
  `admin_id`       BIGINT NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  `username`       VARCHAR(50) NOT NULL COMMENT '用户名',
  `password`       VARCHAR(255) NOT NULL COMMENT '密码（加密）',
  `name`           VARCHAR(50)  DEFAULT NULL COMMENT '姓名',
  `phone`          VARCHAR(20)  DEFAULT NULL COMMENT '电话',
  `last_login_time` DATETIME    DEFAULT NULL COMMENT '最后登录时间',
  `create_time`   DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time`   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`        TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删 1-已删',
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `uk_admin_username`(`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='管理员表';
INSERT INTO `t_admin` VALUES (1, 'admin', '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2', '系统管理员', '13800138000', NULL, NOW(), NOW(), 0);

-- ------------------------------
-- 2. 用户表
-- ------------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `user_id`        BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `openid`         VARCHAR(100)  DEFAULT NULL COMMENT '微信openid',
  `username`       VARCHAR(50)  DEFAULT NULL COMMENT '用户名/昵称',
  `student_no`     VARCHAR(30)  DEFAULT NULL COMMENT '学号',
  `password`       VARCHAR(255) DEFAULT NULL COMMENT '密码（BCrypt加密）',
  `avatar`         VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `phone`          VARCHAR(20)  DEFAULT NULL COMMENT '手机号',
  `email`          VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `college`        VARCHAR(100) DEFAULT NULL COMMENT '学院',
  `major`          VARCHAR(100) DEFAULT NULL COMMENT '专业',
  `class_name`     VARCHAR(50)  DEFAULT NULL COMMENT '班级',
  `status`         TINYINT DEFAULT 1 COMMENT '状态：1-正常 0-禁用',
  `create_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `update_time`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`        TINYINT DEFAULT 0 COMMENT '逻辑删除',
  PRIMARY KEY (`user_id`),
  KEY `uk_user_openid`(`openid`),
  KEY `uk_user_student_no`(`student_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户表';
-- 密码均为 123456（BCrypt加密后的结果）
-- openid 格式为 student_ + 学号，与登录逻辑保持一致
INSERT INTO `t_user` VALUES (1, 'student_20220200649', '校园小达人', '20220200649', '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2', 'https://picsum.photos/200/200?random=10', '13800001111', 'lbb@example.com', '计算机与大数据科学学院', '计算机科学与技术', 'A2212', 1, NOW(), NOW(), 0);
INSERT INTO `t_user` VALUES (2, 'student_20220200650', '学霸君', '20220200650', '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2', 'https://picsum.photos/200/200?random=11', '13800002222', 'xueba@example.com', '计算机与大数据科学学院', '软件工程', 'A2212', 1, NOW(), NOW(), 0);
INSERT INTO `t_user` VALUES (3, 'student_20220200651', '运动达人', '20220200651', '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2', 'https://picsum.photos/200/200?random=12', '13800003333', 'sport@example.com', '体育学院', '体育教育', 'B2211', 1, NOW(), NOW(), 0);

-- 管理员密码也是 123456
INSERT INTO `t_admin` VALUES (1, 'admin', '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2', '系统管理员', '13800138000', NULL, NOW(), NOW(), 0);

-- ------------------------------
-- 2.1 学院字典表（供注册时选择）
-- ------------------------------
DROP TABLE IF EXISTS `t_college`;
CREATE TABLE `t_college` (
  `college_id`     BIGINT NOT NULL AUTO_INCREMENT COMMENT '学院ID',
  `name`           VARCHAR(100) NOT NULL COMMENT '学院名称',
  `code`           VARCHAR(50)  NOT NULL COMMENT '学院代码',
  `sort_order`     INT DEFAULT 0 COMMENT '排序',
  `status`        TINYINT DEFAULT 1 COMMENT '状态：1-启用 0-停用',
  `create_time`    DATETIME DEFAULT CURRENT_TIMESTAMP,
  `deleted`        TINYINT DEFAULT 0,
  PRIMARY KEY (`college_id`),
  UNIQUE KEY `uk_college_code`(`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='学院字典表';
INSERT INTO `t_college` VALUES (1,  '计算机与大数据科学学院', 'CS', 1,  1, NOW(), 0);
INSERT INTO `t_college` VALUES (2,  '人工智能学院',           'AI', 2,  1, NOW(), 0);
INSERT INTO `t_college` VALUES (3,  '软件学院',               'SE', 3,  1, NOW(), 0);
INSERT INTO `t_college` VALUES (4,  '信息与通信工程学院',     'ICT',4,  1, NOW(), 0);
INSERT INTO `t_college` VALUES (5,  '电子工程学院',           'EE', 5,  1, NOW(), 0);
INSERT INTO `t_college` VALUES (6,  '自动化学院',             'AU', 6,  1, NOW(), 0);
INSERT INTO `t_college` VALUES (7,  '机械工程学院',           'ME', 7,  1, NOW(), 0);
INSERT INTO `t_college` VALUES (8,  '土木与交通工程学院',     'CE', 8,  1, NOW(), 0);
INSERT INTO `t_college` VALUES (9,  '经济管理学院',           'EM', 9,  1, NOW(), 0);
INSERT INTO `t_college` VALUES (10, '法学院',                 'LA', 10, 1, NOW(), 0);
INSERT INTO `t_college` VALUES (11, '文学院',                 'CL', 11, 1, NOW(), 0);
INSERT INTO `t_college` VALUES (12, '外国语学院',             'FL', 12, 1, NOW(), 0);
INSERT INTO `t_college` VALUES (13, '理学院',                 'SC', 13, 1, NOW(), 0);
INSERT INTO `t_college` VALUES (14, '体育学院',               'PE', 14, 1, NOW(), 0);
INSERT INTO `t_college` VALUES (15, '艺术设计学院',           'AD', 15, 1, NOW(), 0);
INSERT INTO `t_college` VALUES (16, '马克思主义学院',         'MR', 16, 1, NOW(), 0);
INSERT INTO `t_college` VALUES (17, '教育学院',               'ED', 17, 1, NOW(), 0);
INSERT INTO `t_college` VALUES (18, '医学院',                 'MD', 18, 1, NOW(), 0);
INSERT INTO `t_college` VALUES (19, '护理学院',               'NM', 19, 1, NOW(), 0);
INSERT INTO `t_college` VALUES (20, '国际学院',               'IB', 20, 1, NOW(), 0);

-- ------------------------------
-- 3. 通知公告表
-- ------------------------------
DROP TABLE IF EXISTS `t_notice`;
CREATE TABLE `t_notice` (
  `notice_id`   BIGINT NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title`       VARCHAR(200) NOT NULL COMMENT '标题',
  `content`     TEXT COMMENT '内容',
  `admin_id`    BIGINT DEFAULT NULL COMMENT '发布管理员ID',
  `type`        VARCHAR(50) DEFAULT 'SYSTEM' COMMENT '类型：SYSTEM-系统 ALL-全校 COLLEGE-学院',
  `images`      VARCHAR(2000) DEFAULT NULL COMMENT '图片JSON数组',
  `is_top`      TINYINT DEFAULT 0 COMMENT '是否置顶：0-否 1-是',
  `view_count`  INT DEFAULT 0 COMMENT '浏览数',
  `status`      TINYINT DEFAULT 1 COMMENT '状态：0-下架 1-上架',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`     TINYINT DEFAULT 0,
  PRIMARY KEY (`notice_id`),
  KEY `idx_notice_admin`(`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='通知公告表';
INSERT INTO `t_notice` VALUES (1, '欢迎使用校园生活服务平台！', '这里可以发布帖子、买卖二手物品、寻找失物、参加社团活动...', 1, 'SYSTEM', NULL, 1, 256, 1, NOW(), NOW(), 0);
INSERT INTO `t_notice` VALUES (2, '2026年春季学期选课通知', '新学期选课系统已开放，请同学们在规定时间内完成选课...', 1, 'ALL', NULL, 1, 128, 1, NOW(), NOW(), 0);
INSERT INTO `t_notice` VALUES (3, '图书馆延长开放时间通知', '考试周期间图书馆开放时间延长至晚上22:30...', 1, 'COLLEGE', NULL, 0, 64, 1, NOW(), NOW(), 0);

-- ------------------------------
-- 4. 学院公告表
-- ------------------------------
DROP TABLE IF EXISTS `t_college_notice`;
CREATE TABLE `t_college_notice` (
  `notice_id`   BIGINT NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title`       VARCHAR(200) NOT NULL COMMENT '标题',
  `content`     TEXT COMMENT '内容',
  `admin_id`    BIGINT DEFAULT NULL COMMENT '发布管理员ID',
  `college`     VARCHAR(100) DEFAULT NULL COMMENT '所属学院',
  `images`      VARCHAR(2000) DEFAULT NULL COMMENT '图片',
  `view_count`  INT DEFAULT 0 COMMENT '浏览数',
  `status`      TINYINT DEFAULT 1 COMMENT '状态',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`     TINYINT DEFAULT 0,
  PRIMARY KEY (`notice_id`),
  KEY `idx_college`(`college`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='学院公告表';
INSERT INTO `t_college_notice` VALUES (1, '计算机学院2026届毕业设计答辩安排', '请相关同学按要求准备答辩材料，具体安排见附件...', 1, '计算机与大数据科学学院', NULL, 88, 1, NOW(), NOW(), 0);
INSERT INTO `t_college_notice` VALUES (2, '关于举办2026年校园科技文化节的通知', '本次科技文化节主题为"创新·融合·未来"...', 1, '计算机与大数据科学学院', NULL, 64, 1, NOW(), NOW(), 0);

-- ------------------------------
-- 5. 帖子表
-- ------------------------------
DROP TABLE IF EXISTS `t_post`;
CREATE TABLE `t_post` (
  `post_id`      BIGINT NOT NULL AUTO_INCREMENT COMMENT '帖子ID',
  `user_id`     BIGINT NOT NULL COMMENT '发布者ID',
  `title`       VARCHAR(200) DEFAULT NULL COMMENT '标题（可为空）',
  `content`     TEXT NOT NULL COMMENT '内容',
  `images`      VARCHAR(2000) DEFAULT NULL COMMENT '图片JSON数组',
  `category`     VARCHAR(50) DEFAULT '校园' COMMENT '分类',
  `like_count`   INT DEFAULT 0 COMMENT '点赞数',
  `comment_count` INT DEFAULT 0 COMMENT '评论数',
  `view_count`   INT DEFAULT 0 COMMENT '浏览数',
  `is_top`       TINYINT DEFAULT 0 COMMENT '是否置顶',
  `status`       TINYINT DEFAULT 1 COMMENT '状态：0-删除 1-正常',
  `create_time`  DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_time`  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`      TINYINT DEFAULT 0,
  PRIMARY KEY (`post_id`),
  KEY `idx_post_user`(`user_id`),
  KEY `idx_post_create_time`(`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='帖子表';
INSERT INTO `t_post` VALUES (1, 1, '夕阳下的图书馆太美了', '今天天气超级好，傍晚在校园里随手拍了几张！夕阳下的图书馆真的太美了，有没有人一起去拍照呀~', '["https://picsum.photos/600/600?random=20","https://picsum.photos/600/600?random=21"]', '校园', 328, 56, 512, 1, 1, NOW(), NOW(), 0);
INSERT INTO `t_post` VALUES (2, 2, '期末复习资料分享（高数线代概率）', '分享一份期末复习资料，涵盖高数、线代、概率论全套笔记，整理了两个月，亲测有效！', '["https://picsum.photos/600/600?random=23"]', '学习', 512, 89, 768, 0, 1, NOW(), NOW(), 0);
INSERT INTO `t_post` VALUES (3, 1, '食堂三楼麻辣烫推荐', '强烈推荐食堂三楼新开的麻辣烫！味道一绝，价格也很实惠，人均20元吃到撑，周末约起来~', NULL, '生活', 256, 42, 320, 0, 1, NOW(), NOW(), 0);
INSERT INTO `t_post` VALUES (4, 3, '校园十大歌手大赛复赛预告', '校园十大歌手大赛初赛圆满结束！恭喜晋级的30位选手，复赛将于4月20日在大学生活动中心举行，敬请期待！', NULL, '活动', 189, 34, 445, 0, 1, NOW(), NOW(), 0);

-- ------------------------------
-- 6. 帖子点赞表
-- ------------------------------
DROP TABLE IF EXISTS `t_post_like`;
CREATE TABLE `t_post_like` (
  `like_id`     BIGINT NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `user_id`     BIGINT NOT NULL COMMENT '用户ID',
  `post_id`     BIGINT NOT NULL COMMENT '帖子ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  `deleted`     TINYINT DEFAULT 0,
  PRIMARY KEY (`like_id`),
  UNIQUE KEY `uk_post_like`(`user_id`, `post_id`),
  KEY `idx_like_post`(`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='帖子点赞表';

-- ------------------------------
-- 7. 帖子评论表
-- ------------------------------
DROP TABLE IF EXISTS `t_comment`;
CREATE TABLE `t_comment` (
  `comment_id`     BIGINT NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `post_id`        BIGINT NOT NULL COMMENT '所属帖子ID',
  `user_id`        BIGINT NOT NULL COMMENT '评论者ID',
  `content`        TEXT NOT NULL COMMENT '评论内容',
  `parent_id`      BIGINT DEFAULT NULL COMMENT '父评论ID（回复）',
  `reply_to_user_id` BIGINT DEFAULT NULL COMMENT '回复目标用户ID',
  `like_count`     INT DEFAULT 0 COMMENT '点赞数',
  `create_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  `deleted`        TINYINT DEFAULT 0,
  PRIMARY KEY (`comment_id`),
  KEY `idx_comment_post`(`post_id`),
  KEY `idx_comment_user`(`user_id`),
  KEY `idx_comment_parent`(`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='帖子评论表';
INSERT INTO `t_comment` VALUES (1, 1, 2, '照片拍得好好看！是什么相机拍的呀？', NULL, NULL, 12, NOW(), 0);
INSERT INTO `t_comment` VALUES (2, 1, 1, '谢谢！用的是小米13 Ultra，手机拍的一样很棒！', 1, 2, 8, NOW(), 0);
INSERT INTO `t_comment` VALUES (3, 2, 1, '可以分享一下资料链接吗？', NULL, NULL, 5, NOW(), 0);

-- ------------------------------
-- 8. 社团表
-- ------------------------------
DROP TABLE IF EXISTS `t_club`;
CREATE TABLE `t_club` (
  `club_id`        BIGINT NOT NULL AUTO_INCREMENT COMMENT '社团ID',
  `name`           VARCHAR(100) NOT NULL COMMENT '社团名称',
  `description`    TEXT COMMENT '简介',
  `cover_image`    VARCHAR(500) DEFAULT NULL COMMENT '封面图',
  `category`       VARCHAR(50) DEFAULT '兴趣爱好' COMMENT '分类',
  `member_count`   INT DEFAULT 0 COMMENT '成员数',
  `activity_count` INT DEFAULT 0 COMMENT '活动数',
  `location`       VARCHAR(200) DEFAULT NULL COMMENT '活动地点',
  `leader_id`     BIGINT DEFAULT NULL COMMENT '团长ID',
  `contact`       VARCHAR(100) DEFAULT NULL COMMENT '联系方式',
  `status`         TINYINT DEFAULT 1 COMMENT '状态：0-解散 1-正常',
  `create_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`        TINYINT DEFAULT 0,
  PRIMARY KEY (`club_id`),
  KEY `idx_club_leader`(`leader_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='社团表';
INSERT INTO `t_club` VALUES (1, '摄影协会', '用镜头记录校园美好，定期组织外拍活动', 'https://picsum.photos/800/400?random=30', '文艺体育', 156, 12, '艺术楼201', 2, '微信：photo_club', 1, NOW(), NOW(), 0);
INSERT INTO `t_club` VALUES (2, '街舞社', '释放青春活力，舞动校园精彩', 'https://picsum.photos/800/400?random=31', '文艺体育', 89, 8, '体育馆舞蹈室', 3, '微信：dance123', 1, NOW(), NOW(), 0);
INSERT INTO `t_club` VALUES (3, '志愿者协会', '奉献爱心，服务社会，传递正能量', 'https://picsum.photos/800/400?random=32', '公益服务', 234, 15, '大学生活动中心', 1, '微信：volunteer2026', 1, NOW(), NOW(), 0);
INSERT INTO `t_club` VALUES (4, '机器人协会', '探索人工智能奥秘，培养科技创新人才', 'https://picsum.photos/800/400?random=33', '科技学术', 67, 6, '计算机楼实验室', NULL, '微信：robot2026', 1, NOW(), NOW(), 0);
INSERT INTO `t_club` VALUES (5, '吉他社', '用音乐连接你我，用旋律奏响青春', 'https://picsum.photos/800/400?random=34', '文艺体育', 112, 10, '艺术楼301', NULL, '微信：guitar2026', 1, NOW(), NOW(), 0);

-- ------------------------------
-- 9. 社团成员表（新增 status 字段：0-申请中 1-已加入）
-- ------------------------------
DROP TABLE IF EXISTS `t_club_member`;
CREATE TABLE `t_club_member` (
  `member_id`  BIGINT NOT NULL AUTO_INCREMENT COMMENT '成员记录ID',
  `club_id`    BIGINT NOT NULL COMMENT '社团ID',
  `user_id`    BIGINT NOT NULL COMMENT '用户ID',
  `role`       TINYINT DEFAULT 0 COMMENT '角色：0-成员 1-管理员 2-团长',
  `status`     TINYINT DEFAULT 1 COMMENT '状态：0-申请中 1-已加入',
  `join_time`  DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '申请/加入时间',
  `deleted`    TINYINT DEFAULT 0,
  PRIMARY KEY (`member_id`),
  UNIQUE KEY `uk_club_member`(`club_id`, `user_id`),
  KEY `idx_clubmember_user`(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='社团成员表';
-- 团长直接 status=1 已加入，普通成员也改为 status=1
INSERT INTO `t_club_member` VALUES (1, 1, 2, 2, 1, NOW(), 0);
INSERT INTO `t_club_member` VALUES (2, 1, 1, 0, 1, NOW(), 0);
INSERT INTO `t_club_member` VALUES (3, 2, 3, 2, 1, NOW(), 0);
INSERT INTO `t_club_member` VALUES (4, 2, 1, 0, 1, NOW(), 0);
INSERT INTO `t_club_member` VALUES (5, 3, 1, 2, 1, NOW(), 0);

-- ------------------------------
-- 10. 社团活动表
-- ------------------------------
DROP TABLE IF EXISTS `t_activity`;
CREATE TABLE `t_activity` (
  `activity_id`        BIGINT NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `club_id`           BIGINT DEFAULT NULL COMMENT '所属社团ID',
  `title`             VARCHAR(200) NOT NULL COMMENT '活动标题',
  `description`       TEXT COMMENT '活动描述',
  `cover_image`       VARCHAR(500) DEFAULT NULL COMMENT '封面图',
  `max_participants`  INT DEFAULT 0 COMMENT '人数上限（0=无限制）',
  `current_participants` INT DEFAULT 0 COMMENT '当前报名人数',
  `outsider_limit`    INT DEFAULT 0 COMMENT '社团外参与者人数上限（0=不限制）',
  `location`          VARCHAR(200) DEFAULT NULL COMMENT '活动地点',
  `start_time`        DATETIME DEFAULT NULL COMMENT '开始时间',
  `end_time`          DATETIME DEFAULT NULL COMMENT '结束时间',
  `contact`           VARCHAR(100) DEFAULT NULL COMMENT '联系方式',
  `organizer`        VARCHAR(100) DEFAULT NULL COMMENT '主办方',
  `view_count`        INT DEFAULT 0 COMMENT '浏览数',
  `status`            TINYINT DEFAULT 1 COMMENT '状态：0-取消 1-报名中 2-进行中 3-已结束',
  `create_time`       DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time`       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`           TINYINT DEFAULT 0,
  PRIMARY KEY (`activity_id`),
  KEY `idx_activity_club`(`club_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='社团活动表';
INSERT INTO `t_activity` VALUES (1, 1, '春季摄影大赛作品征集', '用镜头捕捉校园春色，奖项丰厚，欢迎投稿！', 'https://picsum.photos/800/400?random=40', 100, 45, 0, '线上投稿', '2026-04-01 00:00:00', '2026-04-30 23:59:59', '微信：photo_contest', '摄影协会', 320, 1, NOW(), NOW(), 0);
INSERT INTO `t_activity` VALUES (2, 2, '校园街舞快闪活动', '在图书馆广场进行街舞快闪表演，展示青春活力！', 'https://picsum.photos/800/400?random=41', 30, 18, 10, '图书馆广场', '2026-04-15 18:00:00', '2026-04-15 20:00:00', '微信：dance_club', '街舞社', 186, 1, NOW(), NOW(), 0);
INSERT INTO `t_activity` VALUES (3, 3, '敬老院志愿服务', '组织志愿者前往敬老院献爱心，陪伴老人聊天、帮忙打扫', 'https://picsum.photos/800/400?random=42', 20, 12, 5, '阳光敬老院', '2026-04-20 09:00:00', '2026-04-20 17:00:00', '微信：volunteer2026', '志愿者协会', 145, 1, NOW(), NOW(), 0);
INSERT INTO `t_activity` VALUES (4, 4, 'AI创新挑战赛', '基于大模型的创新应用开发比赛，万元奖金等你来拿！', 'https://picsum.photos/800/400?random=43', 50, 28, 20, '计算机楼报告厅', '2026-04-25 09:00:00', '2026-04-26 18:00:00', '微信：robot2026', '机器人协会', 432, 1, NOW(), NOW(), 0);

-- ------------------------------
-- 11. 活动报名表
-- ------------------------------
DROP TABLE IF EXISTS `t_activity_registration`;
CREATE TABLE `t_activity_registration` (
  `registration_id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '报名ID',
  `user_id`        BIGINT NOT NULL COMMENT '用户ID',
  `activity_id`    BIGINT NOT NULL COMMENT '活动ID',
  `remark`         VARCHAR(255) DEFAULT NULL COMMENT '报名备注',
  `status`         TINYINT DEFAULT 1 COMMENT '状态：1-已报名 2-已取消',
  `create_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
  `deleted`        TINYINT DEFAULT 0,
  PRIMARY KEY (`registration_id`),
  UNIQUE KEY `uk_activity_register`(`user_id`, `activity_id`),
  KEY `idx_reg_activity`(`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='活动报名表';

-- ------------------------------
-- 12. 二手商品表
-- ------------------------------
DROP TABLE IF EXISTS `t_second_hand`;
CREATE TABLE `t_second_hand` (
  `item_id`        BIGINT NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `user_id`        BIGINT NOT NULL COMMENT '卖家ID',
  `title`          VARCHAR(200) NOT NULL COMMENT '商品标题',
  `description`    TEXT COMMENT '商品描述',
  `images`         VARCHAR(2000) DEFAULT NULL COMMENT '图片JSON数组',
  `category_id`    BIGINT DEFAULT NULL COMMENT '分类ID',
  `original_price` DECIMAL(10,2) DEFAULT NULL COMMENT '原价',
  `price`          DECIMAL(10,2) NOT NULL COMMENT '售价',
  `condition_level` TINYINT DEFAULT 3 COMMENT '成色：1-全新 2-九成新 3-八成新 4-七成新 5-旧物',
  `trade_location` VARCHAR(200) DEFAULT NULL COMMENT '交易地点',
  `contact`        VARCHAR(100) DEFAULT NULL COMMENT '联系方式',
  `view_count`     INT DEFAULT 0 COMMENT '浏览数',
  `favorite_count` INT DEFAULT 0 COMMENT '收藏数',
  `status`         TINYINT DEFAULT 1 COMMENT '状态：0-下架 1-出售中 2-已售出',
  `create_time`    DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_time`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`        TINYINT DEFAULT 0,
  PRIMARY KEY (`item_id`),
  KEY `idx_goods_user`(`user_id`),
  KEY `idx_goods_category`(`category_id`),
  KEY `idx_goods_create`(`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='二手商品表';
INSERT INTO `t_second_hand` VALUES (1, 1, 'iPad Air 5 64G 深空灰 99新', '用了半年，配件齐全，无划痕，性能完美。', '["https://picsum.photos/400/400?random=50","https://picsum.photos/400/400?random=51"]', 1, 4399.00, 3200.00, 2, '西区宿舍楼下', '微信：lbb2026', 128, 18, 1, NOW(), NOW(), 0);
INSERT INTO `t_second_hand` VALUES (2, 2, '高等数学同济第七版上下册 送配套习题', '几乎全新，高分上岸学霸笔记，手写重点标注。', '["https://picsum.photos/400/400?random=52"]', 2, 89.00, 25.00, 2, '图书馆门口', '微信：xueba2026', 256, 32, 1, NOW(), NOW(), 0);
INSERT INTO `t_second_hand` VALUES (3, 1, '小米电动滑板车 校园代步', '续航30km，车况良好，带原装充电器和车锁。', '["https://picsum.photos/400/400?random=53","https://picsum.photos/400/400?random=54"]', 3, 1999.00, 680.00, 3, '3号宿舍楼', '微信：lbb2026', 88, 12, 1, NOW(), NOW(), 0);
INSERT INTO `t_second_hand` VALUES (4, 3, 'AirPods Pro 正品国行', '正品国行，在保，带购买凭证。', '["https://picsum.photos/400/400?random=55"]', 1, 1999.00, 899.00, 2, '食堂二楼', '微信：sport2026', 156, 24, 1, NOW(), NOW(), 0);
INSERT INTO `t_second_hand` VALUES (5, 2, '拍立得 mini9 粉色 送相纸2盒', '机身95新，相纸还有2盒，适合送礼物！', '["https://picsum.photos/400/400?random=56"]', 3, 599.00, 320.00, 3, '东区宿舍', '微信：xueba2026', 64, 8, 1, NOW(), NOW(), 0);

-- ------------------------------
-- 13. 商品分类表
-- ------------------------------
DROP TABLE IF EXISTS `t_category`;
CREATE TABLE `t_category` (
  `category_id`   BIGINT NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name`          VARCHAR(50) NOT NULL COMMENT '分类名称',
  `type`          VARCHAR(20) DEFAULT 'goods' COMMENT '类型：goods-商品 lostfound-失物招领',
  `icon`          VARCHAR(100) DEFAULT NULL COMMENT '图标',
  `sort_order`    INT DEFAULT 0 COMMENT '排序',
  `status`        TINYINT DEFAULT 1 COMMENT '状态',
  `create_time`   DATETIME DEFAULT CURRENT_TIMESTAMP,
  `deleted`       TINYINT DEFAULT 0,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='商品分类表';
INSERT INTO `t_category` VALUES (1, '数码电子', 'goods', '💻', 1, 1, NOW(), 0);
INSERT INTO `t_category` VALUES (2, '书籍文具', 'goods', '📚', 2, 1, NOW(), 0);
INSERT INTO `t_category` VALUES (3, '生活用品', 'goods', '🏠', 3, 1, NOW(), 0);
INSERT INTO `t_category` VALUES (4, '服饰鞋包', 'goods', '👔', 4, 1, NOW(), 0);
INSERT INTO `t_category` VALUES (5, '运动户外', 'goods', '⚽', 5, 1, NOW(), 0);
INSERT INTO `t_category` VALUES (6, '其他', 'goods', '📎', 99, 1, NOW(), 0);

-- ------------------------------
-- 14. 失物招领表
-- ------------------------------
DROP TABLE IF EXISTS `t_lost_found`;
CREATE TABLE `t_lost_found` (
  `lost_found_id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id`       BIGINT NOT NULL COMMENT '发布者ID',
  `type`          TINYINT NOT NULL COMMENT '类型：1-寻物 2-招领',
  `title`         VARCHAR(200) NOT NULL COMMENT '标题',
  `item_name`     VARCHAR(200) DEFAULT NULL COMMENT '物品名称',
  `description`   TEXT COMMENT '物品描述',
  `location`      VARCHAR(200) DEFAULT NULL COMMENT '地点',
  `lost_time`     DATETIME DEFAULT NULL COMMENT '丢失/拾取时间',
  `item_image`    VARCHAR(500) DEFAULT NULL COMMENT '物品图片',
  `contact`       VARCHAR(100) DEFAULT NULL COMMENT '联系方式',
  `status`        TINYINT DEFAULT 1 COMMENT '状态：0-关闭 1-寻找中 2-已找到',
  `view_count`    INT DEFAULT 0 COMMENT '浏览数',
  `create_time`   DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_time`   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`       TINYINT DEFAULT 0,
  PRIMARY KEY (`lost_found_id`),
  KEY `idx_lf_user`(`user_id`),
  KEY `idx_lf_type`(`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='失物招领表';
INSERT INTO `t_lost_found` VALUES (1, 1, 1, '寻物：学生证遗失', '学生证', '红色封皮，计算机学院，姓名：张三，学号：20220200649', '一教302教室', '2026-04-18 10:30:00', NULL, '微信：lbb2026', 1, 88, NOW(), NOW(), 0);
INSERT INTO `t_lost_found` VALUES (2, 2, 1, '寻物：黑色双肩包遗失', '双肩包', '黑色adidas双肩包，内有笔记本电脑和校园卡', '北区食堂', '2026-04-18 12:00:00', NULL, '微信：xueba2026', 1, 64, NOW(), NOW(), 0);
INSERT INTO `t_lost_found` VALUES (3, 3, 2, '招领：蓝色雨伞', '雨伞', '天堂伞蓝色，在一教门口捡到', '一教门口', '2026-04-18 08:30:00', NULL, '微信：sport2026', 1, 128, NOW(), NOW(), 0);
INSERT INTO `t_lost_found` VALUES (4, 1, 2, '招领：钥匙串 图书馆三楼', '钥匙串', '带蓝色小挂件的钥匙串，3把钥匙', '图书馆三楼', '2026-04-17 16:00:00', NULL, '微信：lbb2026', 1, 96, NOW(), NOW(), 0);
INSERT INTO `t_lost_found` VALUES (5, 2, 2, '招领：iPhone 14 黑色', '手机', '晚跑时在操场跑道旁捡到，已送至保卫处', '操场跑道', '2026-04-17 20:00:00', NULL, '电话：13800001111', 2, 256, NOW(), NOW(), 0);

-- ------------------------------
-- 15. 收藏表（帖子/商品/活动通用收藏）
-- ------------------------------
DROP TABLE IF EXISTS `t_lost_found_claim_record`;
CREATE TABLE `t_lost_found_claim_record` (
  `claim_id`       BIGINT NOT NULL AUTO_INCREMENT COMMENT '认领记录ID',
  `lost_found_id`  BIGINT NOT NULL COMMENT '失物招领记录ID',
  `publisher_id`   BIGINT NOT NULL COMMENT '发布者ID',
  `claimant_id`    BIGINT NOT NULL COMMENT '认领者ID',
  `type`           TINYINT NOT NULL COMMENT '类型：1-寻物 2-招领',
  `status`         TINYINT DEFAULT 0 COMMENT '状态：0-待处理 1-已匹配 2-已驳回',
  `remark`         VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `claim_time`     DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '认领时间',
  `create_time`    DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time`    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted`        TINYINT DEFAULT 0,
  PRIMARY KEY (`claim_id`),
  KEY `idx_claim_lf`(`lost_found_id`),
  KEY `idx_claim_pub`(`publisher_id`),
  KEY `idx_claimant`(`claimant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='失物招领认领记录表';
INSERT INTO `t_lost_found_claim_record` VALUES (1, 3, 3, 1, 2, 0, '疑似本人雨伞，等待核验', NOW(), NOW(), NOW(), 0);
INSERT INTO `t_lost_found_claim_record` VALUES (2, 5, 2, 3, 2, 1, '已当面核验并归还', NOW(), NOW(), NOW(), 0);

-- ------------------------------
-- 15. 收藏表（帖子/商品/活动通用收藏）
-- ------------------------------
DROP TABLE IF EXISTS `t_favorite`;
CREATE TABLE `t_favorite` (
  `favorite_id`  BIGINT NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id`      BIGINT NOT NULL COMMENT '用户ID',
  `item_id`      BIGINT NOT NULL COMMENT '目标ID（帖子/商品/活动）',
  `type`         VARCHAR(20) NOT NULL COMMENT '类型：post-帖子 goods-商品 activity-活动',
  `create_time`  DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  `deleted`      TINYINT DEFAULT 0,
  PRIMARY KEY (`favorite_id`),
  UNIQUE KEY `uk_favorite`(`user_id`, `item_id`, `type`),
  KEY `idx_fav_user`(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='收藏表';

-- ------------------------------
-- 16. 交易记录表（二手市场购买流程）
-- ------------------------------
DROP TABLE IF EXISTS `t_trade_record`;
CREATE TABLE `t_trade_record` (
  `record_id`    BIGINT NOT NULL AUTO_INCREMENT COMMENT '交易记录ID',
  `item_id`      BIGINT NOT NULL COMMENT '商品ID',
  `seller_id`    BIGINT NOT NULL COMMENT '卖家ID',
  `buyer_id`     BIGINT NOT NULL COMMENT '买家ID',
  `item_title`   VARCHAR(200) DEFAULT NULL COMMENT '商品标题（冗余）',
  `price`        DECIMAL(10,2) NOT NULL COMMENT '成交价格',
  `status`       TINYINT DEFAULT 0 COMMENT '状态：0-待确认 1-已完成 2-已取消',
  `remark`        VARCHAR(255) DEFAULT NULL COMMENT '买家留言',
  `create_time`   DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发起时间',
  `update_time`   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted`      TINYINT DEFAULT 0,
  PRIMARY KEY (`record_id`),
  KEY `idx_trade_item`(`item_id`),
  KEY `idx_trade_buyer`(`buyer_id`),
  KEY `idx_trade_seller`(`seller_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='交易记录表';

SET FOREIGN_KEY_CHECKS = 1;
