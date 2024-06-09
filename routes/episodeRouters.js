import express from 'express';
import authMiddleware from '../middleware/auth.js'
import {addEpisode, getEpisodes, updateTranscript, deleteEpisode} from '../controllers/episodeController.js';

const episodeRouter = express.Router();

episodeRouter.get('/get', authMiddleware, getEpisodes);
episodeRouter.post('/add', authMiddleware, addEpisode);
episodeRouter.put('/updateTranscript', authMiddleware, updateTranscript);
episodeRouter.delete('/delete', authMiddleware, deleteEpisode);

export default episodeRouter;