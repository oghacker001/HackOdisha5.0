import express from 'express';
import { authMiddleware, organizerOrAdmin } from '../middleware/auth.js';
import { createCampaign, deleteCampaign, getCampaignById, getCampaigns, updateCampaign } from '../controllers/campaignController.js';
const router=express.Router();

router.get('/',authMiddleware,getCampaigns);
router.get('/:id',authMiddleware,getCampaignById);

router.post('/',authMiddleware,organizerOrAdmin,createCampaign);
router.put('/:id',authMiddleware,organizerOrAdmin,updateCampaign);
router.delete('/:id',authMiddleware,organizerOrAdmin,deleteCampaign);

export default router;