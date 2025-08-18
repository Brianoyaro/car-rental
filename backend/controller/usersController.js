const User = require('../models/User');


// get all users
exports.getAllUsers = async (req,res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message:"Error in fetching users", error: error.message});
    }
}

exports.getUserProfile = async (req,res) => {
    try {
        const profile = await User.findById(req.params.id);

        if(!profile){
            return res.status(404).json({message:"user profile not found"});
        }

        req.status(200).json(profile)
    } catch (error) {
        res.status(500).json({message:"Internal server error", error: error.message});
    }
}

exports.updateUserProfile = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}