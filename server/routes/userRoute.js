import express from 'express';
import {upload} from '../middleware/multerMiddleware.js';
import { deleteAccount,  getProfile,   getProfilePhoto, getUserDonations, updateProfile, uploadProfilePhoto  } from '../controllers/userProfileController.js';
import { authMiddleware } from '../middleware/auth.js';
const router=express.Router();

router.get('/user',authMiddleware,getProfile);
router.put('/user',authMiddleware,updateProfile);
router.post('/user/photo',authMiddleware,upload.single('profileImage'),uploadProfilePhoto);
router.get('/user/donations',authMiddleware,getUserDonations);
router.delete('/user',authMiddleware,deleteAccount);
//public endpoint to get user profiled photo by user id
router.get('/:id/photo',getProfilePhoto);
export default router;