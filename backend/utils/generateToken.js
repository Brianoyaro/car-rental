const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.generateToken = (user) => {
    try {
        return jwt.sign({ id:user._id, role: user.role, name: user.name }, JWT_SECRET, {expiresIn:"1h"});
    } catch (error) {
        return error.message;
    }
}

