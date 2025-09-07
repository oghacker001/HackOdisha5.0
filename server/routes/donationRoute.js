import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { createDonation, deleteDonation, getDonationStats, getUserDonations } from '../controllers/donationController.js';

const router = express.Router();

router.post('/', authMiddleware, createDonation);
router.get('/my', authMiddleware, getUserDonations);
router.get('/stats', authMiddleware, getDonationStats);
router.delete('/:id', authMiddleware, deleteDonation);

export default router;
