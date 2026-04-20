-- ============================================
-- 校园生活服务平台 - 图片路径更新 SQL
-- 根据 demo1/sql/campus_life.sql 实际表结构编写
-- 将数据库中的 picsum.photos 路径更新为本地服务器路径
-- ============================================

-- 1. 更新用户头像路径 (t_user 表) - 原数据为 picsum.photos
UPDATE `t_user` SET `avatar` = '/uploads/user/user_1.png' WHERE `user_id` = 1;
UPDATE `t_user` SET `avatar` = '/uploads/user/user_2.png' WHERE `user_id` = 2;
UPDATE `t_user` SET `avatar` = '/uploads/user/user_3.png' WHERE `user_id` = 3;
UPDATE `t_user` SET `avatar` = '/uploads/user/user_4.png' WHERE `user_id` = 4;
UPDATE `t_user` SET `avatar` = '/uploads/user/user_5.png' WHERE `user_id` = 5;

-- 2. 更新帖子图片路径 (t_post 表) - images 为 JSON 数组格式
-- 原数据: ["https://picsum.photos/..."] 更新为: ["/uploads/post/post_x.png"]
UPDATE `t_post` SET `images` = '["/uploads/post/post_1.png"]' WHERE `post_id` = 1;
UPDATE `t_post` SET `images` = '["/uploads/post/post_2.png"]' WHERE `post_id` = 2;
UPDATE `t_post` SET `images` = '["/uploads/post/post_3.png","/uploads/post/post_4.png"]' WHERE `post_id` = 3;
UPDATE `t_post` SET `images` = '["/uploads/post/post_1.png"]' WHERE `post_id` = 4;
UPDATE `t_post` SET `images` = '["/uploads/post/post_2.png"]' WHERE `post_id` = 5;

-- 3. 更新社团封面图片路径 (t_club 表) - 原数据为 picsum.photos
UPDATE `t_club` SET `cover_image` = '/uploads/club/club_1.png' WHERE `club_id` = 1;
UPDATE `t_club` SET `cover_image` = '/uploads/club/club_2.png' WHERE `club_id` = 2;
UPDATE `t_club` SET `cover_image` = '/uploads/club/club_3.png' WHERE `club_id` = 3;
UPDATE `t_club` SET `cover_image` = '/uploads/club/club_4.png' WHERE `club_id` = 4;
UPDATE `t_club` SET `cover_image` = '/uploads/club/club_5.png' WHERE `club_id` = 5;
UPDATE `t_club` SET `cover_image` = '/uploads/club/club_6.png' WHERE `club_id` = 6;

-- 4. 更新活动封面图片路径 (t_activity 表) - 原数据为 picsum.photos
UPDATE `t_activity` SET `cover_image` = '/uploads/activity/activity_1.png' WHERE `activity_id` = 1;
UPDATE `t_activity` SET `cover_image` = '/uploads/activity/activity_2.png' WHERE `activity_id` = 2;
UPDATE `t_activity` SET `cover_image` = '/uploads/activity/activity_3.png' WHERE `activity_id` = 3;
UPDATE `t_activity` SET `cover_image` = '/uploads/activity/activity_4.png' WHERE `activity_id` = 4;

-- 5. 更新二手商品图片路径 (t_second_hand 表) - images 为 JSON 数组格式
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_1.png"]' WHERE `item_id` = 1;
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_2.png"]' WHERE `item_id` = 2;
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_3.png","/uploads/goods/goods_4.png"]' WHERE `item_id` = 3;
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_5.png"]' WHERE `item_id` = 4;
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_6.png"]' WHERE `item_id` = 5;
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_7.png","/uploads/goods/goods_8.png"]' WHERE `item_id` = 6;
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_9.png"]' WHERE `item_id` = 7;
UPDATE `t_second_hand` SET `images` = '["/uploads/goods/goods_10.png"]' WHERE `item_id` = 8;

-- 6. 更新失物招领图片路径 (t_lost_found 表) - item_image 为单张图片
-- 类型 1=寻物启事(丢失), 2=招领启事(捡到)
UPDATE `t_lost_found` SET `item_image` = '/uploads/lostfound/lostfound_1.png' WHERE `item_id` = 1;
UPDATE `t_lost_found` SET `item_image` = '/uploads/lostfound/lostfound_2.png' WHERE `item_id` = 2;
UPDATE `t_lost_found` SET `item_image` = '/uploads/lostfound/lostfound_3.png' WHERE `item_id` = 3;
