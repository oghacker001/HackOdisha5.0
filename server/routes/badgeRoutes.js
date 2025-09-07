import express from 'express';
import { getLeaderboard, getTopDonors, getUserRank } from '../controllers/badgeController.js';
import { authMiddleware } from '../middleware/auth.js';


const router= express.Router();

router.get('/top',getTopDonors);
router.get('/leaderboard',getLeaderboard);
router.get('/rank/:userId',getUserRank);
router.get('/my-rank',authMiddleware,getUserRank);

export default router;