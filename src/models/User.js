// /src/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // bcrypt امپورٹ کریں

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: { // ای میل کو بھی شامل کریں
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { // پاسورڈ فیلڈ
        type: String,
        required: true
    },
    // پریمیم خصوصیات کو سنبھالنے کے لیے (Advanced Feature)
    plan: {
        type: String,
        enum: ['free', 'pro', 'business'],
        default: 'free'
    }
}, { timestamps: true });

// Mongoose Pre-Save Hook: پاسورڈ محفوظ کرنے سے پہلے ہیش (hash) کریں
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// یوزر کا طریقہ کار: پاسورڈ کی تصدیق
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
