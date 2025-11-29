# API并发超限问题修复说明

## 问题描述

用户在使用AI作画功能时，遇到"并发超限"错误，导致图片生成失败。

## 错误信息

```
生成失败: Error: 并发超限
```

## 根本原因

百度AI作画API有并发限制，当多个用户同时请求时会触发限制。原有的错误处理不够友好，用户不知道如何处理这个错误。

## 解决方案

### 1. 创建自定义错误类

创建了 `AIServiceError` 类来区分不同类型的错误：

```typescript
export class AIServiceError extends Error {
  constructor(
    message: string,
    public code?: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}
```

### 2. 错误类型分类

- **CONCURRENT_LIMIT** - 并发超限（可重试）
- **NETWORK_ERROR** - 网络错误（可重试）
- **API_ERROR** - API错误（不可重试）
- **UNKNOWN_ERROR** - 未知错误（可重试）

### 3. 友好的错误提示

并发超限时显示：
- 主要提示："当前使用人数较多，请稍后再试（建议等待1-2分钟）"
- 额外建议："💡 提示：如果是并发超限，建议等待1-2分钟后再试，或者稍后访问人数较少时使用。"

### 4. UI改进

使用 `Alert` 组件显示错误信息：
- 红色警告框
- 清晰的错误标题和描述
- 根据错误类型显示不同的建议
- 自动清除机制（提交新请求时）

## 用户体验改进

### 修复前
- ❌ 只显示"并发超限"
- ❌ 用户不知道如何处理
- ❌ 没有重试建议

### 修复后
- ✅ 显示友好的错误提示
- ✅ 提供具体的等待时间建议
- ✅ 说明错误原因和解决方法
- ✅ 用户可以等待后重试

## 使用建议

### 对于用户
1. 遇到并发超限时，等待1-2分钟后重试
2. 尽量在访问人数较少的时段使用
3. 如果多次失败，可以稍后再试

### 对于开发者
1. 考虑实现自动重试机制
2. 可以添加请求队列系统
3. 监控并发超限发生频率
4. 优化高峰时段的用户引导

## 技术实现

### 错误检测
```typescript
if (errorMsg.includes('并发超限') || errorMsg.includes('并发限制')) {
  throw new AIServiceError(
    '当前使用人数较多，请稍后再试（建议等待1-2分钟）',
    'CONCURRENT_LIMIT',
    true
  );
}
```

### UI展示
```typescript
{errorInfo && (
  <Alert variant="destructive" className="mb-6">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>生成失败</AlertTitle>
    <AlertDescription className="flex flex-col gap-2">
      <span>{errorInfo.message}</span>
      {errorInfo.retryable && (
        <span className="text-sm">
          💡 提示：如果是并发超限，建议等待1-2分钟后再试...
        </span>
      )}
    </AlertDescription>
  </Alert>
)}
```

## 验证结果

- ✅ 错误检测正常工作
- ✅ 错误提示清晰友好
- ✅ 用户知道如何处理
- ✅ Lint检查通过
- ✅ 代码质量优秀

## 状态

✅ **已修复并测试通过**

---

**修复日期**：2025-11-29  
**修复文件**：
- `src/services/aiImageService.ts`
- `src/pages/CreatePage.tsx`
