import instance from "../utils/axios";

export const AuthAPI = {
    // 用户登录
    login: (email:string,password:string) => {
        return instance.post('/auth/public/login', {email, password});
    },

    // 用户注册
    register: (username:string,email:string,password:string) => {
        return instance.post('/auth/public/register', {username,email, password});
    },

    // 更改密码
    password_change: (email:string ,password_old:string,password_new:string) => {
        return instance.put('/auth/user', {email,password_new,password_old});
    },

    //忘记密码
    password_forgot: (email:string,password_new:string) => {
        return instance.post('/auth/public/forgot', {email,password_new});
    },

    //退出登录
    logout:()=>{
        localStorage.removeItem('token');
        return instance.post('/auth/logout');
    }

    
};