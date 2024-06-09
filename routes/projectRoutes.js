import express from 'express';
import authMiddleware from '../middleware/auth.js'
import {addProject, getProjects } from '../controllers/projectController.js';


const projectRouter = express.Router();

projectRouter.post('/add', authMiddleware, addProject)
projectRouter.get('/get', authMiddleware, getProjects);

export default projectRouter;