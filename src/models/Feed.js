// /src/models/Feed.js

const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema({
    // وہ صارف جس نے فیڈ شامل کیا (بعد میں User ID سے جڑے گا)
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        // اگر آپ نے User ماڈل بنا لیا ہے تو 'User' استعمال کریں
        // ref: 'User', 
        required: true, 
    },
    // فیڈ کا اصل URL
    url: {
        type: String,
        required: true,
        unique: true, // ایک ہی URL دو بار شامل نہیں ہو سکتا
    },
    // ویب سائٹ سے حاصل کردہ ٹائٹل
    title: {
        type: String,
        required: true,
    },
    // آخری بار کب اپ ڈیٹ کیا گیا
    lastFetched: {
        type: Date,
        default: Date.now,
    },
    // فیڈ کو کتنی دیر بعد ریفریش کرنا ہے (Advanced Feature)
    refreshRate: {
        type: Number, 
        default: 3600000, // 1 گھنٹہ ملی سیکنڈز میں
    },
    // کیا یہ پبلک طور پر ویجیٹ کے طور پر استعمال ہو سکتا ہے؟
    isPublic: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // خودکار طور پر createdAt اور updatedAt فیلڈز شامل کرتا ہے

module.exports = mongoose.model('Feed', FeedSchema);
