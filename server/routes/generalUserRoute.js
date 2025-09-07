import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getDashboardData } from '../controllers/generalUserController.js';
const generalUserRouter = express.Router();

generalUserRouter.get('/dashboard', authMiddleware, getDashboardData);

export default generalUserRouter;