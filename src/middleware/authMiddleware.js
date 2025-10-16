// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc Middleware to protect routes and verify JWT
const protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: Bearer <token>)
            token = req.headers.authorization.split(' ')[1];
            
            // 2. Verify token using your JWT_SECRET
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Attach userId to the request for controller access
            req.userId = decoded.id; 

            next(); // Go to the next middleware or controller function
        } catch (error) {
            console.error('JWT Token Verification Error:', error);
            return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired.' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' });
    }
};

// Yahan se function ko export kiya ja raha hai, jo Express ko zaroori hai.
exports.protect = protect;
