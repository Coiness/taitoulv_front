/*
组件设计
1. 组件名称：TopMenus
2. 组件功能：
    -  首页图标，点击跳转到首页
    -  个人中心图标，点击出现个人信息卡片
3. 组件结构：
    -  顶部菜单栏
    -  首页图标
    -  个人中心图标
*/

import React from "react";
import Link from "next/link";
import '@/globals.css'

export default function TopMenus() {
    return(
        <div className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 w-full  ">
            <div className="max-w-8xl mx-auto px-0 sm:px-6 lg:px-8 w-full box-border  " >
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
                        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            控制台
                        </Link>
                        <Link href="/dashboard/profile" className="flex items-center text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            <span className="mr-2">个人中心</span>
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                {/* 这里可以放用户头像或者简单的用户图标 */}
                                <span className="text-gray-600">U</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}