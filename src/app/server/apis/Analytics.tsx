import axios from '../utils/axios';
import { AxiosRequestConfig } from 'axios';

// 定义接口类型
interface UploadImageResponse {
  status: string;
  filename: string;
  result: {
    timestamp: string;
    detections: Array<{
      class: string;
      confidence: number;
      box: number[];
    }>;
    head_up_rate: number;
    visualization: string;
    status: string;
  };
}

interface VideoSession {
  id: number;
  start_time: string;
  end_time: string;
  average_head_up_rate: number;
  session_duration: number;
}

// 新增WebSocket响应数据类型
interface VideoAnalysisResult {
  timestamp: string;
  detections: Array<{
    class: string;
    confidence: number;
    box: number[];
  }>;
  head_up_rate: number;
  visualization: string;  // Base64编码的图像
  average_head_up_rate: number;
}

/**
 * 上传图片到服务器进行分析
 * @param file 要上传的图片文件
 */
export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  try {
    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);

    // 配置请求选项，特别是指定内容类型为multipart/form-data
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    // 发送请求 - 修改为完整的API路径
    const response = await axios.post('/video/upload/image', formData, config);
    return response.data;
  } catch (error) {
    console.error('上传图片失败:', error);
    throw error;
  }
};

/**
 * 获取指定用户的视频分析会话记录
 * @param userId 用户ID
 */
export const getUserSessions = async (userId: number): Promise<VideoSession[]> => {
  try {
    const response = await axios.get(`/video/sessions/${userId}`);
    return response.data;
  } catch (error) {
    console.error('获取用户会话记录失败:', error);
    throw error;
  }
};

/**
 * 建立WebSocket连接进行实时视频分析
 * @param onMessage 处理服务器返回的分析结果的回调函数
 * @param onError 处理错误的回调函数
 * @returns WebSocket实例和关闭连接的函数
 */
export const connectVideoStream = (
  onMessage: (data: VideoAnalysisResult) => void,
  onError?: (error: Event) => void
) => {
  // 从配置获取WebSocket URL
  const wsUrl = `ws://${window.location.hostname}:8000/api/video/stream`;
  
  // 创建WebSocket连接
  const ws = new WebSocket(wsUrl);
  
  // 设置事件处理器
  ws.onopen = () => {
    console.log('视频分析WebSocket连接已建立');
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as VideoAnalysisResult;
      onMessage(data);
    } catch (error) {
      console.error('解析WebSocket消息失败:', error);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket连接错误:', error);
    if (onError) onError(error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket连接已关闭');
  };
  
  // 返回WebSocket实例和关闭函数
  return {
    ws,
    close: () => {
      ws.close();
    },
    // 发送视频帧的方法
    sendFrame: (frameData: Blob) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(frameData);
      } else {
        console.warn('WebSocket连接未打开，无法发送视频帧');
      }
    }
  };
};