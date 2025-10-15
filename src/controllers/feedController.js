// /src/controllers/feedController.js
// ... (پچھلے Imports)
const Feed = require('../models/Feed'); 
const Article = require('../models/Article');
// User کی ضرورت نہیں کیونکہ req.user سے ID مل جائے گی

// ... (exports.addFeed پہلے سے موجود ہے، صرف ownerId کو اپ ڈیٹ کریں)

exports.addFeed = async (req, res) => {
    const { url } = req.body;
    const ownerId = req.user._id; // <-- اب ID ٹوکن سے ملی ہے!

    // ... (باقی لاجک وہی رہے گی)
    // newFeed بناتے وقت: ownerId: ownerId, استعمال ہوگا
    // ...
};


// -------------------
// 1. صارف کی تمام فیڈز حاصل کرنا
// -------------------
exports.getFeeds = async (req, res) => {
    try {
        // صرف لاگ ان یوزر کی فیڈز تلاش کریں
        const feeds = await Feed.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, feeds });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feeds.' });
    }
};


// -------------------
// 2. مخصوص فیڈ اور اس کے آرٹیکلز حاصل کرنا
// -------------------
exports.getFeedArticles = async (req, res) => {
    const { feedId } = req.params;
    const ownerId = req.user._id;

    try {
        // چیک کریں کہ آیا یہ فیڈ اسی یوزر کی ملکیت ہے
        const feed = await Feed.findOne({ _id: feedId, ownerId });

        if (!feed) {
            return res.status(404).json({ message: 'Feed not found or access denied.' });
        }

        // فیڈ کے آرٹیکلز تلاش کریں
        const articles = await Article.find({ feedId })
            .sort({ pubDate: -1 })
            .limit(50) // حد مقرر کریں
            .select('title link pubDate contentSnippet');

        res.json({ success: true, feed: feed, articles: articles });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching articles.' });
    }
};


// -------------------
// 3. فیڈ ڈیلیٹ کرنا
// -------------------
exports.deleteFeed = async (req, res) => {
    const { id } = req.params;

    try {
        // فیڈ تلاش کریں اور چیک کریں کہ کیا یوزر اس کا مالک ہے
        const feed = await Feed.findOne({ _id: id, ownerId: req.user._id });

        if (!feed) {
            return res.status(404).json({ message: 'Feed not found or access denied.' });
        }

        // فیڈ اور اس سے جڑے تمام آرٹیکلز ڈیلیٹ کریں
        await feed.deleteOne(); // Mongoose delete method
        await Article.deleteMany({ feedId: id });

        res.json({ success: true, message: 'Feed and associated articles deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feed.' });
    }
};
