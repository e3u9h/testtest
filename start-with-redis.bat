@echo off
echo Starting Redis integration setup...



REM 检查 Docker 是否运行
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo Docker is running

echo Cleaning up existing Redis container...
docker rm -f redis-dev >nul 2>&1

echo Creating new Redis container...
docker run -d --name redis-dev -p 6379:6379 redis:7-alpine

REM 等待 Redis 启动
echo Waiting for Redis to be ready...
timeout /t 5 /nobreak >nul

echo Testing Redis connection...
docker exec redis-dev redis-cli ping >nul 2>&1
if %errorlevel% neq 0 (
    echo Redis is not responding
    pause
    exit /b 1
)

echo Redis is responding to ping

REM 启动应用
echo Starting Node.js application...
cd server
npm start
