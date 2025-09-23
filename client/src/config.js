// 根据环境自动选择后端地址
// 优先使用 REACT_APP_ENV，如果没有设置则回退到 NODE_ENV
const envMode = process.env.REACT_APP_ENV || process.env.NODE_ENV;
const isDevelopment = envMode === 'development' || !envMode;

console.log('Environment mode:', envMode);
console.log('Is development:', isDevelopment);

export const BACK_END = isDevelopment 
    ? process.env.REACT_APP_BACKEND_URL_DEV
    : process.env.REACT_APP_BACKEND_URL_PROD;

export const SOCKET_BACKEND = isDevelopment
    ? process.env.REACT_APP_SOCKET_URL_DEV
    : process.env.REACT_APP_SOCKET_URL_PROD;

console.log('Backend URL:', BACK_END);
console.log('Socket URL:', SOCKET_BACKEND);