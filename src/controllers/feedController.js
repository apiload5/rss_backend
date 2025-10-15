// /src/controllers/feedController.js

const rssService = require('../services/rssService');

// فیڈ شامل کرنے کا ہینڈلر
exports.addFeed = async (req, res) => {
    const { url } = req.body; // ریکویسٹ باڈی سے فیڈ URL نکالیں

    if (!url) {
        return res.status(400).json({ success: false, message: 'Feed URL is required.' });
    }

    try {
        // RSS سروس کا استعمال کرتے ہوئے URL کو پارس کریں
        const feedData = await rssService.parseFeed(url);
        
        // یہاں، آپ کو اس feedData کو اپنے database (Models) میں محفوظ کرنا ہوگا 
        // اور اسے صارف کے اکاؤنٹ سے لنک کرنا ہوگا (جو ابھی ہم نے نہیں بنایا)

        // صرف ٹیسٹنگ کے لیے فی الحال پارس شدہ ڈیٹا واپس کر رہے ہیں
        res.status(200).json({ 
            success: true, 
            message: 'Feed parsed successfully. Database saving logic is pending.',
            data: feedData
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
};
