// /src/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // چیک کریں کہ ہیڈرز میں 'Bearer' ٹوکن موجود ہے یا نہیں
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // ٹوکن نکالیں (مثلاً "Bearer asd34sd...")
            token = req.headers.authorization.split(' ')[1];

            // ٹوکن کی تصدیق کریں اور یوزر ID نکالیں
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // یوزر کو ID کی بنیاد پر ڈیٹا بیس سے نکالیں (پاسورڈ کے بغیر)
            req.user = await User.findById(decoded.id).select('-password');
            
            // اگلے مڈل ویئر یا کنٹرولر پر جائیں
            next();

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token.' });
    }
};

module.exports = { protect };
