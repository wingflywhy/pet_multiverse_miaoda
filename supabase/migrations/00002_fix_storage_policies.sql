/*
# 修复存储桶策略

## 说明
确保存储桶策略正确配置，允许匿名用户上传和读取图片。

## 策略
1. 删除可能存在的旧策略
2. 重新创建正确的策略，允许所有用户（包括匿名用户）上传和读取
*/

-- 删除可能存在的旧策略
DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;

-- 创建新策略：允许所有人（包括匿名用户）上传
CREATE POLICY "Allow all uploads to pet images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'app-7vwx2uoizda9_pet_images');

-- 创建新策略：允许所有人（包括匿名用户）读取
CREATE POLICY "Allow all reads from pet images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'app-7vwx2uoizda9_pet_images');

-- 创建新策略：允许所有人（包括匿名用户）更新
CREATE POLICY "Allow all updates to pet images"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'app-7vwx2uoizda9_pet_images')
WITH CHECK (bucket_id = 'app-7vwx2uoizda9_pet_images');

-- 创建新策略：允许所有人（包括匿名用户）删除
CREATE POLICY "Allow all deletes from pet images"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'app-7vwx2uoizda9_pet_images');