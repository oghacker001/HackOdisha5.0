import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { authMiddleware, organizerOrAdmin } from '../middleware/auth.js';
import { createUpdate, getCampaignUpdates } from '../controllers/updateController.js';
const updateRouter = express.Router();

updateRouter.post('/:campaignId', authMiddleware, organizerOrAdmin, upload.array('updatePhotos', 5), createUpdate);
updateRouter.get('/:campaignId', authMiddleware, getCampaignUpdates);

export default updateRouter;