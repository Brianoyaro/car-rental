const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const {username, email, password, idNumber, phoneNumber } = req.body;

        const existingUser = User.find({email});
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const newUser = new User({username, email, password: hashed, idNumber, phoneNumber})
        await newUser.save;

        const token = generateToken(newUser);
        res.status(201).json({ user: newUser, token });
    } catch (error) {
        res.status(500).json({message: "Registration failed", error: error.message});
    }
    
}

// user login
exports.loginUser = async (req,res)=>{
    try {
        const {email, password}=req.body;
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({message:"invalid email"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message:"Incorrect password"})
        }

        const token = generateToken(user);

        res.status(200).json({message:"login success", token })      
    } catch (err) {
        res.status(500).json({message:"Login failed", error: err.message})
    };
};


// logout
exports.logoutUser = async (req,res) =>{
   try {
        
   } catch (error) {
    
   }
}