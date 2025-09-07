
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { createDonation, deleteDonation, getDonationStats } from '../controllers/donationController.js';
import { getUserDonations } from '../controllers/userProfileController.js';

const router=express.Router();
router.post('/',authMiddleware,createDonation);
router.get('/',authMiddleware,getUserDonations);
router.get('/stats',authMiddleware,getDonationStats);
router.delete('/:id',authMiddleware,deleteDonation);

export default router;