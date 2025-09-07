import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { createComment, getCampaignComments } from '../controllers/commentController.js';
const commentRouter = express.Router();

commentRouter.get('/:campaignId', getCampaignComments);
commentRouter.post('/:campaignId', authMiddleware, createComment);

export default commentRouter;