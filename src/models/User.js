// /src/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // ہم صرف ایک ڈمی یوزر بنائیں گے
    username: {
        type: String,
        required: true,
        unique: true
    },
    // حقیقی پراجیکٹ میں یہاں password اور email ہوں گے
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
