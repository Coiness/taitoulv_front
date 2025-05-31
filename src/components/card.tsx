'use client';

import React, {  useRef, useEffect } from 'react';
import Link from 'next/link';

interface UserCardProps {
    username: string;
    email: string;
    isVisible: boolean;
    onClose: () => void;
    handleLogout: () => void;
}

export default function UserCard({ username, email, isVisible, onClose ,handleLogout}: UserCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    
    // 处理点击外部关闭卡片
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
            onClose();
        }
        }
        
        if (isVisible) {
        document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible, onClose]);
    
    
    
    if (!isVisible) return null;
    
    return (
        <div 
        ref={cardRef}
        className="absolute right-0 top-16 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden"
        style={{ animation: 'fadeIn 0.2s ease-out' }}
        >
        <div className="px-4 py-3 border-b border-gray-200">
            <p className="font-medium text-gray-800">{username}</p>
            <p className="text-sm text-gray-500 truncate">{email}</p>
        </div>
        
        <div className="p-2">
            <Link href="/dashboard/profile">
            <div className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                个人中心
            </div>
            </Link>
            
            <button 
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-md flex items-center transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            退出登录
            </button>
        </div>
        </div>
    );
}


