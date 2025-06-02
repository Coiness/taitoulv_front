'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import UserCard from "./card";
import '@/globals.css'
import { AuthAPI } from '@/app/server/apis/AuthAPI';
import { useRouter } from 'next/navigation';


export default function TopMenus() {
    const [showUserCard, setShowUserCard] = useState(false);
    const [username, setUsername] = useState("用户");
    const [email, setEmail] = useState("user@example.com");
    const router = useRouter();
    

    // 组件加载时从 localStorage 获取用户信息
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // 获取存储的用户信息
            const storedEmail = localStorage.getItem('email');
            const storedUsername = localStorage.getItem('username');
            
            if (storedEmail) {
                setEmail(storedEmail);
            }
            
            if (storedUsername) {
                setUsername(storedUsername);
            } else if (storedEmail) {
                // 如果没有用户名但有邮箱，可以从邮箱中提取一部分作为用户名
                const nameFromEmail = storedEmail.split('@')[0];
                setUsername(nameFromEmail);
            }
        }
    }, []);

    // 处理退出登录
    const handleLogout = async () => {
        if(!localStorage.getItem('token')){
            window.alert("退出登录失败，请稍后再试");
            return
        }


        try {
            await AuthAPI.logout();
            localStorage.removeItem('token');
            localStorage.setItem('username', '');
            localStorage.setItem('email','');
            localStorage.setItem('password','');
            setUsername("用户");
            setEmail("user@example.com")
        // 重定向到登录页
        router.push('/auth');
        } catch (error) {
            window.alert("退出登录失败，请稍后再试");
        console.error('退出登录失败', error);
        }
    };



    return(
        <div className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 w-full">
            <div className="max-w-8xl mx-auto px-0 sm:px-6 lg:px-8 w-full box-border">
                <div className="flex justify-between items-center h-16">
                    {/*左侧*/}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <div className="text-blue-600 font-bold text-xl hover:text-blue-800 transition-colors">
                                抬头率检测系统
                            </div>
                        </Link>
                    </div>
                    
                    {/* 右侧 */}
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            首页
                        </Link>
                        <Link href="/videos" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            视频检测
                        </Link>
                       
                        {/* 个人中心按钮和用户卡片 */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserCard(!showUserCard)}
                                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    {/* 显示用户名首字母 */}
                                    <span className="text-blue-600 font-medium">
                                        {username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </button>

                            {/* 用户卡片组件 */}
                            {showUserCard && (
                                <UserCard 
                                    username={username}
                                    email={email}
                                    isVisible={showUserCard}
                                    onClose={() => setShowUserCard(false)}
                                    handleLogout={handleLogout}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}