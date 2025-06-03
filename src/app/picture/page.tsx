'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// 导入API函数
import { uploadImage } from '@/app/server/apis/Analytics';

// 定义类型接口
interface SelectedImage {
  file: File;
  dataUrl: string;
  name: string;
  size: number;
}

interface Detection {
  bbox: number[];
  confidence: number;
  class: number;
  class_name?: string;
}

interface DetectionResult {
  visulization?: string;
  head_up_rate?: number;
  detections?: Detection[];
}

// 简化版的图片上传检测页面
export default function PicturePage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [detectionResults, setDetectionResults] = useState<DetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 检查认证状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth');
      }
    }
  }, [router]);
  
  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!isValidImageFile(file)) {
        alert("请上传有效的图片文件 (JPG, PNG, JPEG)");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target && event.target.result) {
          setSelectedImage({
            file: file,
            dataUrl: event.target.result as string,
            name: file.name,
            size: file.size
          });
          setDetectionResults(null);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 检查文件类型
  const isValidImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return validTypes.includes(file.type);
  };
  
  // 移除已选择的图片
  const handleRemoveImage = (): void => {
    setSelectedImage(null);
    setDetectionResults(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // 处理图片检测 - 使用我们的API函数
  const handleDetectImage = async (): Promise<void> => {
    if (!selectedImage) {
      setError("请先上传图片");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // 使用我们的API函数替代直接fetch
      const response = await uploadImage(selectedImage.file);
      
      // 从响应中提取所需数据并适配到DetectionResult格式
      setDetectionResults({
        // 注意这里visualization而不是visulization - 需要修正UI展示时的字段名
        visulization: response.result.visualization,
        head_up_rate: response.result.head_up_rate,
        detections: response.result.detections.map(det => ({
          // 将box字段映射到bbox
          bbox: det.box,
          confidence: det.confidence,
          // 根据class名称判断类型
          class: det.class === "head_up" ? 1 : 0,
          class_name: det.class
        }))
      });
    } catch (err) {
      console.error("检测失败:", err);
      setError("图片检测失败，请稍后再试");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">图片抬头率检测</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">上传图片</h2>
        
        {/* 图片上传区域 */}
        <div 
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-blue-400 mb-6"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center">
            <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">点击上传图片</span>
            </p>
            <p className="text-xs text-gray-500">支持 JPG, JPEG, PNG 格式</p>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileChange}
        />
        
        {/* 图片预览 */}
        {selectedImage && (
          <div className="mb-6">
            <div className="relative border rounded-lg overflow-hidden">
              <div className="relative aspect-video">
                <Image 
                  src={selectedImage.dataUrl} 
                  alt="预览图片" 
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <button 
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {selectedImage.name} ({(selectedImage.size / 1024).toFixed(2)} KB)
            </div>
          </div>
        )}
        
        {/* 检测按钮 */}
        {selectedImage && !isProcessing && !detectionResults && (
          <button
            onClick={handleDetectImage}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            开始检测
          </button>
        )}
      </div>
      
      {/* 加载中状态 */}
      {isProcessing && (
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">正在分析图片...</p>
          </div>
        </div>
      )}
      
      {/* 检测结果 */}
      {detectionResults && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 pb-2 border-b">检测结果</h3>
          
          {/* 检测后图像 - 注意字段名称的使用 */}
          {detectionResults.visulization && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500 mb-2">检测后图像:</p>
              <div className="border rounded-lg overflow-hidden">
                <div className="relative aspect-video">
                  <Image 
                    src={`data:image/jpeg;base64,${detectionResults.visulization}`} 
                    alt="检测结果" 
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* 抬头率 */}
          {detectionResults.head_up_rate !== undefined && (
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500">抬头率:</p>
              <div className="mt-1 flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-600 h-4 rounded-full" 
                    style={{ width: `${detectionResults.head_up_rate * 100}%` }}
                  ></div>
                </div>
                <span className="ml-3 text-lg font-medium">
                  {(detectionResults.head_up_rate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
          
          {/* 检测到的目标 */}
          {detectionResults.detections && detectionResults.detections.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">检测到的对象:</p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <ul className="space-y-2">
                  {detectionResults.detections.map((detection, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="text-gray-700">{detection.class_name || `类别 ${detection.class}`}</span>
                      <span className="font-medium">{(detection.confidence * 100).toFixed(1)}% 置信度</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* 再次检测按钮 */}
          <button
            onClick={handleRemoveImage}
            className="mt-6 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            上传新图片
          </button>
        </div>
      )}
    </div>
  );
}