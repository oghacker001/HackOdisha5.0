import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js'; // Use your GridFS upload
import { deleteAccount, getProfile, getProfilePhoto, getUserDonations, updateProfile, uploadProfilePhoto } from '../controllers/userProfileController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/profile/photo', authMiddleware, upload.single('profilePhoto'), uploadProfilePhoto);
router.get('/donations', authMiddleware, getUserDonations);
router.delete('/account', authMiddleware, deleteAccount);
router.get('/:id/photo', getProfilePhoto);

export default router;
