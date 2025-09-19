import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server as SocketIOServer} from 'socket.io';
import { expressjwt } from 'express-jwt';
import './utils/redisClient.js'; // 初始化 Redis 连接

// Import middleware
import performanceMonitor from './middlewares/performanceMonitor.js';

// Import route modules
import conversationRoute from "./routes/conversations.js";
import messageRoute from "./routes/messages.js";
import loginRoute from "./routes/login.js";
import registerRoute from "./routes/createuser.js";
import changepwdRoute from "./routes/changepwd.js";
import profileRoute from "./routes/profile.js";
import followinfoRoute from "./routes/getfollowinfo.js";
import interactionRoute from "./routes/userinteraction.js";
import cacheRoute from "./routes/cache.js";

// Import new modularized routes
import usersRoute from "./routes/users.js";
import tweetsRoute from "./routes/tweets.js";
import tagsRoute from "./routes/tags.js";
import searchRoute from "./routes/search.js";
import adminRoute from "./routes/admin.js";
import notificationsRoute from "./routes/notifications.js";

const app = express();

// Middleware configuration
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(express.json());
app.use(performanceMonitor); // 性能监控中间件

// JWT authentication middleware
// All requests need to be authorized by the token except for login, creating user and accessing files
app.use(expressjwt({ 
    secret: process.env.JWT_KEY, 
    algorithms: ['HS256'] 
}).unless({ 
    path: [
        /^\/login/, 
        /^\/createuser/, 
        /^\/uploads/, 
        /^\/img/,
        /^\/api\/search\/trends/ // Allow public access to trending topics
    ] 
}));

// Static file serving
app.use('/uploads', express.static('uploads'));
app.use('/img', express.static('img'));

// Route configuration with API versioning
const API_PREFIX = '/api';

// Existing routes (maintain backward compatibility)
app.use("/server/conversations", conversationRoute);
app.use("/server/messages", messageRoute);
app.use("/login", loginRoute);
app.use('/createuser', registerRoute);
app.use('/changepwd', changepwdRoute);
app.use('/profile', profileRoute);
app.use('/followinfo', followinfoRoute);
app.use('/interaction', interactionRoute);
app.use('/cache', cacheRoute); // 缓存管理接口（仅管理员可访问）

// New modularized API routes
app.use(`${API_PREFIX}/users`, usersRoute);
app.use(`${API_PREFIX}/tweets`, tweetsRoute);
app.use(`${API_PREFIX}/tags`, tagsRoute);
app.use(`${API_PREFIX}/search`, searchRoute);
app.use(`${API_PREFIX}/admin`, adminRoute);
app.use(`${API_PREFIX}/notifications`, notificationsRoute);

// Legacy route mappings for backward compatibility
// Map old routes to new API structure
app.get('/auser/:userId', (req, res) => {
    res.redirect(301, `${API_PREFIX}/users/${req.params.userId}`);
});

app.get('/tweets', (req, res) => {
    res.redirect(301, `${API_PREFIX}/tweets`);
});

app.get('/users', (req, res) => {
    res.redirect(301, `${API_PREFIX}/users`);
});

app.get('/users/:username', (req, res) => {
    res.redirect(301, `${API_PREFIX}/users/recommended/${req.params.username}`);
});

app.get('/tweets/:username', (req, res) => {
    res.redirect(301, `${API_PREFIX}/tweets/user/${req.params.username}`);
});

app.post('/new-tweet', (req, res) => {
    res.redirect(307, `${API_PREFIX}/tweets`);
});

app.get('/tags', (req, res) => {
    res.redirect(301, `${API_PREFIX}/tags`);
});

app.get('/tag/:tagname', (req, res) => {
    res.redirect(301, `${API_PREFIX}/tags/${req.params.tagname}`);
});

app.post('/new-tag', (req, res) => {
    res.redirect(307, `${API_PREFIX}/tags`);
});

app.get('/searchuser/:currentUser/:searchUsername', (req, res) => {
    res.redirect(301, `${API_PREFIX}/search/users/${req.params.currentUser}/${req.params.searchUsername}`);
});

app.get('/notification/:username', (req, res) => {
    res.redirect(301, `${API_PREFIX}/notifications/${req.params.username}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Invalid token' });
        console.log('Unauthorized access attempt:', err);
    } else {
        console.error('Unhandled error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Debug middleware (remove in production)
app.use((req, res, next) => {
    console.log("Authentication info:", req.auth);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
    res.json({
        message: 'CSCI3100 Social Media API',
        version: '2.0.0',
        endpoints: {
            users: `${API_PREFIX}/users`,
            tweets: `${API_PREFIX}/tweets`,
            tags: `${API_PREFIX}/tags`,
            search: `${API_PREFIX}/search`,
            notifications: `${API_PREFIX}/notifications`,
            admin: `${API_PREFIX}/admin`
        },
        legacy_endpoints: 'Still supported but deprecated. Use /api/* endpoints instead.'
    });
});

// Connect to MongoDB
const url = process.env.MONGO_URI;
console.log("Connecting to MongoDB...", url);
mongoose.connect(url)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    });

// Create HTTP server
const server = createServer(app);

/* -------------------------------------------------------------- */
/* ------------------------ Socket.IO Setup ------------------- */
/* -------------------------------------------------------------- */

const io = new SocketIOServer(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },    
});

// Socket.IO user management
let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

// Socket.IO event handlers
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
        console.log(`User ${userId} added to active users`);
    });

    // Send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        try {
            const user = getUser(receiverId);
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    senderId,
                    text,
                });
                console.log(`Message sent from ${senderId} to ${receiverId}`);
            } else {
                console.log(`User ${receiverId} not found in active users`);
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

    // Handle typing indicators
    socket.on("typing", ({ senderId, receiverId }) => {
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("userTyping", { senderId });
        }
    });

    socket.on("stopTyping", ({ senderId, receiverId }) => {
        const user = getUser(receiverId);
        if (user) {
            io.to(user.socketId).emit("userStoppedTyping", { senderId });
        }
    });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on Port ${PORT}`);
    console.log(`📚 API Documentation available at http://localhost:${PORT}/api/docs`);
    console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
});

export default app;
