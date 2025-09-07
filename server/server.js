import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { Server } from 'socket.io';
import http from 'http';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// --- Configuration imports ---
import connectDB from './config/mongodb.js';
import { getCache } from './config/cache.js';
import { configurePassport } from './config/passport.js';

// --- Middleware imports ---
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { responseMiddleware } from './middleware/responseMiddleware.js';
import { authMiddleware, organizerOrAdmin } from './middleware/auth.js';
import { upload } from './middleware/uploadMiddleware.js';

// --- Route imports ---
import authRouter from './routes/authRoute.js';
import searchRouter from './routes/searchRoute.js';
import campaignRouter from './routes/campaignRoute.js';
import eventRouter from './routes/eventRoute.js';
import badgeRouter from './routes/badgeRoute.js';
import organizerRouter from './routes/organizerRoute.js';
import adminRouter from './routes/adminRoute.js';
import donationRouter from './routes/donationRoute.js';
import userProfileRouter from './routes/userProfileRoute.js';
import commentRouter from './routes/commentRoute.js';
import updateRouter from './routes/updateRoute.js';

// --- App initialization ---
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

// Socket.IO configuration
const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' 
            ? process.env.FRONTEND_URL 
            : "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// --- Database connection ---
connectDB();

// --- Middleware configuration ---

// Body parsing middleware
app.use(express.json({ 
    limit: '50mb',
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
app.use(express.urlencoded({ 
    extended: true, 
    limit: '50mb' 
}));

// Cookie parsing
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (process.env.NODE_ENV === 'production') {
            const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [];
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        } else {
            callback(null, true);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // Corrected variable name
        touchAfter: 24 * 3600
    }),
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Passport configuration
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Custom middleware
app.use(responseMiddleware);

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
        next();
    });
}

// --- Health Check Routes ---
app.get('/', (req, res) => {
    res.json({ 
        message: "Crowdfunding Platform API", 
        version: "2.0.0",
        status: "Active",
        timestamp: new Date().toISOString()
    });
});

app.get('/health', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
        
        res.json({ 
            status: "OK", 
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime()),
            database: dbStatus,
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
            }
        });
    } catch (error) {
        res.status(503).json({
            status: "ERROR",
            message: error.message
        });
    }
});

// --- API ROUTES ---
// Public routes (no authentication required)
app.use('/api/auth', authRouter);
app.use('/api/search', searchRouter);
app.use('/api/campaigns', campaignRouter);
app.use('/api/events', eventRouter);
app.use('/api/badges', badgeRouter);

// Protected routes (authentication may be required)
app.use('/api/organizer', organizerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/donations', donationRouter);
app.use('/api/users', userProfileRouter);
app.use('/api/comments', commentRouter);
app.use('/api/updates', updateRouter);

// --- FILE SERVING (GridFS) ---
let gfs;

const initializeGridFS = () => {
    if (mongoose.connection.readyState === 1) {
        gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { 
            bucketName: "uploads" 
        });
        
        setupFileRoutes();
        console.log('✅ GridFS initialized');
    } else {
        mongoose.connection.once('open', () => {
            gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { 
                bucketName: "uploads" 
            });
            setupFileRoutes();
            console.log('✅ GridFS initialized');
        });
    }
};

const setupFileRoutes = () => {
    app.get('/api/image/:filename', async (req, res) => {
        try {
            const { filename } = req.params;
            
            if (!filename || typeof filename !== 'string') {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid filename" 
                });
            }
            
            const cachedImage = getCache(filename);
            if (cachedImage) {
                return res.writeHead(200, { 
                    "Content-Type": "image/jpeg", 
                    "Content-Length": cachedImage.length,
                    "Cache-Control": "public, max-age=86400",
                    "ETag": `"${filename}"`
                }).end(cachedImage);
            }
            
            const files = await gfs.find({ filename }).toArray();
            if (!files || files.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: "File not found" 
                });
            }
            
            const file = files[0];
            const contentType = file.contentType || 'image/jpeg';
            
            res.set({
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
                'ETag': `"${filename}"`,
                'Content-Length': file.length
            });
            
            if (req.headers['if-none-match'] === `"${filename}"`) {
                return res.status(304).end();
            }
            
            const readstream = gfs.openDownloadStreamByName(filename);
            
            readstream.on('error', (err) => {
                console.error('GridFS read error:', err);
                if (!res.headersSent) {
                    res.status(404).json({ 
                        success: false, 
                        message: "Error reading file" 
                    });
                }
            });
            
            readstream.pipe(res);
            
        } catch (error) {
            console.error('Image serving error:', error);
            if (!res.headersSent) {
                res.status(500).json({ 
                    success: false, 
                    message: "Internal server error" 
                });
            }
        }
    });
};

initializeGridFS();

// --- SOCKET.IO CONFIGURATION ---
const configureSocketIO = () => {
    io.on('connection', (socket) => {
        console.log(`🔌 User connected: ${socket.id}`);
        
        socket.on('join-campaign', (campaignId) => {
            if (campaignId && typeof campaignId === 'string') {
                socket.join(`campaign-${campaignId}`);
                console.log(`📢 User ${socket.id} joined campaign ${campaignId}`);
                
                socket.emit('joined-campaign', { campaignId, success: true });
            } else {
                socket.emit('error', { message: 'Invalid campaign ID' });
            }
        });
        
        socket.on('leave-campaign', (campaignId) => {
            if (campaignId && typeof campaignId === 'string') {
                socket.leave(`campaign-${campaignId}`);
                console.log(`👋 User ${socket.id} left campaign ${campaignId}`);
            }
        });
        
        socket.on('donation-update', (data) => {
            if (data.campaignId) {
                socket.to(`campaign-${data.campaignId}`).emit('donation-received', data);
            }
        });
        
        socket.on('campaign-update', (data) => {
            if (data.campaignId) {
                socket.to(`campaign-${data.campaignId}`).emit('campaign-updated', data);
            }
        });
        
        socket.on('disconnect', (reason) => {
            console.log(`❌ User disconnected: ${socket.id}, reason: ${reason}`);
        });
        
        socket.on('error', (error) => {
            console.error(`Socket error for ${socket.id}:`, error);
        });
    });
    
    app.set('io', io);
};

configureSocketIO();

// --- ERROR HANDLING ---
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    if (process.env.NODE_ENV === 'production') {
        server.close(() => {
            process.exit(1);
        });
    }
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('💤 Database connection closed.');
            process.exit(0);
        });
    });
});

app.use(notFound);
app.use(errorHandler);

// --- SERVER STARTUP ---
server.listen(port, () => {
    console.log('='.repeat(50));
    console.log('🚀 SERVER STARTED SUCCESSFULLY');
    console.log('='.repeat(50));
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Server URL: http://localhost:${port}`);
    console.log(`💾 Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Connecting...'}`);
    console.log(`🌐 CORS: ${process.env.NODE_ENV === 'production' ? 'Production Mode' : 'Development Mode'}`);
    console.log('='.repeat(50));
});

export default app;