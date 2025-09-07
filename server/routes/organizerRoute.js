import express from 'express';
import { upload } from "../middleware/uploadMiddleware.js";
import { authMiddleware, organizerOrAdmin } from '../middleware/auth.js';
import {
    createCampaign, updateCampaign, deleteCampaign, listMyCampaigns,
    createEvent, updateEvent, deleteEvent, listMyEvents,
    updateProfile, deleteMyAccount, getProfile,
    createUpdate, getCampaignUpdates
} from '../controllers/organizerController.js';

const organizerRouter = express.Router();

organizerRouter.use(authMiddleware, organizerOrAdmin);

// Campaign Routes
organizerRouter.get("/campaigns", listMyCampaigns);
organizerRouter.post("/campaigns", upload.fields([{ name: 'images', maxCount: 5 }, { name: 'validation_docs', maxCount: 3 }]), createCampaign);
organizerRouter.put("/campaigns/:campaignId", upload.fields([{ name: 'images', maxCount: 5 }, { name: 'validation_docs', maxCount: 3 }]), updateCampaign);
organizerRouter.delete("/campaigns/:campaignId", deleteCampaign);

// Event Routes
organizerRouter.get("/events", listMyEvents);
organizerRouter.post("/events", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'validation_doc', maxCount: 1 }]), createEvent);
organizerRouter.put("/events/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'validation_doc', maxCount: 1 }]), updateEvent);
organizerRouter.delete("/events/:id", deleteEvent);

// Profile Management
organizerRouter.get("/profile", getProfile);
organizerRouter.put("/profile", upload.single("profilePhoto"), updateProfile);
organizerRouter.delete("/account", deleteMyAccount);

// Campaign Updates
organizerRouter.post('/updates/:campaignId', upload.array('updatePhotos', 5), createUpdate);
organizerRouter.get('/updates/:campaignId', getCampaignUpdates);

export default organizerRouter;