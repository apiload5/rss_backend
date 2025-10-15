// /src/controllers/feedController.js

const rssService = require('../services/rssService');
const Feed = require('../models/Feed'); 
const Article = require('../models/Article');
const Widget = require('../models/Widget'); // Widget ماڈل امپورٹ کریں
const { v4: uuidv4 } = require('uuid'); // Widget Key بنانے کے لیے

// آپ کو 'uuid' لائبریری انسٹال کرنی ہوگی: npm install uuid

// -------------------
// 1. فیڈ شامل کرنا اور محفوظ کرنا (Updated with complete logic)
// -------------------
exports.addFeed = async (req, res) => {
    const { url } = req.body;
    const ownerId = req.user._id; // ID ٹوکن سے ملی ہے!

    if (!url) {
        return res.status(400).json({ success: false, message: 'Feed URL is required.' });
    }

    try {
        // 1. RSS سروس کا استعمال کرتے ہوئے URL کو پارس کریں
        const { title, link, articles } = await rssService.parseFeed(url);
        
        // 2. چیک کریں کہ آیا فیڈ پہلے سے موجود ہے
        let existingFeed = await Feed.findOne({ url, ownerId });

        if (existingFeed) {
             return res.status(409).json({ success: false, message: 'You have already subscribed to this feed.', feed: existingFeed });
        }

        // 3. نیا فیڈ ماڈل بنائیں اور محفوظ کریں
        const newFeed = new Feed({
            url,
            title,
            ownerId: ownerId, 
            lastFetched: new Date(),
        });
        const savedFeed = await newFeed.save();

        // 4. نئے آرٹیکلز کو ڈیٹا بیس میں محفوظ کریں
        const articlesToSave = articles.map(article => ({
            feedId: savedFeed._id,
            title: article.title,
            link: article.link,
            contentSnippet: article.contentSnippet,
            pubDate: article.pubDate,
        }));
        
        const result = await Article.insertMany(articlesToSave, { ordered: false })
            .catch(err => {
                if (err.code !== 11000) console.error("InsertMany Error:", err);
                return { insertedCount: 0 };
            });

        res.status(201).json({ 
            success: true, 
            message: 'Feed added and articles imported successfully.',
            feed: savedFeed,
            articlesInserted: result.insertedCount || 0
        });

    } catch (error) {
        console.error("Error adding feed:", error);
        res.status(500).json({ success: false, message: error.message || 'Failed to add feed due to server error.' });
    }
};

// -------------------
// 2. تمام فیڈز حاصل کرنا (پچھلا فنکشن)
// -------------------
exports.getFeeds = async (req, res) => {
    try {
        const feeds = await Feed.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, feeds });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching feeds.' });
    }
};


// -------------------
// 3. مخصوص فیڈ اور اس کے آرٹیکلز حاصل کرنا (پچھلا فنکشن)
// -------------------
exports.getFeedArticles = async (req, res) => {
    const { feedId } = req.params;
    const ownerId = req.user._id;

    try {
        const feed = await Feed.findOne({ _id: feedId, ownerId });

        if (!feed) {
            return res.status(404).json({ message: 'Feed not found or access denied.' });
        }

        const articles = await Article.find({ feedId })
            .sort({ pubDate: -1 })
            .limit(50) 
            .select('title link pubDate contentSnippet');

        res.json({ success: true, feed: feed, articles: articles });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching articles.' });
    }
};


// -------------------
// 4. فیڈ ڈیلیٹ کرنا (پچھلا فنکشن)
// -------------------
exports.deleteFeed = async (req, res) => {
    const { id } = req.params;

    try {
        const feed = await Feed.findOne({ _id: id, ownerId: req.user._id });

        if (!feed) {
            return res.status(404).json({ message: 'Feed not found or access denied.' });
        }

        await feed.deleteOne();
        await Article.deleteMany({ feedId: id });
        await Widget.deleteMany({ feedId: id }); // اس سے جڑے ویجیٹس بھی ڈیلیٹ کریں!

        res.json({ success: true, message: 'Feed, articles, and associated widgets deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting feed.' });
    }
};


// -------------------
// 5. ویجیٹ بنانا (نیا اہم فنکشن)
// POST /api/feeds/:feedId/widget
// -------------------
exports.createWidget = async (req, res) => {
    const { feedId } = req.params;
    const ownerId = req.user._id;
    const { settings, keywordsFilter } = req.body;

    try {
        // 1. چیک کریں کہ فیڈ صارف کی ملکیت ہے یا نہیں
        const feed = await Feed.findOne({ _id: feedId, ownerId });
        if (!feed) {
            return res.status(404).json({ message: 'Feed not found or access denied.' });
        }

        // 2. Widget Key بنائیں
        const widgetKey = uuidv4(); 

        // 3. نیا ویجیٹ محفوظ کریں
        const newWidget = new Widget({
            feedId,
            ownerId,
            widgetKey,
            settings: settings, 
            keywordsFilter: keywordsFilter || [],
            isActive: true
        });

        const savedWidget = await newWidget.save();
        
        // 4. ویجیٹ کوڈ واپس کریں
        res.status(201).json({
            success: true,
            message: 'Widget created successfully.',
            widget: savedWidget,
            // فرنٹ اینڈ کے لیے استعمال ہونے والا Embed Code
            embedCode: `<script src="${req.protocol}://${req.get('host')}/embed.js?key=${widgetKey}"></script>` 
        });

    } catch (error) {
        console.error('Error creating widget:', error);
        res.status(500).json({ message: error.message || 'Could not create widget.' });
    }
};
