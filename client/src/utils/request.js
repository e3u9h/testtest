import axios from "axios";
import { BACK_END } from "../config";

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

        // Auto-add /api prefix for certain routes
        const apiRoutes = [
            'users', 'tweets', 'tags', 'search', 'notifications', 'admin',
            'login', 'createuser', 'changepwd', 'profile', 'followinfo', 'interaction', 'cache'
        ];

        // Check if the URL starts with any of the API routes and doesn't already have /api prefix
        if (config.url && !config.url.startsWith('/api/') && !config.url.startsWith('/server/')) {
            const urlPath = config.url.startsWith('/') ? config.url.substring(1) : config.url;
            const routeMatch = apiRoutes.some(route =>
                urlPath === route ||
                urlPath.startsWith(route + '/') ||
                urlPath.startsWith(route + '?')
            );

            if (routeMatch) {
                config.url = '/api/' + urlPath;
            }
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