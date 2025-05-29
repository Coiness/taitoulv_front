'use client'



/**
 * @file layout.tsx
 * @description 首页内容文件
 * 帮我设计一下主页
 */
import React from 'react';
import { useEffect } from 'react';




export default function Home(){

    //鉴定是否有登录状态
    useEffect(()=>{
        // 检查是否在浏览器环境中
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (!token) {
                // 如果没有 token，重定向到登录页面
                window.location.href = '/auth';
            }
        }
    })


    return(
        <div className="home-container">
            <h1>抬头率检测</h1>
        </div>
    )
}