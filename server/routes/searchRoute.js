import express from 'express';
import { searchAll } from '../controllers/searchController.js';

const searchRouter = express.Router();

searchRouter.get('/', searchAll);

export default searchRouter;