// /src/controllers/publicController.js

const Widget = require('../models/Widget');
const Article = require('../models/Article');

// زیادہ سے زیادہ آرٹیکلز کی حد (سرور کو زیادہ بوجھ سے بچانے کے لیے)
const MAX_LIMIT = 50; 

// 1. ویجیٹ کے لیے ڈیٹا حاصل کرنا
exports.getWidgetData = async (req, res) => {
    const { widgetKey } = req.params;

    try {
        // 1. ویجیٹ کی سیٹنگز widgetKey کی بنیاد پر تلاش کریں
        const widget = await Widget.findOne({ widgetKey, isActive: true })
            .populate('feedId', 'title'); // ساتھ ہی فیڈ کا عنوان بھی لے آئیں

        if (!widget) {
            return res.status(404).json({ success: false, message: 'Widget not found or inactive.' });
        }

        const { feedId, settings, keywordsFilter } = widget;
        
        // 2. آرٹیکلز کی تلاش کی شرائط (Query Conditions) سیٹ کریں
        let query = { feedId: feedId._id };
        
        // Advanced Filtering: اگر کی ورڈ فلٹر موجود ہو
        if (keywordsFilter && keywordsFilter.length > 0) {
            // RegEx استعمال کریں تاکہ آرٹیکل کا عنوان keywordsFilter میں سے کسی سے بھی ملتا ہو
            query.title = { $in: keywordsFilter.map(k => new RegExp(k, 'i')) };
        }

        // 3. ڈیٹا بیس سے آرٹیکلز نکالیں
        const articles = await Article.find(query)
            .sort({ pubDate: -1 }) // تازہ ترین پہلے
            .limit(settings.maxItems > MAX_LIMIT ? MAX_LIMIT : settings.maxItems) // حد مقرر کریں
            .select('title link pubDate contentSnippet'); // صرف ضروری فیلڈز دکھائیں

        // 4. ڈیٹا واپس کریں
        res.json({
            success: true,
            feedTitle: feedId.title,
            widgetSettings: settings,
            articles: articles,
        });

    } catch (error) {
        console.error('Error fetching widget data:', error);
        // سیکیورٹی وجوہات کی بنا پر پبلک API میں اندرونی ایرر کی تفصیلات نہیں دکھانی چاہیے
        res.status(500).json({ success: false, message: 'Could not fetch widget data.' });
    }
};
