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

 Date: 18/04/2026 20:22:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '管理员编号',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '电话',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '管理员表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'admin', '123456', '系统管理员', '13800138000', '2026-04-18 19:14:27', '2026-04-18 19:14:27');

-- ----------------------------
-- Table structure for announcement
-- ----------------------------
DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '公告编号',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容',
  `admin_id` bigint(20) NULL DEFAULT NULL COMMENT '发布者编号（管理员）',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `images` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片路径，多个用逗号分隔',
  `sort_order` int(11) NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-下架 1-上架',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `admin_id`(`admin_id`) USING BTREE,
  CONSTRAINT `announcement_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '公告表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of announcement
-- ----------------------------
INSERT INTO `announcement` VALUES (1, '欢迎使用校园生活服务平台！', '这里可以发布帖子、买卖二手物品、寻找失物、参加社团活动...', 1, '2026-04-18 19:14:27', NULL, 1, 1);
INSERT INTO `announcement` VALUES (2, '二手交易市场全新上线', '快来发布你的闲置物品吧，让旧物找到新主人！', 1, '2026-04-18 19:14:27', NULL, 2, 1);

-- ----------------------------
-- Table structure for club
-- ----------------------------
DROP TABLE IF EXISTS `club`;
CREATE TABLE `club`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '社团编号',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '社团名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '简介',
  `member_count` int(11) NULL DEFAULT 0 COMMENT '人数',
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '社团图片',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '活动地点',
  `leader_id` bigint(20) NULL DEFAULT NULL COMMENT '团长编号',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-解散 1-正常',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `leader_id`(`leader_id`) USING BTREE,
  CONSTRAINT `club_ibfk_1` FOREIGN KEY (`leader_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '社团表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of club
-- ----------------------------
INSERT INTO `club` VALUES (1, '篮球社', '热爱篮球的同学聚集地，每周三周五训练', 50, NULL, '体育馆篮球场', 1, '2026-04-18 19:14:27', 1);
INSERT INTO `club` VALUES (2, '摄影协会', '用镜头记录校园美好，定期组织外拍活动', 35, NULL, '艺术楼201', 2, '2026-04-18 19:14:27', 1);
INSERT INTO `club` VALUES (3, '编程爱好者协会', '编程学习交流，技术分享，项目实战', 80, NULL, '计算机楼实验室', 3, '2026-04-18 19:14:27', 1);

-- ----------------------------
-- Table structure for club_activity
-- ----------------------------
DROP TABLE IF EXISTS `club_activity`;
CREATE TABLE `club_activity`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '活动编号',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '活动名称',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '活动内容',
  `member_limit` int(11) NULL DEFAULT 0 COMMENT '人数限制，0表示无限制',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '活动地点',
  `image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '活动图片',
  `start_time` datetime NULL DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime NULL DEFAULT NULL COMMENT '结束时间',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-取消 1-报名中 2-进行中 3-已结束',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '社团活动表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of club_activity
-- ----------------------------
INSERT INTO `club_activity` VALUES (1, '周末篮球友谊赛', '与其他学院篮球队进行友谊赛，欢迎观战', 20, '体育馆主馆', NULL, '2024-01-20 14:00:00', '2024-01-20 17:00:00', '2026-04-18 19:14:27', 1);
INSERT INTO `club_activity` VALUES (2, '樱花季摄影活动', '组织校园樱花拍摄，后期分享会', 30, '樱花大道', NULL, '2024-01-25 09:00:00', '2024-01-25 12:00:00', '2026-04-18 19:14:27', 1);

-- ----------------------------
-- Table structure for club_activity_relation
-- ----------------------------
DROP TABLE IF EXISTS `club_activity_relation`;
CREATE TABLE `club_activity_relation`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '关系编号',
  `club_id` bigint(20) NOT NULL COMMENT '社团编号',
  `activity_id` bigint(20) NOT NULL COMMENT '社团活动编号',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_club_activity`(`club_id`, `activity_id`) USING BTREE,
  INDEX `activity_id`(`activity_id`) USING BTREE,
  CONSTRAINT `club_activity_relation_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `club_activity_relation_ibfk_2` FOREIGN KEY (`activity_id`) REFERENCES `club_activity` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '社团活动关系表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of club_activity_relation
-- ----------------------------
INSERT INTO `club_activity_relation` VALUES (1, 1, 1, '2026-04-18 19:14:27');
INSERT INTO `club_activity_relation` VALUES (2, 2, 2, '2026-04-18 19:14:27');

-- ----------------------------
-- Table structure for club_member
-- ----------------------------
DROP TABLE IF EXISTS `club_member`;
CREATE TABLE `club_member`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '关系编号',
  `club_id` bigint(20) NOT NULL COMMENT '社团编号',
  `user_id` bigint(20) NOT NULL COMMENT '团员编号',
  `role` tinyint(4) NULL DEFAULT 0 COMMENT '角色：0-普通成员 1-管理员 2-团长',
  `join_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_club_user`(`club_id`, `user_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `idx_club_member_club_id`(`club_id`) USING BTREE,
  CONSTRAINT `club_member_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `club` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `club_member_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '社团成员关系表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of club_member
