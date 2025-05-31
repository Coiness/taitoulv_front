import axios ,{AxiosError,AxiosResponse}from 'axios';
import { baseURL } from '../../config';

const instance = axios.create({
    baseURL: baseURL,
    timeout: 1000,
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    }
})

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 确保明确设置内容类型
        if (config.method !== 'get') {
            config.headers = config.headers || {};
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }

        // 转换请求数据为表单格式
        if (config.data && config.method !== 'get') {
            console.log("转换格式前的数据:", config.data);
            const formData = new URLSearchParams();
            for (const key in config.data) {
                formData.append(key, config.data[key]);
            }
            config.data = formData;
            console.log("转换格式后的数据:", config.data.toString());
        }

        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
)

// 响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        // 统一处理响应数据
        if (response.data && response.data.code === 200) {
            // 如果后端返回格式统一，可以在这里解构
            // 例如：{ code: 200, data: {...}, message: '' }
            return response.data;
        }
        
        return response;
    },
    (error: AxiosError) => {
        if(error.code === 'ECONNABORTED'){
            window.alert("请求超时，请检查网络连接");
            console.error('Request timeout:',error.message);
            return Promise.reject(error);
        }

        if (error.response) {
            // 提取错误详情
            const responseData = error.response.data as any;
            let errorMessage = "请求失败";
            
            // 尝试从各种可能的格式中提取错误信息
            if (responseData) {
                if (typeof responseData.detail === 'string') {
                    // 简单字符串形式: { "detail": "用户名已存在" }
                    errorMessage = responseData.detail;
                } else if (Array.isArray(responseData.detail)) {
                    // 数组形式: { "detail": [{"type": "...", "msg": "..."}, ...] }
                    const details = responseData.detail.map((item: any) => item.msg || item.message || JSON.stringify(item)).join('; ');
                    errorMessage = details || "请求失败，请检查输入";
                } else if (typeof responseData.message === 'string') {
                    // 有些API使用message字段: { "message": "错误信息" }
                    errorMessage = responseData.message;
                } else if (typeof responseData === 'string') {
                    // 直接返回字符串
                    errorMessage = responseData;
                } else {
                    // 尝试将整个响应转为字符串
                    errorMessage = JSON.stringify(responseData);
                }
            }
            
            // 显示错误信息
            window.alert(errorMessage);
            console.error('Response error:', errorMessage, responseData);
            
            // 特定状态码的处理
            const status = error.response.status;
            if (status === 401) {
                // 未授权，可能需要清除认证并重定向到登录页
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    // 如果不是在登录页，则重定向到登录页
                    if (!window.location.pathname.includes('/auth')) {
                        window.location.href = '/auth';
                    }
                }
            }
        } else if (error.request) {
            // 请求已发送但未收到响应
            window.alert("服务器无响应，请稍后再试");
            console.error('No response received:', error.request);
        } else {
            // 请求配置出错
            window.alert("请求发送失败: " + error.message);
            console.error('Request error:', error.message);
        }
        
        // 必须返回 Promise.reject 以便调用方可以继续处理错误
        return Promise.reject(error);
    }
);


/*
// 响应拦截器
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        // 统一处理响应数据
        if (response.data && response.data.code === 200) {
            // 如果后端返回格式统一，可以在这里解构
            // 例如：{ code: 200, data: {...}, message: '' }
            return response.data;
        }
        
        return response;
    },
    (error: AxiosError) => {
        if(error.code === 'ECONNABORTED'){
            window.alert("请求超时，请检查网络连接");
            console.error('Request timeout:',error.message);
            return Promise.reject(error);
        }



        if (error.response) {

            window.alert()
            /*
            // 处理 HTTP 状态码错误
            const status = error.response.status;
            
            // 处理特定状态码
            switch (status) {
                case 401: // 未授权
                    // 清除认证信息
                    if (typeof window !== 'undefined') {
                        window.alert("用户名或密码错误");
                        localStorage.removeItem('token');
                        // 重定向到登录页
                        window.location.href = '/auth';
                    }
                    break;
                    
                case 403: // 禁止访问
                    window.alert("禁止访问");
                    console.error('Access forbidden');
                    break;
                    
                case 404: // 资源不存在
                    window.alert("资源不存在");
                    console.error('Resource not found');
                    break;
                    
                case 500: // 服务器错误
                    window.alert("服务器错误");
                    console.error('Server error');
                    break;
                    
                default:
                    window.alert(`Error with status: ${status}`);
                    console.error(`Error with status: ${status}`);
            }
            
        
        } else if (error.request) {
            // 请求已发送但未收到响应
            console.error('No response received:', error.request);
        } else {
            // 请求配置出错
            console.error('Request error:', error.message);
        }
        
        // 必须返回 Promise.reject 以便调用方可以继续处理错误
        return Promise.reject(error);
    }
);*/

export const createCancelToken = () => {
    const controller = new AbortController();
    return{
        signal:controller.signal,
        cancel:(message?:string)=>{
            controller.abort(message);
        }
    }
}

export default instance;