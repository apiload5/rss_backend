// /src/models/Article.js

const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    // یہ آرٹیکل کس فیڈ سے تعلق رکھتا ہے
    feedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feed', // Feed ماڈل سے جڑا ہوا
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        unique: true, // ہر آرٹیکل کا لنک منفرد ہونا چاہیے
    },
    contentSnippet: String,
    // اصل اشاعت کی تاریخ
    pubDate: {
        type: Date,
        default: Date.now,
    },
    // ویجیٹ میں دکھانے کے لیے اگر صارف نے کوئی کسٹم ٹیگ لگایا ہو (Advanced)
    customTags: [String], 
    
}, { timestamps: true });

// پرفارمنس کے لیے فیڈ اور پبلیکیشن ڈیٹ پر انڈیکس
ArticleSchema.index({ feedId: 1, pubDate: -1 });

module.exports = mongoose.model('Article', ArticleSchema);
