'use client'
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VideosPage() {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [connected, setConnected] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [headUpRate, setHeadUpRate] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    // 新增：存储后端返回的可视化图像
    const [visualizationImage, setVisualizationImage] = useState<string | null>(null);

    // 处理认证和初始化
    useEffect(() => {
        // 检查是否在浏览器环境中
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                // 如果没有 token，重定向到登录页面
                router.push('/auth');
                return;
            }
            // 初始化连接
            initializeWebSocket();
        }

        // 组件卸载时清理资源
        return () => {
            cleanupResources();
        };
    }, [router]);

    // 初始化 WebSocket 连接
    const initializeWebSocket = () => {
        addLog("正在建立连接...");
        const token = localStorage.getItem('token');
        const wsUrl = `ws://localhost:3001/api/video/stream?token=${token}`;
        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onopen = () => {
            addLog("WebSocket 连接已建立");
            setConnected(true);
            setError(null);
            startCamera();
        };
        
        wsRef.current.onmessage = (event) => {
            try {
                console.log("Received message:", event.data);
                const data = JSON.parse(event.data);
                if (data.head_up_rate !== undefined) {
                    setHeadUpRate(data.head_up_rate);
                }
                // 新增：处理后端返回的可视化图像
                addLog(`visualization data received $data.visualization$`);
                console.log("visualization",data.visualization );
                if (data.visualization) {
                    setVisualizationImage(data.visualization);
                    addLog("接收到可视化结果");
                }
                if (data.error) {
                    setError(data.error);
                    addLog(`错误: ${data.error}`);
                }
            } catch (e) {
                console.error("解析消息失败", e);
                addLog("收到无效消息格式");
            }
        };
        
        wsRef.current.onclose = () => {
            addLog("WebSocket 连接已关闭");
            setConnected(false);
        };
        
        wsRef.current.onerror = (e) => {
            console.log(e);
            setError("WebSocket 连接错误");
            addLog("WebSocket 错误");
            setConnected(false);
        };
    };

    // 启动摄像头
    const startCamera = async () => {
        try {
            addLog("正在请求摄像头权限...");
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user" 
                } 
            });
            
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                    addLog("摄像头已启动");
                };
            }
        } catch (err) {
            console.error("无法启动摄像头:", err);
            setError("无法启动摄像头，请检查浏览器权限设置");
            addLog("摄像头启动失败");
        }
    };

    // 开始处理
    const startProcessing = () => {
        if (!connected || !videoRef.current || !canvasRef.current) {
            setError("请先连接 WebSocket 并启动摄像头");
            return;
        }
        
        setProcessing(true);
        addLog("开始检测抬头率...");
        
        // 设置定时发送视频帧
        const intervalId = setInterval(() => {
            captureAndSendFrame();
        }, 100); // 每秒发送一帧
        
        // 保存 intervalId 以便后续清理
        window.sessionStorage.setItem('frameInterval', intervalId.toString());
    };

    // 停止处理
    const stopProcessing = () => {
        const intervalId = window.sessionStorage.getItem('frameInterval');
        if (intervalId) {
            clearInterval(parseInt(intervalId));
            window.sessionStorage.removeItem('frameInterval');
        }
        setProcessing(false);
        setVisualizationImage(null); // 清除可视化图像
        addLog("已停止检测");
    };

    // 捕获并发送视频帧
    const captureAndSendFrame = () => {
        if (!videoRef.current || !canvasRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
        }
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        // 设置 canvas 尺寸与视频相匹配
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // 将视频帧绘制到 canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // 将 canvas 转换为 blob 并发送
        canvas.toBlob((blob) => {
            if (blob && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(blob);
            }
        }, 'image/jpeg', 0.8);
    };

    // 清理资源
    const cleanupResources = () => {
        // 停止处理
        stopProcessing();
        
        // 关闭 WebSocket
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        
        // 停止视频流
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    // 添加日志
    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
    };

    // 重新连接
    const reconnect = () => {
        cleanupResources();
        initializeWebSocket();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">抬头率实时检测</h1>
            
            {/* 状态指示器 */}
            <div className="mb-4 flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>{connected ? '已连接' : '未连接'}</span>
                {!connected && (
                    <button 
                        onClick={reconnect}
                        className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                        重新连接
                    </button>
                )}
            </div>
            
            {/* 错误消息 */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            
            <div className="flex flex-col lg:flex-row gap-6">
                {/* 左侧：可视化图像和控制 */}
                <div className="lg:w-2/3">
                    <div className="bg-black rounded-lg overflow-hidden relative">
                        {/* 显示后端返回的可视化图像 */}
                        {visualizationImage ? (
                            <img 
                                src={`data:image/jpeg;base64,${visualizationImage}`} 
                                className="w-full h-auto"
                                alt="检测结果"
                            />
                        ) : (
                            <div className="bg-gray-800 w-full aspect-video flex items-center justify-center text-white">
                                {processing ? '正在处理...' : '等待开始检测'}
                            </div>
                        )}
                        
                        {/* 抬头率显示 */}
                        {headUpRate !== null && (
                            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full">
                                抬头率: {(headUpRate * 100).toFixed(2)}%
                            </div>
                        )}
                    </div>
                    
                    {/* 隐藏的 canvas 用于处理视频帧 */}
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    
                    {/* 控制按钮 */}
                    <div className="mt-4 flex gap-4">
                        <button
                            onClick={startProcessing}
                            disabled={!connected || processing}
                            className={`px-4 py-2 rounded ${!connected || processing
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        >
                            开始检测
                        </button>
                        
                        <button
                            onClick={stopProcessing}
                            disabled={!processing}
                            className={`px-4 py-2 rounded ${!processing
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 text-white'}`}
                        >
                            停止检测
                        </button>
                    </div>
                </div>
                
                {/* 右侧：日志和信息 */}
                <div className="lg:w-1/3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h2 className="text-lg font-semibold mb-2">操作日志</h2>
                    <div className="h-32 overflow-y-auto text-sm bg-white p-3 rounded border border-gray-200">
                        {logs.map((log, index) => (
                            <div key={index} className="mb-1">
                                {log}
                            </div>
                        ))}
                        {logs.length === 0 && (
                            <div className="text-gray-500 italic">暂无日志</div>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">使用说明</h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                            <li>请确保您已允许浏览器访问摄像头</li>
                            <li>点击“开始检测“”按钮开始分析抬头率</li>
                            <li>检测过程中，请保持面部在摄像头视野内</li>
                            <li>系统会实时显示您的抬头率数据</li>
                        </ul>
                    </div>
                    
                    {/* 摄像头视频移到这里 */}
                    <div className="mt-4">
                        <h3 className="font-medium mb-2">摄像头预览</h3>
                        <div className="bg-black rounded-lg overflow-hidden">
                            <video 
                                ref={videoRef} 
                                className="w-full h-auto"
                                playsInline
                                muted
                            ></video>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}