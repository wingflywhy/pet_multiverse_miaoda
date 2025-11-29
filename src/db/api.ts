import { supabase } from './supabase';
import type { Generation, CreateGenerationInput } from '@/types/types';

// 创建新的生成记录
export async function createGeneration(input: CreateGenerationInput): Promise<Generation | null> {
  const { data, error } = await supabase
    .from('generations')
    .insert({
      user_id: input.user_id,
      pet_type: input.pet_type,
      new_identity: input.new_identity,
      scenario: input.scenario,
      style: input.style,
      prompt: input.prompt,
      task_id: input.task_id || null,
      status: input.status || 'pending',
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('创建生成记录失败:', error);
    return null;
  }

  return data;
}

// 更新生成记录
export async function updateGeneration(
  id: string,
  updates: Partial<Pick<Generation, 'task_id' | 'image_url' | 'status'>>
): Promise<Generation | null> {
  const { data, error } = await supabase
    .from('generations')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('更新生成记录失败:', error);
    return null;
  }

  return data;
}

// 根据ID获取生成记录
export async function getGenerationById(id: string): Promise<Generation | null> {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('获取生成记录失败:', error);
    return null;
  }

  return data;
}

// 获取用户的所有生成记录（分页）
export async function getUserGenerations(
  userId: string,
  page = 0,
  pageSize = 20
): Promise<Generation[]> {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (error) {
    console.error('获取用户生成记录失败:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

// 获取所有成功的生成记录（用于展示画廊，分页）
export async function getAllSuccessGenerations(
  page = 0,
  pageSize = 20
): Promise<Generation[]> {
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('status', 'success')
    .order('created_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (error) {
    console.error('获取成功生成记录失败:', error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

// 上传图片到Supabase Storage
export async function uploadImageToStorage(
  file: Blob,
  fileName: string
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('app-7vwx2uoizda9_pet_images')
    .upload(fileName, file, {
      contentType: 'image/png',
      upsert: false,
    });

  if (error) {
    console.error('上传图片失败:', error);
    return null;
  }

  // 获取公开URL
  const { data: urlData } = supabase.storage
    .from('app-7vwx2uoizda9_pet_images')
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}
