// 数据库表类型定义

export interface Generation {
  id: string;
  user_id: string;
  pet_type: string;
  new_identity: string;
  scenario: string;
  style: string;
  prompt: string;
  task_id: string | null;
  image_url: string | null;
  status: 'pending' | 'processing' | 'success' | 'failed';
  created_at: string;
}

// 创建Generation时的输入类型
export interface CreateGenerationInput {
  user_id: string;
  pet_type: string;
  new_identity: string;
  scenario: string;
  style: string;
  prompt: string;
  task_id?: string;
  status?: 'pending' | 'processing' | 'success' | 'failed';
}

// AI作画API相关类型
export interface TextToImageRequest {
  prompt: string;
  image?: string;
  url?: string;
  text_content?: string;
}

export interface TextToImageResponse {
  status: number;
  msg: string;
  data: {
    task_id: string;
  };
}

export interface GetImageRequest {
  task_id: string;
}

export interface GetImageResponse {
  status: number;
  msg: string;
  data: {
    log_id: number;
    task_id: number;
    task_status: 'INIT' | 'WAIT' | 'RUNNING' | 'FAILED' | 'SUCCESS';
    task_progress_detail: number;
    task_progress: number;
    sub_task_result_list: Array<{
      sub_task_status: 'INIT' | 'WAIT' | 'RUNNING' | 'FAILED' | 'SUCCESS';
      sub_task_progress_detail: number;
      sub_task_progress: number;
      sub_task_error_code: string;
      final_image_list: Array<{
        img_url: string;
        height: number;
        width: number;
        img_approve_conclusion: string;
      }>;
    }>;
  };
}
