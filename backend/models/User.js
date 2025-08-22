const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phoneNumber: String,
    idNumber: String,
    role: { 
        type: String, 
        enum: ['admin', 'user',],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
