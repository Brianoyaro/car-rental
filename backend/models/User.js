const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    phoneNumber: String,
    idNumber: String,
    roles: [{ 
        type: String, 
        enum: ['admin', 'user',]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

model.exports = mongoose.model('User', userSchema);
