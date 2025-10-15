const rssService = require('../services/rssService');
const Feed = require('../models/Feed'); // Feed ماڈل امپورٹ کریں
const Article = require('../models/Article'); // Article ماڈل امپورٹ کریں
const User = require('../models/User'); // یوزر ماڈل امپورٹ کریں

// عارضی ایڈمن یوزر ID نکالنے کا فنکشن
const getAdminUserId = async () => {
    // آپ اسے آتھنٹیکیشن مڈل ویئر سے حاصل کریں گے
    // لیکن فی الحال ہم ڈمی یوزر تلاش کر رہے ہیں
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
        throw new Error("Admin user not found. Please create one in the DB.");
    }
    return adminUser._id;
};

exports.addFeed = async (req, res) => {
    const { url } = req.body; 

    if (!url) {
        return res.status(400).json({ success: false, message: 'Feed URL is required.' });
    }

    try {
        const adminId = await getAdminUserId(); // یوزر ID حاصل کریں
        
        // 1. RSS سروس کا استعمال کرتے ہوئے URL کو پارس کریں
        const { title, link, articles } = await rssService.parseFeed(url);
        
        // 2. چیک کریں کہ آیا فیڈ پہلے سے موجود ہے
        let existingFeed = await Feed.findOne({ url });

        if (existingFeed) {
             return res.status(409).json({ success: false, message: 'This feed already exists.', feed: existingFeed });
        }

        // 3. نیا فیڈ ماڈل بنائیں اور محفوظ کریں
        const newFeed = new Feed({
            url,
            title,
            // link: link, // آپشنل: اگر آپ فیڈ کا لنک محفوظ کرنا چاہیں
            ownerId: adminId, 
            lastFetched: new Date(),
        });
        const savedFeed = await newFeed.save();

        // 4. نئے آرٹیکلز کو ڈیٹا بیس میں محفوظ کریں (Article ماڈل میں)
        const articlesToSave = articles.map(article => ({
            feedId: savedFeed._id,
            title: article.title,
            link: article.link,
            contentSnippet: article.contentSnippet,
            pubDate: article.pubDate,
        }));
        
        // Mongo میں بہت سارے آرٹیکلز ایک ساتھ ڈالیں
        // 'ordered: false' کا مطلب ہے کہ اگر ایک آرٹیکل پہلے سے موجود ہو (unique link کی وجہ سے) تو باقی ڈالے جائیں گے
        const result = await Article.insertMany(articlesToSave, { ordered: false })
            .catch(err => {
                // Duplicate key error کو نظرانداز کریں (اگر کوئی آرٹیکل پہلے سے ہو)
                if (err.code !== 11000) throw err; 
                return { insertedCount: result ? result.length : 0 };
            });

        res.status(201).json({ 
            success: true, 
            message: 'Feed added and articles imported successfully.',
            feed: savedFeed,
            articlesInserted: result.insertedCount 
        });

    } catch (error) {
        console.error("Error adding feed:", error);
        res.status(500).json({ success: false, message: error.message || 'Failed to add feed due to server error.' });
    }
};
