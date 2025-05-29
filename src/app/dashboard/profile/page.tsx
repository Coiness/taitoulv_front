'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Profile() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        // 检查是否在浏览器环境中
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                // 如果没有 token，重定向到登录页面
                router.push('/auth');
                return;
            }
            
            // 获取用户信息
            const storedEmail = localStorage.getItem('useremail');
            const storedUsername = localStorage.getItem('username');
            
            if (storedEmail) setEmail(storedEmail);
            if (storedUsername) {
                setUsername(storedUsername);
            } else if (storedEmail) {
                // 如果没有用户名，使用邮箱前缀作为用户名
                setUsername(storedEmail.split('@')[0]);
            }
            
            setLoading(false);
        }
    }, [router]);

    // 处理密码修改功能
    const handlePasswordChange = () => {
        // 设置状态为修改密码并跳转
        localStorage.setItem('authMode', 'passwordChange');
        router.push('/auth');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            个人信息
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            您的账户详细信息
                        </p>
                    </div>
                    
                    <div className="border-t border-gray-200">
                        <dl>
                            {/* 用户名 */}
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    用户名
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                                    <span className="font-medium">{username}</span>
                                </dd>
                            </div>
                            
                            {/* 邮箱 */}
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    邮箱地址
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                                    <span className="font-medium">{email}</span>
                                </dd>
                            </div>
                            
                            {/* 密码 */}
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    密码
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center justify-between">
                                    <span className="font-medium">••••••••</span>
                                    <button
                                        onClick={handlePasswordChange}
                                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        修改密码
                                    </button>
                                </dd>
                            </div>
                            
                            {/* 账户创建时间 - 可选 */}
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    账户状态
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        已激活
                                    </span>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
                
                {/* 返回按钮 */}
                <div className="mt-6">
                    <Link 
                        href="/"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                        ← 返回首页
                    </Link>
                </div>
            </div>
        </div>
    );
}