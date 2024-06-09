import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    projectData: [{
        ProjectId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        episodes: [{
            name: {
                type: String,
                required: true
            },
            link: {
                type: String,
                required: true
            },
            transcript: {
                type: String,
                default: ''
            },
            status: {
                type: String,
                default: 'Pending'
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { minimize: false });

const userModel = model("User", userSchema);

export default userModel;
