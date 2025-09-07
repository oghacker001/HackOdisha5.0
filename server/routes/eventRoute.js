import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { authMiddleware, organizerOrAdmin } from '../middleware/auth.js';
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';
const eventRouter = express.Router();

eventRouter.get('/', authMiddleware, getEvents);
eventRouter.get('/:id', authMiddleware, getEventById);
eventRouter.post('/', authMiddleware, organizerOrAdmin, upload.single('image'), createEvent);
eventRouter.put('/:id', authMiddleware, organizerOrAdmin, upload.single('image'), updateEvent);
eventRouter.delete('/:id', authMiddleware, organizerOrAdmin, deleteEvent);

export default eventRouter;