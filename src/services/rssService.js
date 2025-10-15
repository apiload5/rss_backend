// /src/services/rssService.js

const Parser = require('rss-parser');

// نئے آرٹیکلز کی صرف اہم معلومات نکالیں
const sanitizeItem = (item) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate ? new Date(item.pubDate) : new Date(),
    contentSnippet: item.contentSnippet,
    // فیڈ سے دیگر ضروری ڈیٹا جیسے image یا author
});

// اہم فنکشن جو فیڈ URL کو پارس کرتا ہے
exports.parseFeed = async (feedUrl) => {
    let parser = new Parser({
        // کسٹم ہیڈرز شامل کریں تاکہ بلاک نہ ہو
        headers: { 'User-Agent': 'RSS-Aggregator-Custom-Bot/1.0' }
    });

    try {
        let feed = await parser.parseURL(feedUrl);
        
        // صرف اہم معلومات کو نکالیں
        const articles = feed.items.map(sanitizeItem);

        // فیڈ کے بنیادی میٹا ڈیٹا کو واپس کریں
        return {
            title: feed.title,
            link: feed.link,
            description: feed.description,
            articles: articles,
            lastFetched: new Date(),
        };

    } catch (error) {
        console.error(`Error parsing feed from ${feedUrl}:`, error.message);
        // ایک مخصوص ایرر پھینکیں تاکہ کنٹرولر اسے سنبھال سکے
        throw new Error(`Failed to parse feed: ${error.message}`);
    }
};
