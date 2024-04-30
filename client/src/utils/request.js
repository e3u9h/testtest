import axios from "axios";

const BACK_END = "http://localhost:8000/";

const request = axios.create({
    baseURL: BACK_END,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});


request.interceptors.request.use(
    (config) => {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        if (token !== undefined) {
            config.headers["Authorization"] = token;
        }
        return config;
    },
    (error) => {
        localStorage.removeItem('userInfo');
        return Promise.reject(error);
    }
);


export default request;