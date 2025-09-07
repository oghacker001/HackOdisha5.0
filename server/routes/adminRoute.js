import express from 'express';
import {
  listCampaigns, approveCampaign, rejectCampaign,
  listOrganizers, suspendOrganizer,
  listEvents, approveEvent, rejectEvent,
  deleteCampaign, deleteEvent,
  deleteUserAccount, deleteComment,
  getDashboardStats,
} from '../controllers/adminController.js';
const adminRouter = express.Router();
adminRouter.get("/dashboard-stats", getDashboardStats);
adminRouter.get("/campaigns", listCampaigns);
adminRouter.put("/campaigns/:campaignId/approve", approveCampaign);
adminRouter.put("/campaigns/:campaignId/reject", rejectCampaign);
adminRouter.delete("/campaigns/:campaignId", deleteCampaign);
adminRouter.get("/organizers", listOrganizers);
adminRouter.put("/organizers/:organizerId/suspend", suspendOrganizer);
adminRouter.get("/events", listEvents);
adminRouter.put("/events/:eventId/approve", approveEvent);
adminRouter.put("/events/:eventId/reject", rejectEvent);
adminRouter.delete("/events/:eventId", deleteEvent);
adminRouter.delete("/users/:userId", deleteUserAccount);
adminRouter.delete("/comments/:commentId", deleteComment);
export default adminRouter;