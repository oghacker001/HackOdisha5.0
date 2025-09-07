import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { authMiddleware, organizerOrAdmin } from '../middleware/auth.js';
import { createCampaign, getCampaigns, getCampaignById, updateCampaign, deleteCampaign } from '../controllers/campaignController.js';
const campaignRouter = express.Router();

campaignRouter.get('/', authMiddleware, getCampaigns);
campaignRouter.get('/:id', authMiddleware, getCampaignById);
campaignRouter.post('/', authMiddleware, organizerOrAdmin, upload.array('images', 5), createCampaign);
campaignRouter.put('/:id', authMiddleware, organizerOrAdmin, upload.array('images', 5), updateCampaign);
campaignRouter.delete('/:id', authMiddleware, organizerOrAdmin, deleteCampaign);

export default campaignRouter;