// src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🧠 Middleware: Protect routes using JWT
const authMiddleware = async (req, res, next) => {
    let token;

    // 1. Token check in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Attach user ID to request
            req.userId = decoded.id;

            // Optional: You can also verify if the user still exists
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({ success: false, message: 'User no longer exists.' });
            }

            // Proceed
            next();
        } catch (error) {
            console.error('JWT Verification Error:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token invalid or expired.'
            });
        }
    }

    // 4. If no token found
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, token missing.'
        });
    }
};

// ✅ Export correctly for Express routes
module.exports = authMiddleware;
    
