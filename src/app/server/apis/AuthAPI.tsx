import instance from "../utils/axios";

export const AuthAPI = {
    // 用户登录
    login: (username:string,password:string) => {
        return instance.post('/auth/public/login', {username, password});
    },

    // 用户注册
    register: (username:string,password:string) => {
        return instance.post('/auth/public/register', {username, password});
    },

    // 更改密码
    password_change: (username:string ,password_old:string,password_new:string) => {
        return instance.put('/auth/user', {username,password_new,password_old});
    },

    //忘记密码
    password_forgot: (username:string,password_new:string) => {
        return instance.post('/auth/public/forgot', {username,password_new});
    },

    //退出登录
    logout:()=>{
        localStorage.removeItem('token');
        return instance.post('/auth/logout');
    }

    
};