'use client';

import React, { useEffect } from "react";
import { useState } from "react";
import '@/globals.css'

export default function AuthPage() {
    const [model, setModel] = useState<"login" | "register" | "forget">("login");
    const [useremail, setUseremail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [rule1, setRule1] = useState<boolean>(false);
    const [rule2, setRule2] = useState<boolean>(false);
    const [rule3, setRule3] = useState<boolean>(false);
    const [rememberPassword, setRememberPassword] = useState<boolean>(false);

    //实现实时验证密码匹配
    useEffect(() => {
        setRule1(password.length >= 8 && password.length <= 16);
        setRule2(/^(?=.*[a-zA-Z])(?=.*\d)/.test(password));
        setRule3(password === confirmPassword && password !== "");
    }, [password, confirmPassword]);

    return (
        <div className="min-h-screen min-w-7 overflow-hidden bg-gray-50 flex items-center justify-center py-12 px-8 sm:px-6 lg:px-8">
            <div className="max-w-7xl w-full flex rounded-xl shadow-lg overflow-hidden">
                {/* 左侧蓝色背景区域 */}
                <div className="hidden md:block md:w-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 p-10 flex-col justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-6">抬头率检测系统</h1>
                        <p className="text-xl text-white opacity-80">智能视频分析平台</p>
                        <div className="mt-10">
                            <img src="/logo.png" alt="Logo" className="h-48 mx-auto" />
                        </div>
                    </div>
                </div>

                {/* 右侧表单区域 */}
                <div className="w-full md:w-1/2 bg-white p-8 flex flex-col justify-center">
                    {model === "login" && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">登录</h2>
                                <p className="text-sm text-gray-500">欢迎回来，请输入您的登录信息</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="sr-only">邮箱</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={useremail}
                                        onChange={(e) => setUseremail(e.target.value)}
                                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="用户邮箱"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">密码</label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="密码"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-password"
                                        type="checkbox"
                                        checked={rememberPassword}
                                        onChange={() => setRememberPassword(!rememberPassword)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-password" className="ml-2 block text-sm text-gray-700">
                                        记住密码
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <button onClick={() => setModel("forget")} className="font-medium text-blue-600 hover:text-blue-500">
                                        忘记密码?
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={() => {
                                        if (useremail === "" || password === "") {
                                            alert("请输入邮箱和密码");
                                            return;
                                        }
                                        alert("登录成功");
                                        window.location.href = "/";
                                    }}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    登录
                                </button>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    还没有账号?{' '}
                                    <button onClick={() => setModel("register")} className="font-medium text-blue-600 hover:text-blue-500">
                                        立即注册
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}

                    {model === "register" && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">注册账号</h2>
                                <p className="text-sm text-gray-500">创建一个新账号，开始使用系统</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        value={useremail}
                                        onChange={(e) => setUseremail(e.target.value)}
                                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="用户邮箱"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="密码"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="确认密码"
                                    />
                                </div>
                                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                                    <div className="flex items-center">
                                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${rule1 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                                            {rule1 ? '✓' : '✗'}
                                        </span>
                                        <span className="text-sm text-gray-700">密码长度不小于8位，不大于16位</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${rule2 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                                            {rule2 ? '✓' : '✗'}
                                        </span>
                                        <span className="text-sm text-gray-700">密码必须包含字母、数字</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${rule3 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                                            {rule3 ? '✓' : '✗'}
                                        </span>
                                        <span className="text-sm text-gray-700">两次密码输入必须相同</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={() => {
                                        if (rule1 && rule2 && rule3) {
                                            alert("注册成功");
                                            setModel("login");
                                        } else {
                                            alert("请检查密码规则");
                                        }
                                    }}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    立即注册
                                </button>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    已有账号?{' '}
                                    <button onClick={() => setModel("login")} className="font-medium text-blue-600 hover:text-blue-500">
                                        返回登录
                                    </button>
                                </p>
                            </div>
                        </div>
                    )}

                    {model === "forget" && (
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">重置密码</h2>
                                <p className="text-sm text-gray-500">请输入您的邮箱和新密码</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="email"
                                        value={useremail}
                                        onChange={(e) => setUseremail(e.target.value)}
                                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="用户邮箱"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="新密码"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="确认新密码"
                                    />
                                </div>
                                <div className="bg-gray-50 p-4 rounded-md space-y-2">
                                    <div className="flex items-center">
                                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${rule1 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                                            {rule1 ? '✓' : '✗'}
                                        </span>
                                        <span className="text-sm text-gray-700">密码长度不小于8位，不大于16位</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${rule2 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                                            {rule2 ? '✓' : '✗'}
                                        </span>
                                        <span className="text-sm text-gray-700">密码必须包含字母、数字</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 ${rule3 ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                                            {rule3 ? '✓' : '✗'}
                                        </span>
                                        <span className="text-sm text-gray-700">两次密码输入必须相同</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    onClick={() => {
                                        if (rule1 && rule2 && rule3) {
                                            alert("密码重置成功");
                                            setModel("login");
                                        } else {
                                            alert("请检查密码规则");
                                        }
                                    }}
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    重置密码
                                </button>
                            </div>
                            
                            <div className="text-center">
                                <button 
                                    onClick={() => setModel("login")} 
                                    className="font-medium text-blue-600 hover:text-blue-500 text-sm"
                                >
                                    返回登录
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}