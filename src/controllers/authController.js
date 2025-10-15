// /src/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken'); // JWT امپورٹ کریں

// JWT ٹوکن بنانے کا فنکشن (JWT_SECRET انوائرمنٹ ویری ایبل میں ہونا چاہیے)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // 30 دن کی میعاد
    });
};

// -------------------
// 1. نیا یوزر رجسٹر کرنا
// -------------------
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // بنیادی توثیق (Basic validation)
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please enter all fields.' });
    }

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const user = await User.create({ username, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// -------------------
// 2. یوزر کو لاگ ان کرنا
// -------------------
exports.authUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // پاسورڈ کی توثیق کے لیے یوزر ماڈل میں بنایا گیا طریقہ کار استعمال کریں
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
