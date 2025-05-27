import axios ,{AxiosError,AxiosResponse}from 'axios';
import { baseURL } from '../../config';

const instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

instance.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem('token');
        if(token){
            config.headers = config.headers|| {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    error =>{
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
            return response.data.data;
        }
        
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            // 处理 HTTP 状态码错误
            const status = error.response.status;
            
            // 处理特定状态码
            switch (status) {
                case 401: // 未授权
                    // 清除认证信息
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                        // 重定向到登录页
                        window.location.href = '/auth';
                    }
                    break;
                    
                case 403: // 禁止访问
                    console.error('Access forbidden');
                    break;
                    
                case 404: // 资源不存在
                    console.error('Resource not found');
                    break;
                    
                case 500: // 服务器错误
                    console.error('Server error');
                    break;
                    
                default:
                    console.error(`Error with status: ${status}`);
            }
            /*
            // 可以集中显示错误信息
            const errorMessage = error.response.data?.message || 'Something went wrong';
            // 使用您的提示组件显示错误
            // showToast(errorMessage, 'error');
            console.error('Response error:', errorMessage);*/
        } else if (error.request) {
            // 请求已发送但未收到响应
            console.error('No response received:', error.request);
            // showToast('Network error, please check your connection', 'error');
        } else {
            // 请求配置出错
            console.error('Request error:', error.message);
            // showToast('Request configuration error', 'error');
        }
        
        // 必须返回 Promise.reject 以便调用方可以继续处理错误
        return Promise.reject(error);
    }
);


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