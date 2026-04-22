/*
 Navicat Premium Dump SQL

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50744 (5.7.44-log)
 Source Host           : localhost:3306
 Source Schema         : campus_life

 Target Server Type    : MySQL
 Target Server Version : 50744 (5.7.44-log)
 File Encoding         : 65001

 Date: 21/04/2026 21:25:29
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_activity
-- ----------------------------
DROP TABLE IF EXISTS `t_activity`;
CREATE TABLE `t_activity`  (
  `activity_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `club_id` bigint(20) NULL DEFAULT NULL COMMENT '所属社团ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '活动标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '活动描述',
  `cover_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面图',
  `max_participants` int(11) NULL DEFAULT 0 COMMENT '人数上限（0=无限制）',
  `current_participants` int(11) NULL DEFAULT 0 COMMENT '当前报名人数',
  `outsider_limit` int(11) NULL DEFAULT 0 COMMENT '社团外参与者人数上限（0=不限制）',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '活动地点',
  `start_time` datetime NULL DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime NULL DEFAULT NULL COMMENT '结束时间',
  `contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `organizer` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '主办方',
  `view_count` int(11) NULL DEFAULT 0 COMMENT '浏览数',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-取消 1-报名中 2-进行中 3-已结束',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`activity_id`) USING BTREE,
  INDEX `idx_activity_club`(`club_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '社团活动表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_activity
-- ----------------------------
INSERT INTO `t_activity` VALUES (1, 1, '春季摄影大赛作品征集', '用镜头捕捉校园春色，奖项丰厚，欢迎投稿！', '/uploads/activity/activity_1.jpg', 100, 46, 0, '线上投稿', '2026-04-01 00:00:00', '2026-04-30 23:59:59', '微信：photo_contest', '摄影协会', 324, 1, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_activity` VALUES (2, 2, '校园街舞快闪活动', '在图书馆广场进行街舞快闪表演，展示青春活力！', '/uploads/activity/activity_2.jpg', 30, 18, 10, '图书馆广场', '2026-04-15 18:00:00', '2026-04-15 20:00:00', '微信：dance_club', '街舞社', 186, 1, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_activity` VALUES (3, 3, '敬老院志愿服务', '组织志愿者前往敬老院献爱心，陪伴老人聊天、帮忙打扫', '/uploads/activity/activity_3.jpg', 20, 12, 5, '阳光敬老院', '2026-04-20 09:00:00', '2026-04-20 17:00:00', '微信：volunteer2026', '志愿者协会', 145, 1, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_activity` VALUES (4, 4, 'AI创新挑战赛', '基于大模型的创新应用开发比赛，万元奖金等你来拿！', '/uploads/activity/activity_4.jpg', 50, 28, 20, '计算机楼报告厅', '2026-04-25 09:00:00', '2026-04-26 18:00:00', '微信：robot2026', '机器人协会', 432, 1, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_activity` VALUES (5, 7, 'ACM 周赛训练营', '每周一次训练+讲题，适合想入门竞赛的同学', '/uploads/activity/activity_5.jpg', 60, 19, 20, '计算机楼报告厅', '2026-04-28 19:00:00', '2026-04-28 21:00:00', '微信：code_club', '编程社', 80, 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0);
INSERT INTO `t_activity` VALUES (6, 6, '周末羽毛球友谊赛', '随机组队双打，奖品丰富', '/uploads/activity/activity_6.jpg', 40, 22, 15, '体育馆羽毛球场', '2026-04-27 14:00:00', '2026-04-27 17:00:00', '微信：badminton_2026', '羽毛球社', 120, 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0);

-- ----------------------------
-- Table structure for t_activity_registration
-- ----------------------------
DROP TABLE IF EXISTS `t_activity_registration`;
CREATE TABLE `t_activity_registration`  (
  `registration_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '报名ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `activity_id` bigint(20) NOT NULL COMMENT '活动ID',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '报名备注',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：1-已报名 2-已取消',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`registration_id`) USING BTREE,
  UNIQUE INDEX `uk_activity_register`(`user_id`, `activity_id`) USING BTREE,
  INDEX `idx_reg_activity`(`activity_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '活动报名表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_activity_registration
-- ----------------------------
INSERT INTO `t_activity_registration` VALUES (1, 2, 1, NULL, 1, '2026-04-20 18:20:08', 0);

-- ----------------------------
-- Table structure for t_admin
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin`  (
  `admin_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码（加密）',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '电话',
  `last_login_time` datetime NULL DEFAULT NULL COMMENT '最后登录时间',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(4) NULL DEFAULT 0 COMMENT '逻辑删除：0-未删 1-已删',
  PRIMARY KEY (`admin_id`) USING BTREE,
  UNIQUE INDEX `uk_admin_username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '管理员表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_admin
-- ----------------------------
INSERT INTO `t_admin` VALUES (1, 'admin', '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2', '系统管理员', '13800138000', '2026-04-21 12:47:46', '2026-04-19 14:36:14', '2026-04-20 15:39:31', 0);

-- ----------------------------
-- Table structure for t_category
-- ----------------------------
DROP TABLE IF EXISTS `t_category`;
CREATE TABLE `t_category`  (
  `category_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '分类名称',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'goods' COMMENT '类型：goods-商品 lostfound-失物招领',
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图标',
  `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`category_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '商品分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_category
-- ----------------------------
INSERT INTO `t_category` VALUES (1, '数码电子', 'goods', '💻', 1, 1, '2026-04-19 14:36:15', 0);
INSERT INTO `t_category` VALUES (2, '书籍文具', 'goods', '📚', 2, 1, '2026-04-19 14:36:15', 0);
INSERT INTO `t_category` VALUES (3, '生活用品', 'goods', '🏠', 3, 1, '2026-04-19 14:36:15', 0);
INSERT INTO `t_category` VALUES (4, '服饰鞋包', 'goods', '👔', 4, 1, '2026-04-19 14:36:15', 0);
INSERT INTO `t_category` VALUES (5, '运动户外', 'goods', '⚽', 5, 1, '2026-04-19 14:36:15', 0);
INSERT INTO `t_category` VALUES (6, '其他', 'goods', '📎', 99, 1, '2026-04-19 14:36:15', 0);

-- ----------------------------
-- Table structure for t_club
-- ----------------------------
DROP TABLE IF EXISTS `t_club`;
CREATE TABLE `t_club`  (
  `club_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '社团ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '社团名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '简介',
  `cover_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '封面图',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '兴趣爱好' COMMENT '分类',
  `member_count` int(11) NULL DEFAULT 0 COMMENT '成员数',
  `activity_count` int(11) NULL DEFAULT 0 COMMENT '活动数',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '活动地点',
  `leader_id` bigint(20) NULL DEFAULT NULL COMMENT '团长ID',
  `contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-解散 1-正常',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`club_id`) USING BTREE,
  INDEX `idx_club_leader`(`leader_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '社团表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_club
-- ----------------------------
INSERT INTO `t_club` VALUES (1, '摄影协会', '用镜头记录校园美好，定期组织外拍活动', '/uploads/club/club_1.jpg', '文艺体育', 156, 12, '艺术楼201', 2, '微信：photo_club', 1, '2026-04-19 14:36:14', '2026-04-21 19:12:35', 0);
INSERT INTO `t_club` VALUES (2, '街舞社', '释放青春活力，舞动校园精彩', '/uploads/club/club_2.jpg', '文艺体育', 89, 8, '体育馆舞蹈室', 6, '微信：dance123', 1, '2026-04-19 14:36:14', '2026-04-21 21:03:39', 0);
INSERT INTO `t_club` VALUES (3, '志愿者协会', '奉献爱心，服务社会，传递正能量', '/uploads/club/club_3.jpg', '公益服务', 234, 15, '大学生活动中心', 5, '微信：volunteer2026', 1, '2026-04-19 14:36:14', '2026-04-21 21:03:36', 0);
INSERT INTO `t_club` VALUES (4, '机器人协会', '探索人工智能奥秘，培养科技创新人才', '/uploads/club/club_4.jpg', '科技学术', 67, 6, '计算机楼实验室', 4, '微信：robot2026', 1, '2026-04-19 14:36:14', '2026-04-21 21:03:26', 0);
INSERT INTO `t_club` VALUES (5, '吉他社', '用音乐连接你我，用旋律奏响青春', '/uploads/club/club_5.jpg', '文艺体育', 112, 10, '艺术楼301', 3, '微信：guitar2026', 1, '2026-04-19 14:36:14', '2026-04-21 21:03:25', 0);
INSERT INTO `t_club` VALUES (6, '羽毛球社', '以球会友，周末约球，欢迎零基础入门', '/uploads/club/club_6.jpg', '文艺体育', 78, 5, '体育馆羽毛球场', 7, '微信：badminton_2026', 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0);
INSERT INTO `t_club` VALUES (7, '编程社', '刷题、项目、比赛组队，互相成长', '/uploads/club/club_7.jpg', '科技学术', 130, 9, '计算机楼 4F', 1, '微信：code_club', 1, '2026-04-21 19:12:35', '2026-04-21 21:03:31', 0);

-- ----------------------------
-- Table structure for t_club_member
-- ----------------------------
DROP TABLE IF EXISTS `t_club_member`;
CREATE TABLE `t_club_member`  (
  `member_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '成员记录ID',
  `club_id` bigint(20) NOT NULL COMMENT '社团ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `role` tinyint(4) NULL DEFAULT 0 COMMENT '角色：0-成员 1-管理员 2-团长',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-申请中 1-已加入',
  `join_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`member_id`) USING BTREE,
  UNIQUE INDEX `uk_club_member`(`club_id`, `user_id`) USING BTREE,
  INDEX `idx_clubmember_user`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '社团成员表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_club_member
-- ----------------------------
-- 注意：t_club_member 数据会在文件末尾根据 t_club + t_user 重建（含新增用户随机入团）

-- ----------------------------
-- Table structure for t_college
-- ----------------------------
DROP TABLE IF EXISTS `t_college`;
CREATE TABLE `t_college`  (
  `college_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '学院ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '学院名称',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '学院代码',
  `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：1-启用 0-停用',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`college_id`) USING BTREE,
  UNIQUE INDEX `uk_college_code`(`code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '学院字典表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_college
-- ----------------------------
INSERT INTO `t_college` VALUES (1, '计算机与大数据科学学院', 'CS', 1, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (2, '人工智能学院', 'AI', 2, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (3, '软件学院', 'SE', 3, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (4, '信息与通信工程学院', 'ICT', 4, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (5, '电子工程学院', 'EE', 5, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (6, '自动化学院', 'AU', 6, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (7, '机械工程学院', 'ME', 7, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (8, '土木与交通工程学院', 'CE', 8, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (9, '经济管理学院', 'EM', 9, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (10, '法学院', 'LA', 10, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (11, '文学院', 'CL', 11, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (12, '外国语学院', 'FL', 12, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (13, '理学院', 'SC', 13, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (14, '体育学院', 'PE', 14, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (15, '艺术设计学院', 'AD', 15, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (16, '马克思主义学院', 'MR', 16, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (17, '教育学院', 'ED', 17, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (18, '医学院', 'MD', 18, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (19, '护理学院', 'NM', 19, 1, '2026-04-20 15:18:52', 0);
INSERT INTO `t_college` VALUES (20, '国际学院', 'IB', 20, 1, '2026-04-20 15:18:52', 0);

-- ----------------------------
-- Table structure for t_college_notice
-- ----------------------------
DROP TABLE IF EXISTS `t_college_notice`;
CREATE TABLE `t_college_notice`  (
  `notice_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容',
  `admin_id` bigint(20) NULL DEFAULT NULL COMMENT '发布管理员ID',
  `college` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '所属学院',
  `images` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片',
  `view_count` int(11) NULL DEFAULT 0 COMMENT '浏览数',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`notice_id`) USING BTREE,
  INDEX `idx_college`(`college`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '学院公告表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_college_notice
-- ----------------------------
INSERT INTO `t_college_notice` VALUES (1, '计算机学院2026届毕业设计答辩安排', '请相关同学按要求准备答辩材料，具体安排见附件...', 1, '计算机与大数据科学学院', '[\"/uploads/college/college_1.jpg\"]', 88, 1, '2026-04-19 14:36:14', '2026-04-21 19:12:35', 0);
INSERT INTO `t_college_notice` VALUES (2, '关于举办2026年校园科技文化节的通知', '本次科技文化节主题为\"创新·融合·未来\"...', 1, '计算机与大数据科学学院', '[\"/uploads/college/college_2.jpg\"]', 64, 1, '2026-04-19 14:36:14', '2026-04-21 19:12:35', 0);
INSERT INTO `t_college_notice` VALUES (3, '计算机学院实验室开放预约', '近期实验室开放预约系统更新，请同学们通过统一入口预约。', 1, '计算机与大数据科学学院', '[\"/uploads/college/college_3.jpg\"]', 22, 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0);

-- ----------------------------
-- Table structure for t_comment
-- ----------------------------
DROP TABLE IF EXISTS `t_comment`;
CREATE TABLE `t_comment`  (
  `comment_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `post_id` bigint(20) NOT NULL COMMENT '所属帖子ID',
  `user_id` bigint(20) NOT NULL COMMENT '评论者ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '评论内容',
  `parent_id` bigint(20) NULL DEFAULT NULL COMMENT '父评论ID（回复）',
  `reply_to_user_id` bigint(20) NULL DEFAULT NULL COMMENT '回复目标用户ID',
  `like_count` int(11) NULL DEFAULT 0 COMMENT '点赞数',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`comment_id`) USING BTREE,
  INDEX `idx_comment_post`(`post_id`) USING BTREE,
  INDEX `idx_comment_user`(`user_id`) USING BTREE,
  INDEX `idx_comment_parent`(`parent_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '帖子评论表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_comment
-- ----------------------------
INSERT INTO `t_comment` VALUES (1, 1, 2, '照片拍得好好看！是什么相机拍的呀？', NULL, NULL, 12, '2026-04-19 14:36:14', 0);
INSERT INTO `t_comment` VALUES (2, 1, 1, '谢谢！用的是小米13 Ultra，手机拍的一样很棒！', 1, 2, 8, '2026-04-19 14:36:14', 0);
INSERT INTO `t_comment` VALUES (3, 2, 1, '可以分享一下资料链接吗？', NULL, NULL, 5, '2026-04-19 14:36:14', 0);
INSERT INTO `t_comment` VALUES (4, 3, 1, '真的好吃', NULL, NULL, 0, '2026-04-20 15:49:28', 0);
INSERT INTO `t_comment` VALUES (5, 2, 2, '真的不错', NULL, NULL, 0, '2026-04-21 10:16:50', 0);
INSERT INTO `t_comment` VALUES (6, 2, 2, '我也在用', 5, 2, 0, '2026-04-21 10:16:58', 0);

-- ----------------------------
-- Table structure for t_favorite
-- ----------------------------
DROP TABLE IF EXISTS `t_favorite`;
CREATE TABLE `t_favorite`  (
  `favorite_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `item_id` bigint(20) NOT NULL COMMENT '目标ID（帖子/商品/活动）',
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '类型：post-帖子 goods-商品 activity-活动',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`favorite_id`) USING BTREE,
  UNIQUE INDEX `uk_favorite`(`user_id`, `item_id`, `type`) USING BTREE,
  INDEX `idx_fav_user`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '收藏表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_favorite
-- ----------------------------

-- ----------------------------
-- Table structure for t_lost_found
-- ----------------------------
DROP TABLE IF EXISTS `t_lost_found`;
CREATE TABLE `t_lost_found`  (
  `lost_found_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` bigint(20) NOT NULL COMMENT '发布者ID',
  `type` tinyint(4) NOT NULL COMMENT '类型：1-寻物 2-招领',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `item_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '物品名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '物品描述',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '地点',
  `lost_time` datetime NULL DEFAULT NULL COMMENT '丢失/拾取时间',
  `item_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '物品图片',
  `contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-关闭 1-寻找中 2-已找到',
  `view_count` int(11) NULL DEFAULT 0 COMMENT '浏览数',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`lost_found_id`) USING BTREE,
  INDEX `idx_lf_user`(`user_id`) USING BTREE,
  INDEX `idx_lf_type`(`type`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '失物招领表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_lost_found
-- ----------------------------
INSERT INTO `t_lost_found` VALUES (1, 1, 1, '学生证遗失', '学生证', '红色封皮，计算机学院，姓名：张三，学号：20220200649', '一教302教室', '2026-04-18 10:30:00', '/uploads/lostfound/lostfound_1.jpg', '微信：lbb2026', 1, 92, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_lost_found` VALUES (2, 2, 1, '黑色双肩包遗失', '双肩包', '黑色adidas双肩包，内有笔记本电脑和校园卡', '北区食堂', '2026-04-18 12:00:00', '/uploads/lostfound/lostfound_2.jpg', '微信：xueba2026', 1, 64, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_lost_found` VALUES (3, 3, 2, '蓝色雨伞', '雨伞', '天堂伞蓝色，在一教门口捡到', '一教门口', '2026-04-18 08:30:00', '/uploads/lostfound/lostfound_3.jpg', '微信：sport2026', 0, 128, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_lost_found` VALUES (4, 1, 2, '钥匙串 图书馆三楼', '钥匙串', '带蓝色小挂件的钥匙串，3把钥匙', '图书馆三楼', '2026-04-17 16:00:00', '/uploads/lostfound/lostfound_4.jpg', '微信：lbb2026', 1, 96, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_lost_found` VALUES (5, 2, 2, 'iPhone 14 黑色', '手机', '晚跑时在操场跑道旁捡到，已送至保卫处', '操场跑道', '2026-04-17 20:00:00', '/uploads/lostfound/lostfound_5.jpg', '电话：13800001111', 0, 256, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_lost_found` VALUES (6, 5, 1, '寻物：白色充电宝', '充电宝', '白色小米充电宝，侧面有贴纸', '二教阶梯教室', '2026-04-19 19:30:00', '/uploads/lostfound/lostfound_6.jpg', '微信：vol2026', 1, 20, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0);
INSERT INTO `t_lost_found` VALUES (7, 6, 2, '招领：校园卡（计算机学院）', '校园卡', '在食堂一楼收银台附近捡到', '北区食堂', '2026-04-20 12:10:00', '/uploads/lostfound/lostfound_7.jpg', '微信：trade666', 1, 44, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0);

-- ----------------------------
-- Table structure for t_lost_found_claim_record
-- ----------------------------
DROP TABLE IF EXISTS `t_lost_found_claim_record`;
CREATE TABLE `t_lost_found_claim_record`  (
  `claim_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '认领记录ID',
  `lost_found_id` bigint(20) NOT NULL COMMENT '失物招领记录ID',
  `publisher_id` bigint(20) NOT NULL COMMENT '发布者ID',
  `claimant_id` bigint(20) NOT NULL COMMENT '认领者ID',
  `type` tinyint(4) NOT NULL COMMENT '类型：1-寻物 2-招领',
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '状态：0-待处理 1-已匹配 2-已驳回',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `claim_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '认领时间',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`claim_id`) USING BTREE,
  INDEX `idx_claim_lf`(`lost_found_id`) USING BTREE,
  INDEX `idx_claim_pub`(`publisher_id`) USING BTREE,
  INDEX `idx_claimant`(`claimant_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '失物招领认领记录表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_lost_found_claim_record
-- ----------------------------
INSERT INTO `t_lost_found_claim_record` VALUES (1, 3, 3, 1, 2, 0, '疑似本人雨伞，等待核验', '2026-04-21 16:29:28', '2026-04-21 16:29:28', '2026-04-21 16:29:28', 0);
INSERT INTO `t_lost_found_claim_record` VALUES (2, 5, 2, 3, 2, 0, '已当面核验并归还', '2026-04-21 16:29:28', '2026-04-21 16:29:28', '2026-04-21 16:29:28', 0);

-- ----------------------------
-- Table structure for t_notice
-- ----------------------------
DROP TABLE IF EXISTS `t_notice`;
CREATE TABLE `t_notice`  (
  `notice_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容',
  `admin_id` bigint(20) NULL DEFAULT NULL COMMENT '发布管理员ID',
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'SYSTEM' COMMENT '类型：SYSTEM-系统 ALL-全校 COLLEGE-学院',
  `images` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片JSON数组',
  `is_top` tinyint(4) NULL DEFAULT 0 COMMENT '是否置顶：0-否 1-是',
  `view_count` int(11) NULL DEFAULT 0 COMMENT '浏览数',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-下架 1-上架',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`notice_id`) USING BTREE,
  INDEX `idx_notice_admin`(`admin_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '通知公告表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_notice
-- ----------------------------
INSERT INTO `t_notice` VALUES (1, '欢迎使用校园生活服务平台！', '这里是你的一站式校园生活服务中心，你可以发布帖子交流互动、进行二手物品交易、发布失物招领信息、参与校园社团活动，后续还将上线更多校园便民服务。请文明使用平台，遵守平台规则，共同维护良好的校园社区环境，让校园生活更便捷、更高效！', 1, 'SYSTEM', '[\"/uploads/notice/notice_1.jpg\"]', 1, 268, 1, '2026-04-19 14:36:14', '2026-04-21 19:12:35', 0);
INSERT INTO `t_notice` VALUES (2, '2026年春季学期选课通知', '请登录教务系统，仔细核对本人培养方案要求，优先完成必修课程选课，再根据个人学业规划选择专业选修课、公共选修课，确保课程修读符合毕业学分要求。\n部分热门课程、限选课程有人数上限，系统将按照 “先到先得” 或 “随机抽签” 方式进行筛选，请提前做好备选方案。\n选课时请务必核对课程名称、课程代码、授课教师、上课时间、上课地点等信息，避免选错课程或出现时间冲突。\n选课期间，如遇系统卡顿、无法登录等问题，请避开高峰期操作，或及时联系学院教务办公室 / 教务处技术支持处理，请勿重复提交无效操作。', 1, 'ALL', '[\"/uploads/notice/notice_2.jpg\"]', 1, 135, 1, '2026-04-19 14:36:14', '2026-04-21 19:12:35', 0);
INSERT INTO `t_notice` VALUES (3, '图书馆延长开放时间通知', '各位师生：为充分满足广大同学期末复习、备考学习的需求，营造良好的学习氛围，保障考试周期间学习资源供给，经研究决定，考试周期间调整图书馆开放时间，具体安排通知如下：\n常规日间开放时间保持不变；\n晚间开放时间统一延长至22:30。\n请各位读者自觉遵守图书馆管理制度，保持馆内安静，爱护公共设施与书籍资料，合理安排学习时间。闭馆前工作人员将进行提醒，请及时整理个人物品有序离馆。\n后续将根据考试安排适时恢复正常开放时间，如有调整，将另行通知。\n特此通知。', 1, 'COLLEGE', '[\"/uploads/notice/notice_3.jpg\"]', 0, 71, 1, '2026-04-19 14:36:14', '2026-04-21 19:12:35', 0);
INSERT INTO `t_notice` VALUES (4, '校园网升级维护通知', '今晚 23:30-01:00 校园网升级维护，期间可能短暂断网。', 1, 'ALL', '[\"/uploads/notice/notice_4.jpg\"]', 0, 42, 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0);
INSERT INTO `t_notice` VALUES (5, '五一假期出行安全提示', '请同学们注意人身与财产安全，谨防诈骗，夜间结伴出行。', 1, 'SYSTEM', '[\"/uploads/notice/notice_5.jpg\"]', 0, 31, 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0);

-- ----------------------------
-- Table structure for t_post
-- ----------------------------
DROP TABLE IF EXISTS `t_post`;
CREATE TABLE `t_post`  (
  `post_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '帖子ID',
  `user_id` bigint(20) NOT NULL COMMENT '发布者ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '标题（可为空）',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '内容',
  `images` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片JSON数组',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '校园' COMMENT '分类',
  `like_count` int(11) NULL DEFAULT 0 COMMENT '点赞数',
  `comment_count` int(11) NULL DEFAULT 0 COMMENT '评论数',
  `view_count` int(11) NULL DEFAULT 0 COMMENT '浏览数',
  `is_top` tinyint(4) NULL DEFAULT 0 COMMENT '是否置顶',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-删除 1-正常',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`post_id`) USING BTREE,
  INDEX `idx_post_user`(`user_id`) USING BTREE,
  INDEX `idx_post_create_time`(`create_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '帖子表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_post
-- ----------------------------
INSERT INTO `t_post` VALUES (1, 1, '夕阳下的图书馆太美了', '今天天气超级好，傍晚在校园里随手拍了几张！夕阳下的图书馆真的太美了，有没有人一起去拍照呀~', '[\"/uploads/post/post_1.jpg\",\"/uploads/post/post_2.jpg\"]', '校园生活', 36, 0, 128, 1, 1, '2026-04-19 14:36:14', '2026-04-21 19:12:35', 0);
INSERT INTO `t_post` VALUES (2, 2, '期末复习资料分享', '分享一份期末复习资料，涵盖高数、线代、概率论全套笔记，整理了两个月，亲测有效！', '[\"/uploads/post/post_3.jpg\"]', '学习交流', 58, 0, 210, 0, 1, '2026-04-19 14:36:14', '2026-04-21 19:12:35', 0);
INSERT INTO `t_post` VALUES (3, 1, '食堂三楼麻辣烫推荐', '强烈推荐食堂三楼新开的麻辣烫！味道一绝，价格也很实惠，人均20元吃到撑，周末约起来~', '[\"/uploads/post/post_3.jpg\",\"/uploads/post/post_4.png\"]', '校园生活', 22, 0, 96, 0, 1, '2026-04-19 14:36:14', '2026-04-21 20:38:20', 0);
INSERT INTO `t_post` VALUES (4, 3, '校园十大歌手大赛复赛预告', '校园十大歌手大赛初赛圆满结束！恭喜晋级的30位选手，复赛将于4月20日在大学生活动中心举行，敬请期待！', '[\"/uploads/post/post_1.png\"]', '活动招募', 18, 0, 140, 0, 1, '2026-04-19 14:36:14', '2026-04-21 11:04:37', 0);
INSERT INTO `t_post` VALUES (5, 4, '吉他社招新｜零基础也欢迎', '每周两次练习+月度小演出，欢迎来体验！', '[\"/uploads/post/post_4.jpeg\"]', '活动招募', 12, 0, 86, 0, 1, '2026-04-21 19:12:35', '2026-04-21 21:06:20', 0);
INSERT INTO `t_post` VALUES (6, 6, '二手交易避坑指南（新生必看）', '交易建议走线下当面验货，贵重物品最好录开箱视频。', '[\"/uploads/post/post_5.jpg\",\"/uploads/post/post_6.jpg\"]', '校园生活', 15, 0, 102, 0, 1, '2026-04-21 19:12:35', '2026-04-21 21:06:17', 0);
INSERT INTO `t_post` VALUES (7, 7, '操场夜跑搭子来一个', '每天晚上 8 点操场，配速 6~7，想找一起坚持的同学。', NULL, '日常分享', 9, 0, 54, 0, 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0);
INSERT INTO `t_post` VALUES (8, 2, '学校的花开了', '今天路过偶然发现，并拍了下来', '[\"/uploads/post/post_2_1776775364025_119aab98.png\"]', '校园生活', 0, 0, 0, 0, 1, '2026-04-21 20:42:44', NULL, 0);

-- 回写帖子评论数（以 t_comment 实际条数为准）
UPDATE `t_post` p
SET p.`comment_count` = (
  SELECT COUNT(1) FROM `t_comment` c
  WHERE c.`post_id` = p.`post_id` AND c.`deleted` = 0
)
WHERE p.`deleted` = 0;

-- ----------------------------
-- Table structure for t_post_like
-- ----------------------------
DROP TABLE IF EXISTS `t_post_like`;
CREATE TABLE `t_post_like`  (
  `like_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `post_id` bigint(20) NOT NULL COMMENT '帖子ID',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`like_id`) USING BTREE,
  UNIQUE INDEX `uk_post_like`(`user_id`, `post_id`) USING BTREE,
  INDEX `idx_like_post`(`post_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '帖子点赞表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_post_like
-- ----------------------------
INSERT INTO `t_post_like` VALUES (5, 2, 1, '2026-04-21 10:15:45', 1);

-- ----------------------------
-- Table structure for t_second_hand
-- ----------------------------
DROP TABLE IF EXISTS `t_second_hand`;
CREATE TABLE `t_second_hand`  (
  `item_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `user_id` bigint(20) NOT NULL COMMENT '卖家ID',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '商品标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '商品描述',
  `images` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片JSON数组',
  `category_id` bigint(20) NULL DEFAULT NULL COMMENT '分类ID',
  `original_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '原价',
  `price` decimal(10, 2) NOT NULL COMMENT '售价',
  `condition_level` tinyint(4) NULL DEFAULT 3 COMMENT '成色：1-全新 2-九成新 3-八成新 4-七成新 5-旧物',
  `trade_location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '交易地点',
  `contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `view_count` int(11) NULL DEFAULT 0 COMMENT '浏览数',
  `favorite_count` int(11) NULL DEFAULT 0 COMMENT '收藏数',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-下架 1-出售中 2-已售出',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`item_id`) USING BTREE,
  INDEX `idx_goods_user`(`user_id`) USING BTREE,
  INDEX `idx_goods_category`(`category_id`) USING BTREE,
  INDEX `idx_goods_create`(`create_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '二手商品表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_second_hand
-- ----------------------------
INSERT INTO `t_second_hand` VALUES (1, 1, 'iPad Air 5 64G 深空灰 99新', '用了半年，配件齐全，无划痕，性能完美。', '[\"/uploads/goods/goods_1.jpg\",\"/uploads/goods/goods_2.jpg\"]', 1, 4399.00, 3200.00, 2, '西区宿舍楼下', '微信：lbb2026', 134, 18, 1, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_second_hand` VALUES (2, 2, '高等数学同济第七版上下册 送配套习题', '几乎全新，高分上岸学霸笔记，手写重点标注。', '[\"/uploads/goods/goods_3.jpg\"]', 2, 89.00, 25.00, 2, '图书馆门口', '微信：xueba2026', 257, 32, 1, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_second_hand` VALUES (3, 1, '小米电动滑板车 校园代步', '续航30km，车况良好，带原装充电器和车锁。', '[\"/uploads/goods/goods_4.jpg\",\"/uploads/goods/goods_5.jpg\"]', 3, 1999.00, 680.00, 3, '3号宿舍楼', '微信：lbb2026', 88, 12, 1, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_second_hand` VALUES (4, 3, 'AirPods Pro 正品国行', '正品国行，在保，带购买凭证。', '[\"/uploads/goods/goods_6.jpg\"]', 1, 1999.00, 899.00, 2, '食堂二楼', '微信：sport2026', 156, 24, 1, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_second_hand` VALUES (5, 2, '拍立得 mini9 粉色 送相纸2盒', '机身95新，相纸还有2盒，适合送礼物！', '[\"/uploads/goods/goods_7.jpg\"]', 3, 599.00, 320.00, 3, '东区宿舍', '微信：xueba2026', 70, 8, 2, '2026-04-19 14:36:15', '2026-04-21 19:12:35', 0);
INSERT INTO `t_second_hand` VALUES (6, 2, '英语考研复习资料', '几乎全新转让', '[\"/uploads/goods/goods_2_1776738013253_011a3c71.jpg\"]', 2, 123.00, 11.00, 3, '四食堂南门', '', 4, 0, 1, '2026-04-21 10:20:13', NULL, 0);
INSERT INTO `t_second_hand` VALUES (7, 4, '民谣吉他 41寸 入门款', '琴弦刚换，适合新手练习', '[\"/uploads/goods/goods_10.jpg\"]', 3, 499.00, 260.00, 3, '艺术楼门口', '微信：guitar666', 35, 2, 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0);
INSERT INTO `t_second_hand` VALUES (8, 2, '线代习题册+笔记（含答案）', '备考自用，标注清晰', '[\"/uploads/goods/goods_11.jpg\",\"/uploads/goods/goods_12.jpg\"]', 2, 69.00, 18.00, 2, '图书馆', '微信：xueba2026', 120, 9, 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0);

-- ----------------------------
-- Table structure for t_trade_record
-- ----------------------------
DROP TABLE IF EXISTS `t_trade_record`;
CREATE TABLE `t_trade_record`  (
  `record_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `item_id` bigint(20) NOT NULL,
  `seller_id` bigint(20) NOT NULL,
  `buyer_id` bigint(20) NOT NULL,
  `item_title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `price` decimal(10, 2) NOT NULL,
  `status` tinyint(4) NULL DEFAULT 0 COMMENT '0-待确认 1-已完成 2-已取消',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NULL DEFAULT 0,
  PRIMARY KEY (`record_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_trade_record
-- ----------------------------
INSERT INTO `t_trade_record` VALUES (1, 5, 2, 1, '拍立得 mini9 粉色 送相纸2盒', 320.00, 1, '', '2026-04-20 18:16:54', '2026-04-20 18:18:02', 0);
INSERT INTO `t_trade_record` VALUES (2, 1, 1, 2, 'iPad Air 5 64G 深空灰 99新', 3200.00, 2, '', '2026-04-21 10:17:33', '2026-04-21 10:17:42', 0);

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user`  (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `openid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信openid',
  `wx_openid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信小程序openid（code2Session）',
  `wx_unionid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信unionid（若已绑定开放平台）',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户名/昵称',
  `student_no` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '学号',
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像URL',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `college` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '学院',
  `major` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '专业',
  `class_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '班级',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：1-正常 0-禁用',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(4) NULL DEFAULT 0 COMMENT '逻辑删除',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '密码（BCrypt加密）',
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `uk_user_openid`(`openid`) USING BTREE,
  UNIQUE INDEX `uk_user_wx_openid`(`wx_openid`) USING BTREE,
  UNIQUE INDEX `uk_user_student_no`(`student_no`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES (1, 'student_20220200649', NULL, NULL, '校园小达人', '20220200649', '/uploads/user/user_1.jpg', '13800001111', 'lbb@example.com', '计算机与大数据科学学院', '计算机科学与技术', 'A2212', 1, '2026-04-19 14:36:14', '2026-04-21 20:36:21', 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (2, 'student_20220200650', NULL, NULL, '学霸君', '20220200650', '/uploads/user/user_2_1776775279111_f090ac9a.png', '13800002222', 'xueba@example.com', '计算机与大数据科学学院', '软件工程', 'A2212', 1, '2026-04-19 14:36:14', NULL, 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (3, 'student_20220200651', NULL, NULL, '运动达人', '20220200651', '/uploads/user/user_3.jpg', '13800003333', 'sport@example.com', '体育学院', '体育教育', 'B2211', 1, '2026-04-19 14:36:14', '2026-04-21 19:12:35', 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (4, 'student_20220200652', NULL, NULL, '吉他少年', '20220200652', '/uploads/user/user_4.jpg', '13800004444', 'guitar@example.com', '文学院', '汉语言文学', 'C2210', 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (5, 'student_20220200653', NULL, NULL, '志愿小队长', '20220200653', '/uploads/user/user_5.jpg', '13800005555', 'vol@example.com', '马克思主义学院', '思想政治教育', 'D2209', 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (6, 'student_20220200654', NULL, NULL, '二手达人', '20220200654', '/uploads/user/user_6.jpg', '13800006666', 'trade@example.com', '经济管理学院', '市场营销', 'E2208', 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (7, 'student_20220200655', NULL, NULL, '跑步打卡王', '20220200655', '/uploads/user/user_7.jpg', '13800007777', 'run@example.com', '体育学院', '体育教育', 'B2211', 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (8, 'student_20220200656', NULL, NULL, '社团活动控', '20220200656', '/uploads/user/user_8.jpg', '13800008888', 'club@example.com', '人工智能学院', '人工智能', 'AI2210', 1, '2026-04-21 19:12:35', '2026-04-21 19:12:35', 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');

-- ----------------------------
-- Extra Records: 批量追加用户（默认头像 default.png，密码 123456）
-- ----------------------------
-- 默认头像文件：D:\ABISHE\demo1\uploads\user\default.png
-- 入库路径约定：/uploads/user/default.png
INSERT INTO `t_user` VALUES (9, 'student_20220200657', NULL, NULL, '林星辰', '20220200657', '/uploads/user/default.png', '13800010009', 'u09@example.com', '计算机与大数据科学学院', '计算机科学与技术', 'A2212', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (10, 'student_20220200658', NULL, NULL, '苏沐阳', '20220200658', '/uploads/user/default.png', '13800010010', 'u10@example.com', '软件学院', '软件工程', 'SE2301', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (11, 'student_20220200659', NULL, NULL, '陈念安', '20220200659', '/uploads/user/default.png', '13800010011', 'u11@example.com', '人工智能学院', '人工智能', 'AI2310', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (12, 'student_20220200660', NULL, NULL, '周予宁', '20220200660', '/uploads/user/default.png', '13800010012', 'u12@example.com', '经济管理学院', '市场营销', 'EM2208', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (13, 'student_20220200661', NULL, NULL, '许清歌', '20220200661', '/uploads/user/default.png', '13800010013', 'u13@example.com', '文学院', '汉语言文学', 'CL2210', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (14, 'student_20220200662', NULL, NULL, '赵景行', '20220200662', '/uploads/user/default.png', '13800010014', 'u14@example.com', '体育学院', '体育教育', 'PE2211', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (15, 'student_20220200663', NULL, NULL, '韩以深', '20220200663', '/uploads/user/default.png', '13800010015', 'u15@example.com', '信息与通信工程学院', '通信工程', 'ICT2302', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (16, 'student_20220200664', NULL, NULL, '吴知夏', '20220200664', '/uploads/user/default.png', '13800010016', 'u16@example.com', '理学院', '数学与应用数学', 'SC2303', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (17, 'student_20220200665', NULL, NULL, '李若棠', '20220200665', '/uploads/user/default.png', '13800010017', 'u17@example.com', '外国语学院', '英语', 'FL2301', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (18, 'student_20220200666', NULL, NULL, '冯子衿', '20220200666', '/uploads/user/default.png', '13800010018', 'u18@example.com', '法学院', '法学', 'LA2302', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (19, 'student_20220200667', NULL, NULL, '邓星野', '20220200667', '/uploads/user/default.png', '13800010019', 'u19@example.com', '自动化学院', '自动化', 'AU2301', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (20, 'student_20220200668', NULL, NULL, '曹雨衡', '20220200668', '/uploads/user/default.png', '13800010020', 'u20@example.com', '电子工程学院', '电子信息工程', 'EE2302', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (21, 'student_20220200669', NULL, NULL, '蒋闻舟', '20220200669', '/uploads/user/default.png', '13800010021', 'u21@example.com', '机械工程学院', '机械设计制造及其自动化', 'ME2301', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (22, 'student_20220200670', NULL, NULL, '沈亦可', '20220200670', '/uploads/user/default.png', '13800010022', 'u22@example.com', '土木与交通工程学院', '土木工程', 'CE2302', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (23, 'student_20220200671', NULL, NULL, '唐知远', '20220200671', '/uploads/user/default.png', '13800010023', 'u23@example.com', '计算机与大数据科学学院', '数据科学与大数据技术', 'CS2303', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (24, 'student_20220200672', NULL, NULL, '梁初雪', '20220200672', '/uploads/user/default.png', '13800010024', 'u24@example.com', '软件学院', '软件工程', 'SE2302', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (25, 'student_20220200673', NULL, NULL, '何望舒', '20220200673', '/uploads/user/default.png', '13800010025', 'u25@example.com', '人工智能学院', '智能科学与技术', 'AI2308', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (26, 'student_20220200674', NULL, NULL, '叶南栀', '20220200674', '/uploads/user/default.png', '13800010026', 'u26@example.com', '外国语学院', '日语', 'FL2303', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (27, 'student_20220200675', NULL, NULL, '顾临川', '20220200675', '/uploads/user/default.png', '13800010027', 'u27@example.com', '理学院', '物理学', 'SC2304', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (28, 'student_20220200676', NULL, NULL, '段星澜', '20220200676', '/uploads/user/default.png', '13800010028', 'u28@example.com', '经济管理学院', '会计学', 'EM2301', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (29, 'student_20220200677', NULL, NULL, '宋雨潇', '20220200677', '/uploads/user/default.png', '13800010029', 'u29@example.com', '文学院', '新闻学', 'CL2302', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (30, 'student_20220200678', NULL, NULL, '江澈然', '20220200678', '/uploads/user/default.png', '13800010030', 'u30@example.com', '法学院', '法学', 'LA2303', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (31, 'student_20220200679', NULL, NULL, '白予安', '20220200679', '/uploads/user/default.png', '13800010031', 'u31@example.com', '土木与交通工程学院', '交通工程', 'CE2303', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');
INSERT INTO `t_user` VALUES (32, 'student_20220200680', NULL, NULL, '秦望月', '20220200680', '/uploads/user/default.png', '13800010032', 'u32@example.com', '计算机与大数据科学学院', '网络工程', 'CS2304', 1, NOW(), NOW(), 0, '$2b$10$seA9RDUaWsaeuQrTvFZageiTsBcEIq.96iH0Uq.ZbDwq1dzYvgKE2');

-- ----------------------------
-- Rebuild Records: 清空并重建社团成员（按当前 t_club + 随机入团）
-- ----------------------------
DELETE FROM `t_club_member`;

-- A) 每个社团先补齐团长成员（role=2，status=1）
INSERT INTO `t_club_member` (`club_id`,`user_id`,`role`,`status`,`join_time`,`deleted`)
SELECT c.`club_id`, c.`leader_id`, 2, 1, NOW(), 0
FROM `t_club` c
WHERE c.`deleted` = 0 AND c.`status` = 1 AND c.`leader_id` IS NOT NULL;

-- B) 所有用户随机入团：每人至少加入 1 个社团（不含已是团长的那条记录也没关系，重复会被过滤）
DROP TEMPORARY TABLE IF EXISTS tmp_all_users;
CREATE TEMPORARY TABLE tmp_all_users (`user_id` BIGINT PRIMARY KEY);
INSERT INTO tmp_all_users (`user_id`) SELECT u.`user_id` FROM `t_user` u WHERE u.`deleted` = 0 AND u.`status` = 1;

-- 第 1 轮：每人加入 1 个随机社团
INSERT INTO `t_club_member` (`club_id`,`user_id`,`role`,`status`,`join_time`,`deleted`)
SELECT x.`club_id`, x.`user_id`, 0, 1, NOW(), 0
FROM (
  SELECT u.`user_id`,
         (SELECT c.`club_id` FROM `t_club` c WHERE c.`deleted`=0 AND c.`status`=1 ORDER BY RAND() LIMIT 1) AS `club_id`
  FROM tmp_all_users u
) x
WHERE x.`club_id` IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM `t_club_member` m
    WHERE m.`club_id` = x.`club_id` AND m.`user_id` = x.`user_id` AND m.`deleted` = 0
  );

-- 第 2 轮：再随机加入 1 个社团（增加分布）
INSERT INTO `t_club_member` (`club_id`,`user_id`,`role`,`status`,`join_time`,`deleted`)
SELECT x.`club_id`, x.`user_id`, 0, 1, NOW(), 0
FROM (
  SELECT u.`user_id`,
         (SELECT c.`club_id` FROM `t_club` c WHERE c.`deleted`=0 AND c.`status`=1 ORDER BY RAND() LIMIT 1) AS `club_id`
  FROM tmp_all_users u
) x
WHERE x.`club_id` IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM `t_club_member` m
    WHERE m.`club_id` = x.`club_id` AND m.`user_id` = x.`user_id` AND m.`deleted` = 0
  );

-- C) 回写社团成员数（以 t_club_member 实际为准）
UPDATE `t_club` c
SET c.`member_count` = (
  SELECT COUNT(1) FROM `t_club_member` m
  WHERE m.`club_id` = c.`club_id` AND m.`deleted` = 0 AND m.`status` = 1
)
WHERE c.`deleted` = 0;

SET FOREIGN_KEY_CHECKS = 1;
