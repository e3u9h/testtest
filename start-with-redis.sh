#!/bin/bash

echo "Starting Redis integration setup..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "Docker is running"

# 启动 Redis 容器（如果不存在）
if ! docker ps | grep -q redis; then
    echo "Starting Redis container..."
    docker run -d --name redis-dev -p 6379:6379 redis:7-alpine
    sleep 3
else
    echo "Redis container is already running"
fi

# 测试 Redis 连接
echo " Testing Redis connection..."
if docker exec redis-dev redis-cli ping > /dev/null 2>&1; then
    echo " Redis is responding to ping"
else
    echo "Redis is not responding"
    exit 1
fi

# 启动应用
echo "Starting Node.js application..."
cd server
npm start
