/*
# 创建宠物平行宇宙生成记录表和存储桶

## 1. 简介
本迁移文件为My Pet's Multiverse应用创建必要的数据库结构，用于存储用户生成的宠物平行宇宙图片记录。

## 2. 新建表

### `generations` 表
用于存储每次AI生成的记录，包括用户输入参数、生成状态和结果图片。

字段说明：
- `id` (uuid, primary key) - 记录唯一标识
- `user_id` (text, not null) - 匿名用户UUID标识
- `pet_type` (text, not null) - 宠物种类（如：柴犬、橘猫）
- `new_identity` (text, not null) - 新身份（如：国际特工）
- `scenario` (text, not null) - 任务场景（如：雪山顶上秘密接头）
- `style` (text, not null) - 艺术风格（如：写实、卡通）
- `prompt` (text, not null) - 完整的AI生成指令
- `task_id` (text) - API返回的任务ID
- `image_url` (text) - 生成的图片URL（存储在Supabase Storage中）
- `status` (text, not null, default 'pending') - 生成状态：pending/processing/success/failed
- `created_at` (timestamptz, default now()) - 创建时间

## 3. 存储桶

### `app-7vwx2uoizda9_pet_images` 桶
用于持久化存储AI生成的宠物图片。

配置：
- 公开访问
- 文件大小限制：1MB
- 允许的MIME类型：image/png, image/jpeg, image/jpg

## 4. 安全策略
由于使用匿名UUID模式，不启用RLS，所有用户可以查看所有生成记录（符合社交分享的产品定位）。
存储桶设置为公开访问，便于图片分享。

## 5. 索引
为user_id和created_at创建索引，优化查询性能。
*/

-- 创建generations表
CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  pet_type text NOT NULL,
  new_identity text NOT NULL,
  scenario text NOT NULL,
  style text NOT NULL,
  prompt text NOT NULL,
  task_id text,
  image_url text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- 创建索引以优化查询
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);

-- 创建存储桶用于存储生成的图片
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'app-7vwx2uoizda9_pet_images',
  'app-7vwx2uoizda9_pet_images',
  true,
  1048576,
  ARRAY['image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- 设置存储桶策略：允许所有人上传和读取
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT TO public
  WITH CHECK (bucket_id = 'app-7vwx2uoizda9_pet_images');

CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'app-7vwx2uoizda9_pet_images');