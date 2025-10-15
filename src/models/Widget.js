// /src/models/Widget.js

const mongoose = require('mongoose');

const WidgetSchema = new mongoose.Schema({
    // یہ ویجیٹ کس فیڈ کا ڈیٹا دکھائے گا
    feedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feed',
        required: true,
    },
    // وہ صارف جو اس ویجیٹ کا مالک ہے
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // ویجیٹ کا ایک منفرد ID جو URL میں استعمال ہوگا
    widgetKey: {
        type: String,
        required: true,
        unique: true,
    },
    // ویجیٹ ڈسپلے کے لیے سیٹنگز (جیسے RSS.app میں ہوتا ہے)
    settings: {
        theme: { type: String, default: 'light' },
        layout: { type: String, default: 'list' }, // list, card, slider
        maxItems: { type: Number, default: 5 },
        showDate: { type: Boolean, default: true },
        // ... مزید ڈیزائن سیٹنگز یہاں شامل کر سکتے ہیں
    },
    // فلٹرنگ (Advanced: صرف مخصوص کی ورڈ والے آرٹیکلز دکھائیں)
    keywordsFilter: [String],
    
    // سیکیورٹی کے لیے، اسے فعال (Active) ہونا چاہیے
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Widget', WidgetSchema);
