import { v4 as uuidv4 } from 'uuid';
import userModel from '../models/userModels.js';


const addEpisode = async (req, res) => {
    try {
        const { name, link, projectId, userId } = req.body;

        // Step 1: Retrieve the User Document
        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Locate the Project
        const project = userData.projectData.find((proj) => proj._id.toString() === projectId.toString());

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Step 3: Check for duplicate episode name or link
        const isDuplicateEpisode = project.episodes.some(
            (episode) => episode.name === name || episode.link === link
        );

        if (isDuplicateEpisode) {
            return res.status(400).json({ message: 'Duplicate episode name or link' });
        }

        // Ensure project.episodes is an array
        const updatedEpisodes = Array.isArray(project.episodes) ? project.episodes : [];

        const episodeId = uuidv4();
        const newEpisode = {
            episodeId,
            name,
            link,
            transcript: '',
            status: 'Pending',
            timestamp: Date.now()
        };

        // Step 4: Add Episode to Project
        updatedEpisodes.push(newEpisode);

        // Save the updated episodes array to the project document
        const updatedProjectData = userData.projectData.map((proj) => {
            if (proj._id.toString() === projectId.toString()) {
                return {
                    ...proj._doc,
                    episodes: updatedEpisodes
                };
            }
            return proj;
        });

        // Step 5: Save User Document
        await userModel.findByIdAndUpdate(userId, { projectData: updatedProjectData });

        // Return the episodeId in the response
        res.status(201).json({ message: 'Episode added successfully', episodeId });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateTranscript = async (req, res) => {
    try {
        const { projectId, episodeId, userId, transcript } = req.body;

        // Step 1: Retrieve the User Document
        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Locate the Project
        const project = userData.projectData.find((proj) => proj._id.toString() === projectId.toString());

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Step 3: Locate the Episode
        const episode = project.episodes.find((ep) => ep.episodeId === episodeId);

        if (!episode) {
            return res.status(404).json({ message: 'Episode not found' });
        }

        // Step 4: Update the Transcript
        episode.transcript = transcript;

        // Step 5: Save User Document
        await userData.save();

        res.status(200).json({ message: 'Transcript updated successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getEpisodes = async (req, res) => {
    try {
        const { projectId, userId } = req.body;

        // Step 1: Retrieve the User Document
        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Locate the Project
        const project = userData.projectData.find((proj) => proj._id.toString() === projectId.toString());

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Step 3: Retrieve Episodes for the Project
        const episodes = project.episodes || [];

        res.status(200).json({ episodes });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteEpisode = async (req, res) => {
    try {
        const { projectId, episodeId, userId } = req.body;

        // Step 1: Retrieve the User Document
        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 2: Locate the Project
        const project = userData.projectData.find((proj) => proj._id.toString() === projectId.toString());

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Step 3: Locate the Episode Index
        const episodeIndex = project.episodes.findIndex((ep) => ep.episodeId === episodeId);

        if (episodeIndex === -1) {
            return res.status(404).json({ message: 'Episode not found' });
        }

        // Step 4: Remove the Episode from the Array
        project.episodes.splice(episodeIndex, 1);

        // Step 5: Save User Document
        await userData.save();

        res.status(200).json({ message: 'Episode deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



export { addEpisode, getEpisodes, updateTranscript, deleteEpisode};