-- ----------------------------
INSERT INTO `club_member` VALUES (1, 1, 1, 2, '2026-04-18 19:14:27');
INSERT INTO `club_member` VALUES (2, 1, 2, 0, '2026-04-18 19:14:27');
INSERT INTO `club_member` VALUES (3, 2, 2, 2, '2026-04-18 19:14:27');
INSERT INTO `club_member` VALUES (4, 3, 3, 2, '2026-04-18 19:14:27');

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '评论编号',
  `post_id` bigint(20) NOT NULL COMMENT '帖子编号',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '评论内容',
  `user_id` bigint(20) NOT NULL COMMENT '用户编号',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  `parent_id` bigint(20) NULL DEFAULT NULL COMMENT '父评论编号（回复功能）',
  `like_count` int(11) NULL DEFAULT 0 COMMENT '点赞数',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `parent_id`(`parent_id`) USING BTREE,
  INDEX `idx_comment_post_id`(`post_id`) USING BTREE,
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `comment_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comment` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '评论表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment
-- ----------------------------

-- ----------------------------
-- Table structure for found_item
-- ----------------------------
DROP TABLE IF EXISTS `found_item`;
CREATE TABLE `found_item`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '物品名',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '拾到地点',
  `found_time` datetime NULL DEFAULT NULL COMMENT '拾到时间',
  `images` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片路径',
  `finder_id` bigint(20) NULL DEFAULT NULL COMMENT '发现者编号',
  `contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `claimer_id` bigint(20) NULL DEFAULT NULL COMMENT '认领者编号',
  `claim_time` datetime NULL DEFAULT NULL COMMENT '认领时间',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '物品描述',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-已过期 1-待认领 2-已认领',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `claimer_id`(`claimer_id`) USING BTREE,
  INDEX `idx_found_finder_id`(`finder_id`) USING BTREE,
  CONSTRAINT `found_item_ibfk_1` FOREIGN KEY (`finder_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `found_item_ibfk_2` FOREIGN KEY (`claimer_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '招领登记表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of found_item
-- ----------------------------
INSERT INTO `found_item` VALUES (1, '蓝色雨伞', '一教门口', '2024-01-16 08:30:00', NULL, 3, '电话：13800138002', NULL, NULL, '在一教门口捡到，品牌：天堂伞', '2026-04-18 19:14:27', 1);
INSERT INTO `found_item` VALUES (2, '校园卡', '图书馆一楼', '2024-01-17 16:00:00', NULL, 1, '微信：lisi001', NULL, NULL, '图书馆捡到，姓名：李四，学号：2022001', '2026-04-18 19:14:27', 1);

-- ----------------------------
-- Table structure for lost_item
-- ----------------------------
DROP TABLE IF EXISTS `lost_item`;
CREATE TABLE `lost_item`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '编号',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '物品名',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '概况',
  `location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '丢失地点',
  `lost_time` datetime NULL DEFAULT NULL COMMENT '丢失时间',
  `images` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片路径',
  `owner_id` bigint(20) NULL DEFAULT NULL COMMENT '失主编号',
  `contact` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '联系方式',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-已关闭 1-寻找中 2-已找回',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_lost_owner_id`(`owner_id`) USING BTREE,
  CONSTRAINT `lost_item_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '失物表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of lost_item
-- ----------------------------
INSERT INTO `lost_item` VALUES (1, '学生证', '红色封皮，计算机学院，姓名：张三', '一教302教室', '2024-01-15 14:30:00', NULL, 1, '微信：zhangsan123', '2026-04-18 19:14:27', 1);
INSERT INTO `lost_item` VALUES (2, '黑色钱包', '里面有身份证、银行卡、现金约200元', '食堂一楼', '2024-01-16 12:00:00', NULL, 2, '电话：13800138001', '2026-04-18 19:14:27', 1);

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '帖子编号',
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容',
  `user_id` bigint(20) NOT NULL COMMENT '用户编号',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `images` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片路径，多个用逗号分隔',
  `like_count` int(11) NULL DEFAULT 0 COMMENT '点赞数',
  `view_count` int(11) NULL DEFAULT 0 COMMENT '浏览数',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-删除 1-正常 2-草稿',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_post_user_id`(`user_id`) USING BTREE,
  INDEX `idx_post_create_time`(`create_time`) USING BTREE,
  CONSTRAINT `post_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '帖子表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of post
-- ----------------------------
INSERT INTO `post` VALUES (1, '图书馆今天人好多啊！', '期末考试周到了，图书馆座位都满了，大家加油！', 1, '2026-04-18 19:14:27', '/images/post/lib1.png', 15, 0, 1);
INSERT INTO `post` VALUES (2, '求推荐好吃的食堂窗口', '最近吃腻了，想换换口味，大家有什么推荐的吗？', 2, '2026-04-18 19:14:27', '', 8, 0, 1);
INSERT INTO `post` VALUES (3, '学校樱花开了，超美！', '今天路过樱花大道，花开了好多，拍照很好看~', 3, '2026-04-18 19:14:27', '/images/post/sakura1.png,/images/post/sakura2.png', 32, 0, 1);

-- ----------------------------
-- Table structure for secondhand_goods
-- ----------------------------
DROP TABLE IF EXISTS `secondhand_goods`;
CREATE TABLE `secondhand_goods`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '商品编号',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '物品名',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '概况',
  `images` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '图片路径，多个用逗号分隔',
  `trade_location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '交易地点',
  `price` decimal(10, 2) NOT NULL COMMENT '价格',
  `seller_id` bigint(20) NOT NULL COMMENT '卖家编号',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '分类',
  `condition_level` tinyint(4) NULL DEFAULT 3 COMMENT '成色：1-全新 2-九成新 3-八成新 4-七成新 5-旧物',
  `delivery_type` tinyint(4) NULL DEFAULT 1 COMMENT '交易方式：1-自提 2-邮寄 3-当面交易',
  `view_count` int(11) NULL DEFAULT 0 COMMENT '浏览数',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：0-下架 1-出售中 2-已售出',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_goods_seller_id`(`seller_id`) USING BTREE,
  INDEX `idx_goods_status`(`status`) USING BTREE,
  CONSTRAINT `secondhand_goods_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '二手商品表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of secondhand_goods
-- ----------------------------
INSERT INTO `secondhand_goods` VALUES (1, '考研英语全套资料', '几乎全新，包含真题、词汇、作文模板', '/images/goods/book1.png', '图书馆门口', 88.00, 1, '书籍', 2, 1, 0, '2026-04-18 19:14:27', 1);
INSERT INTO `secondhand_goods` VALUES (2, '台灯 护眼LED', '用了一年，功能正常，三档调光', '/images/goods/lamp1.png', '3号宿舍楼', 45.00, 2, '日用', 3, 1, 0, '2026-04-18 19:14:27', 1);
INSERT INTO `secondhand_goods` VALUES (3, '蓝牙耳机', 'AirPods Pro，正品，有购买记录', '/images/goods/earphone1.png', '食堂二楼', 899.00, 3, '电子', 2, 1, 0, '2026-04-18 19:14:27', 1);

-- ----------------------------
-- Table structure for t_activity
-- ----------------------------
DROP TABLE IF EXISTS `t_activity`;
CREATE TABLE `t_activity`  (
  `activity_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `current_participants` int(11) NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `end_time` datetime(6) NULL DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `max_participants` int(11) NULL DEFAULT NULL,
  `organizer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `start_time` datetime(6) NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) NULL DEFAULT NULL,
  `view_count` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`activity_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_activity
-- ----------------------------

-- ----------------------------
-- Table structure for t_activity_registration
-- ----------------------------
DROP TABLE IF EXISTS `t_activity_registration`;
CREATE TABLE `t_activity_registration`  (
  `registration_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `activity_id` bigint(20) NULL DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `user_id` bigint(20) NULL DEFAULT NULL,
  PRIMARY KEY (`registration_id`) USING BTREE,
  UNIQUE INDEX `UKbo5e7nl0uijoib6jk2vhlbhsm`(`user_id`, `activity_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_activity_registration
-- ----------------------------

-- ----------------------------
-- Table structure for t_admin
-- ----------------------------
DROP TABLE IF EXISTS `t_admin`;
CREATE TABLE `t_admin`  (
  `admin_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `last_login_time` datetime(6) NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`admin_id`) USING BTREE,
  UNIQUE INDEX `UK3f137q5sgpm7mtbeaxixnug35`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_admin
-- ----------------------------

-- ----------------------------
-- Table structure for t_category
-- ----------------------------
DROP TABLE IF EXISTS `t_category`;
CREATE TABLE `t_category`  (
  `category_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int(11) NULL DEFAULT NULL,
  `type` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`category_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_category
-- ----------------------------

-- ----------------------------
-- Table structure for t_comment
-- ----------------------------
DROP TABLE IF EXISTS `t_comment`;
CREATE TABLE `t_comment`  (
  `comment_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `item_id` bigint(20) NULL DEFAULT NULL,
  `parent_id` bigint(20) NULL DEFAULT NULL,
  `user_id` bigint(20) NULL DEFAULT NULL,
  PRIMARY KEY (`comment_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_comment
-- ----------------------------

-- ----------------------------
-- Table structure for t_favorite
-- ----------------------------
DROP TABLE IF EXISTS `t_favorite`;
CREATE TABLE `t_favorite`  (
  `favorite_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `item_id` bigint(20) NULL DEFAULT NULL,
  `user_id` bigint(20) NULL DEFAULT NULL,
  PRIMARY KEY (`favorite_id`) USING BTREE,
  UNIQUE INDEX `UK4gcfxk0gr5xlwk7u934srd02u`(`user_id`, `item_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_favorite
-- ----------------------------

-- ----------------------------
-- Table structure for t_lost_found
-- ----------------------------
DROP TABLE IF EXISTS `t_lost_found`;
CREATE TABLE `t_lost_found`  (
  `lost_found_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `item_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `item_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `lost_time` datetime(6) NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` int(11) NOT NULL,
  `user_id` bigint(20) NULL DEFAULT NULL,
  `view_count` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`lost_found_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_lost_found
-- ----------------------------

-- ----------------------------
-- Table structure for t_notice
-- ----------------------------
DROP TABLE IF EXISTS `t_notice`;
CREATE TABLE `t_notice`  (
  `notice_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `admin_id` bigint(20) NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_top` int(11) NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `view_count` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`notice_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_notice
-- ----------------------------

-- ----------------------------
-- Table structure for t_post
-- ----------------------------
DROP TABLE IF EXISTS `t_post`;
CREATE TABLE `t_post`  (
  `post_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `comment_count` int(11) NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `images` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `is_top` int(11) NULL DEFAULT NULL,
  `like_count` int(11) NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) NULL DEFAULT NULL,
  `view_count` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`post_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_post
-- ----------------------------

-- ----------------------------
-- Table structure for t_post_comment
-- ----------------------------
DROP TABLE IF EXISTS `t_post_comment`;
CREATE TABLE `t_post_comment`  (
  `comment_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` bigint(20) NULL DEFAULT NULL,
  `post_id` bigint(20) NULL DEFAULT NULL,
  `reply_to_user_id` bigint(20) NULL DEFAULT NULL,
  `user_id` bigint(20) NULL DEFAULT NULL,
  PRIMARY KEY (`comment_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_post_comment
-- ----------------------------

-- ----------------------------
-- Table structure for t_post_like
-- ----------------------------
DROP TABLE IF EXISTS `t_post_like`;
CREATE TABLE `t_post_like`  (
  `like_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `post_id` bigint(20) NULL DEFAULT NULL,
  `user_id` bigint(20) NULL DEFAULT NULL,
  PRIMARY KEY (`like_id`) USING BTREE,
  UNIQUE INDEX `UKjrvnejcuudesu1mwdd193s8t4`(`user_id`, `post_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_post_like
-- ----------------------------

-- ----------------------------
-- Table structure for t_second_hand
-- ----------------------------
DROP TABLE IF EXISTS `t_second_hand`;
CREATE TABLE `t_second_hand`  (
  `item_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `category_id` bigint(20) NULL DEFAULT NULL,
  `contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `favorite_count` int(11) NULL DEFAULT NULL,
  `images` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `original_price` decimal(38, 2) NULL DEFAULT NULL,
  `price` decimal(10, 2) NOT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint(20) NULL DEFAULT NULL,
  `view_count` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`item_id`) USING BTREE,
  INDEX `FK2psuv18y4xeygw9wwx5qspo1l`(`user_id`) USING BTREE,
  CONSTRAINT `FK2psuv18y4xeygw9wwx5qspo1l` FOREIGN KEY (`user_id`) REFERENCES `t_user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_second_hand
-- ----------------------------

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user`  (
  `user_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NULL DEFAULT NULL,
  `update_time` datetime(6) NULL DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `nick_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `student_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `UKrxwa6dxcmkc4sq2dkw06lb5do`(`openid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_user
-- ----------------------------

-- ----------------------------
-- Table structure for trade
-- ----------------------------
DROP TABLE IF EXISTS `trade`;
CREATE TABLE `trade`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '交易编号',
  `trade_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '交易时间',
  `seller_id` bigint(20) NOT NULL COMMENT '卖家编号',
  `buyer_id` bigint(20) NOT NULL COMMENT '买家编号',
  `price` decimal(10, 2) NOT NULL COMMENT '成交价格',
  `trade_location` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '交易地点',
  `goods_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '物品名',
  `goods_id` bigint(20) NULL DEFAULT NULL COMMENT '商品编号',
  `status` tinyint(4) NULL DEFAULT 1 COMMENT '状态：1-交易中 2-已完成 3-已取消',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `goods_id`(`goods_id`) USING BTREE,
  INDEX `idx_trade_seller_id`(`seller_id`) USING BTREE,
  INDEX `idx_trade_buyer_id`(`buyer_id`) USING BTREE,
  CONSTRAINT `trade_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `trade_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `trade_ibfk_3` FOREIGN KEY (`goods_id`) REFERENCES `secondhand_goods` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '交易信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of trade
-- ----------------------------

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '用户编号',
  `openid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信用户唯一标识',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '用户名/昵称',
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像图片路径',
  `create_time` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `openid`(`openid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'openid_001', '校园小达人', '/images/avatar/default1.png', '2026-04-18 19:14:27', '2026-04-18 19:20:40');
INSERT INTO `user` VALUES (2, 'openid_002', '学霸君', '/images/avatar/default2.png', '2026-04-18 19:14:27', '2026-04-18 19:20:42');
INSERT INTO `user` VALUES (3, 'openid_003', '运动达人', '/images/avatar/default3.png', '2026-04-18 19:14:27', '2026-04-18 19:20:57');

SET FOREIGN_KEY_CHECKS = 1;
