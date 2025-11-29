// 管理匿名用户UUID

const USER_ID_KEY = 'pet_multiverse_user_id';

// 获取或创建用户ID
export function getUserId(): string {
  let userId = localStorage.getItem(USER_ID_KEY);
  
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  
  return userId;
}

// 清除用户ID（用于测试或重置）
export function clearUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
}
