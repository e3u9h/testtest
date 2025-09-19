@echo off
echo Starting Redis integration setup...

REM 检查 .env 文件是否存在
if not exist ".env" (
    echo  .env file not found. Creating default .env file...
    echo MONGO_URI=mongodb+srv://qwerty:qwer4321@cluster0.5gm5w78.mongodb.net/?retryWrites=true^&w=majority^&appName=Cluster0 > .env
    echo JWT_KEY="jwtkey111111" >> .env
    echo REDIS_URL=redis://localhost:6379 >> .env
    echo Default .env file created
) else (
    echo  .env file found
)

REM 检查 Docker 是否运行
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo Docker is running

REM 启动 Redis 容器（如果不存在）
docker ps | findstr redis >nul
if %errorlevel% neq 0 (
    echo Starting Redis container...
    docker run -d --name redis-dev -p 6379:6379 redis:7-alpine
    timeout /t 3 /nobreak >nul
) else (
    echo Redis container is already running
)

echo 🔍 Testing Redis connection...
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
