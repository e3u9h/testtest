import axios from "axios";
import { BACK_END } from "../config";
// I admit that I referred to some existing code in
// 【黑马程序员前端React18入门到实战视频教程，从react+hooks核心基础到企业级项目开发实战（B站评论、极客园项目等）及大厂面试全通关-哔哩哔哩】 https://b23.tv/hqVNyZA (P90: Day06-10.登录-封装request请求模块 and P96: Day7-01.Axios请求头注入Token)
// for creating the axios instace and the request interceptor,
// and added a response interceptor to automatically logout if the token is invalid

// This is an axios instance which will be used to make network requests to the backend
const request = axios.create({
    baseURL: BACK_END,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// axios request interceptor which can add the Json Web Token to all the request headers if the token exists
request.interceptors.request.use(
    (config) => {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        if (token !== undefined) {
            config.headers["Authorization"] = token;
        }
        return config;
    },
    (error) => {   
        return Promise.reject(error);
    }
);

// axios response interceptor which can remove the user information from localStorage
// if the response indicates that the token is invalid (has expired)
request.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && (error.response.status === 401)) {
        localStorage.removeItem('userInfo');
    }
    return Promise.reject(error);
});


export default request;