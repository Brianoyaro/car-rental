const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phoneNumber: String,
    idNumber: String,
    roles: [{ 
        type: String, 
        enum: ['admin', 'user',],
        default: 'user'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

model.exports = mongoose.model('User', userSchema);
