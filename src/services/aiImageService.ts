import type { TextToImageRequest, TextToImageResponse, GetImageRequest, GetImageResponse } from '@/types/types';

const APP_ID = import.meta.env.VITE_APP_ID;

// 自定义错误类型
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

// AI作画提交接口
export async function submitTextToImage(request: TextToImageRequest): Promise<TextToImageResponse> {
  try {
    const response = await fetch(
      'https://api-integrations.appmiaoda.com/app-7vwx2uoizda9/api-jWeLMG1ga4G0/rpc/2.0/wenxin/v1/irag/textToImage',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Id': APP_ID,
        },
        body: JSON.stringify(request),
      }
    );

    const data = await response.json();
    
    // 处理并发超限错误
    if (data.status === 999) {
      const errorMsg = data.msg || 'AI作画提交失败';
      
      // 检查是否是并发超限
      if (errorMsg.includes('并发超限') || errorMsg.includes('并发限制')) {
        throw new AIServiceError(
          '当前使用人数较多，请稍后再试（建议等待1-2分钟）',
          'CONCURRENT_LIMIT',
          true
        );
      }
      
      throw new AIServiceError(errorMsg, 'API_ERROR', false);
    }
    
    if (data.status !== 0) {
      throw new AIServiceError(
        data.msg || 'AI作画提交失败',
        'API_ERROR',
        false
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AIServiceError) {
      throw error;
    }
    
    // 网络错误
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new AIServiceError(
        '网络连接失败，请检查网络后重试',
        'NETWORK_ERROR',
        true
      );
    }
    
    throw new AIServiceError(
      '提交请求失败，请稍后重试',
      'UNKNOWN_ERROR',
      true
    );
  }
}

// AI作画查询结果接口
export async function getImageResult(request: GetImageRequest): Promise<GetImageResponse> {
  const response = await fetch(
    'https://api-integrations.appmiaoda.com/app-7vwx2uoizda9/api-BEoYAP1DLdM1/rpc/2.0/wenxin/v1/irag/getImg',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify(request),
    }
  );

  const data = await response.json();
  
  if (data.status === 999) {
    throw new Error(data.msg || 'AI作画查询失败');
  }
  
  if (data.status !== 0) {
    throw new Error(data.msg || 'AI作画查询失败');
  }

  return data;
}

// 轮询查询图片生成结果
export async function pollImageResult(
  taskId: string,
  maxAttempts = 30,
  interval = 10000
): Promise<string> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const result = await getImageResult({ task_id: taskId });

    if (result.data.task_status === 'SUCCESS') {
      const imageUrl = result.data.sub_task_result_list[0]?.final_image_list[0]?.img_url;
      if (imageUrl) {
        return imageUrl;
      }
      throw new Error('生成成功但未找到图片URL');
    }

    if (result.data.task_status === 'FAILED') {
      throw new Error('图片生成失败');
    }

    // 等待后继续查询
    await new Promise(resolve => setTimeout(resolve, interval));
    attempts++;
  }

  throw new Error('图片生成超时，请稍后重试');
}

// 下载图片并转换为Blob
export async function downloadImageAsBlob(imageUrl: string): Promise<Blob> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error('下载图片失败');
  }
  return await response.blob();
}
