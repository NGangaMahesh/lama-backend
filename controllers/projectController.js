
import userModel from '../models/userModels.js'

const addProject = async (req, res) => {
    try {
        const { name, userId } = req.body;
        let userData = await userModel.findById(userId);
        
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Ensure projectData is an array
        let updatedProjectData = Array.isArray(userData.projectData) ? userData.projectData : [];
        updatedProjectData.push({
            name,
            episodes: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        // Save the updated projectData to the user document
        await userModel.findByIdAndUpdate(userId, { projectData: updatedProjectData });

        // Get the newly added project from userData
        const newProject = updatedProjectData[updatedProjectData.length - 1];

        // Return the _id of the newly added project
        res.status(201).json({ message: 'Project added successfully', projectId: newProject._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};




const getProjects = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const projectList = (user.projectData || []).map((project) => ({
            id: project._id,
            name: project.name,
            episodes: project.episodes ? project.episodes.length : 0,
            updatedAt: project.updatedAt,
        }));

        res.status(200).json(projectList);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export {addProject, getProjects}