'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
    const router = useRouter();

    // 鉴定是否有登录状态
    useEffect(() => {
        // 检查是否在浏览器环境中
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                // 如果没有 token，重定向到登录页面
                router.push('/auth');
            }
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 主要内容区域 */}
            <main className="pt-16">
                {/* 顶部横幅 */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                            抬头率检测系统
                        </h1>
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-indigo-100">
                            系统这一块
                        </p>
                        <div className="mt-10">
                            <Link href="/dashboard/videos" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50">
                                开始检测
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 功能区块 */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
                        系统功能
                    </h2>
                    
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* 功能卡片1：实时监测 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">实时检测</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            摄像头这一块
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link href="/dashboard/videos" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                        立即使用
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* 功能卡片2：数据分析 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">图片分析</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            图片这一块
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                        查看报告
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* 功能卡片3：个人中心 */}
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">个人中心</h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            这一块
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <Link href="/dashboard/profile" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                                        进入中心
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            
        </div>
    );
}