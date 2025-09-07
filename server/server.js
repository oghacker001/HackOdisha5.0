import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { Server } from "socket.io";
import http from 'http';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// --- Core Imports (Must be at the top) ---
import connectDB from './config/mongodb.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { authMiddleware, organizerOrAdmin } from './middleware/auth.js';
import { responseMiddleware } from './middleware/responseMiddleware.js';
import { upload } from './middleware/uploadMiddleware.js';
import { configurePassport } from './config/passport.js';

// --- Import All Your Models (Must come after Mongoose is imported) ---
import User from './models/userModels.js';
import Campaign from './models/Campaign.js';
import Event from './models/event.js';
import Comment from './models/comment.js';
import Donation from './models/donation.js';
import Update from './models/update.js';

// --- Import All Your Controllers ---
import { createCampaign, updateCampaign, deleteCampaign, listMyCampaigns, updateProfile as updateOrganizerProfile, deleteMyAccount as deleteOrganizerAccount, getProfile as getOrganizerProfile } from './controllers/organizerController.js';
import { getCampaigns, getCampaignById } from './controllers/campaignController.js';
import { Login, Logout, Register } from './controllers/authController.js';
import { createDonation, deleteDonation, getDonationStats, getUserDonations } from './controllers/donationController.js';
import { searchAll } from './controllers/searchController.js';
import { listCampaigns, approveCampaign, rejectCampaign, listOrganizers, suspendOrganizer, listEvents, approveEvent, rejectEvent, deleteCampaign as deleteAdminCampaign, deleteEvent as deleteAdminEvent, deleteUserAccount, deleteComment, getDashboardStats } from './controllers/adminController.js';
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent } from './controllers/eventController.js';
import { getProfile, updateProfile, getUserDonations as getUserProfileDonations, deleteAccount, uploadProfilePhoto, getProfilePhoto } from './controllers/userProfileController.js';
import { getTopDonors, getLeaderboard, getUserRank } from './controllers/badgeController.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 4000;

// Connect to the database
connectDB();

// =========================================================================
//                             MIDDLEWARE SETUP
// =========================================================================
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' },
}));

configurePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use(responseMiddleware);

// =========================================================================
//                             API ENDPOINTS (ROUTES)
// =========================================================================
// --- Auth Routes ---
const authRouter = express.Router();
authRouter.post('/register', Register);
authRouter.post('/login', Login);
authRouter.post('/logout', Logout);
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    res.json({ success: true, user: req.user });
});
app.use('/api/auth', authRouter);

// --- Public Routes ---
const searchRouter = express.Router();
searchRouter.get('/', searchAll);
app.use('/api/search', searchRouter);

const campaignRouter = express.Router();
campaignRouter.get('/', getCampaigns);
campaignRouter.get('/:id', getCampaignById);
app.use('/api/campaigns', campaignRouter);

const eventRouter = express.Router();
eventRouter.get('/', getEvents);
eventRouter.get('/:id', getEventById);
app.use('/api/events', eventRouter);

// --- New Badge Routes ---
const badgeRouter = express.Router();
badgeRouter.get('/top', getTopDonors);
badgeRouter.get('/leaderboard', getLeaderboard);
badgeRouter.get('/rank/:userId', getUserRank);
badgeRouter.get('/my-rank', authMiddleware, getUserRank);
app.use('/api/badges', badgeRouter);

// --- Authenticated & Role-based Routes ---
const organizerRouter = express.Router();
organizerRouter.use(authMiddleware, organizerOrAdmin);
organizerRouter.get('/campaigns', listMyCampaigns);
organizerRouter.post('/campaigns', upload.array('images', 5), createCampaign);
organizerRouter.put('/campaigns/:campaignId', upload.array('images', 5), updateCampaign);
organizerRouter.delete('/campaigns/:campaignId', deleteCampaign);
organizerRouter.get('/events', listEvents);
organizerRouter.post('/events', upload.single('image'), createEvent);
organizerRouter.put('/events/:id', upload.single('image'), updateEvent);
organizerRouter.delete('/events/:id', deleteEvent);
app.use('/api/organizer', organizerRouter);

const adminRouter = express.Router();
adminRouter.use(authMiddleware, organizerOrAdmin);
adminRouter.get("/dashboard-stats", getDashboardStats);
adminRouter.get("/campaigns", listCampaigns);
adminRouter.put("/campaigns/:campaignId/approve", approveCampaign);
adminRouter.put("/campaigns/:campaignId/reject", rejectCampaign);
adminRouter.delete("/campaigns/:campaignId", deleteAdminCampaign);
adminRouter.get("/organizers", listOrganizers);
adminRouter.put("/organizers/:organizerId/suspend", suspendOrganizer);
adminRouter.get("/events", listEvents);
adminRouter.put("/events/:eventId/approve", approveEvent);
adminRouter.put("/events/:eventId/reject", rejectEvent);
adminRouter.delete("/events/:eventId", deleteAdminEvent);
adminRouter.delete("/users/:userId", deleteUserAccount);
adminRouter.delete("/comments/:commentId", deleteComment);
app.use('/api/admin', adminRouter);

const donationRouter = express.Router();
donationRouter.post('/', authMiddleware, createDonation);
donationRouter.get('/my', authMiddleware, getUserDonations);
donationRouter.get('/stats', authMiddleware, getDonationStats);
donationRouter.delete('/:id', authMiddleware, deleteDonation);
app.use('/api/donations', donationRouter);

const userProfileRouter = express.Router();
userProfileRouter.get('/profile', authMiddleware, getProfile);
userProfileRouter.put('/profile', authMiddleware, updateProfile);
userProfileRouter.post('/profile-photo', authMiddleware, upload.single('profilePhoto'), uploadProfilePhoto);
userProfileRouter.get('/donations', authMiddleware, getUserProfileDonations);
userProfileRouter.delete('/account', authMiddleware, deleteAccount);
userProfileRouter.get('/:id/photo', getProfilePhoto);
app.use('/api/users', userProfileRouter);

// --- Image Serving ---
let gfs;
mongoose.connection.once("open", () => {
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    app.get("/image/:filename", async (req, res) => {
        const filename = req.params.filename;
        const cachedImage = getCache(filename);
        if (cachedImage) return res.writeHead(200, { "Content-Type": "image/jpeg", "Content-Length": cachedImage.length }).end(cachedImage);
        const files = await gfs.find({ filename }).toArray();
        if (!files || files.length === 0) return res.status(404).send("No file found");
        const readstream = gfs.openDownloadStreamByName(filename);
        readstream.pipe(res);
    });
});

app.get("/", (req, res) => res.send("API is working."));
io.on("connection", (socket) => console.log("User connected"));

app.use(notFound);
app.use(errorHandler);

server.listen(port, () => console.log(`Server started on port ${port}`));