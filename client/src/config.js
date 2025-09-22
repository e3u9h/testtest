// 根据环境自动选择后端地址
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export const BACK_END = isDevelopment 
    ? "http://localhost:8000/"  // 开发环境使用本地后端（端口 8000）
    : "http://social-media-app-alb-1860649415.us-east-2.elb.amazonaws.com/"; // 生产环境使用 AWS

export const SOCKET_BACKEND = isDevelopment
    ? "ws://localhost:8000"   // 开发环境使用本地 WebSocket（端口 8000）
    : "ws://social-media-app-alb-1860649415.us-east-2.elb.amazonaws.com"; // 生产环境使用 AWS