const cron = require('node-cron');
const Feed = require('../models/Feed');
const Article = require('../models/Article');
const { parseFeed } = require('./rssService'); // پچھلا پارسنگ فنکشن

// مستقل وقفہ (مثلاً ہر 30 منٹ)
const DEFAULT_REFRESH_RATE_MS = 30 * 60 * 1000; 

// یہ فنکشن ایک فیڈ کو اپ ڈیٹ کرنے کا کام کرے گا
async function updateSingleFeed(feed) {
    console.log(`[Worker] Starting update for: ${feed.title}`);

    try {
        const { articles } = await parseFeed(feed.url);

        if (!articles || articles.length === 0) {
            console.log(`[Worker] No new articles found for ${feed.title}.`);
            return;
        }

        // صرف وہ آرٹیکلز جو آخری بار فیچ ہونے کے بعد شائع ہوئے ہیں، انہیں فلٹر کریں
        const newArticles = articles.filter(article => 
            new Date(article.pubDate) > new Date(feed.lastFetched)
        );

        if (newArticles.length === 0) {
            console.log(`[Worker] Filtered out, found no truly new articles for ${feed.title}.`);
            return;
        }

        // نئے آرٹیکلز کو ڈیٹا بیس میں محفوظ کریں
        const articlesToSave = newArticles.map(article => ({
            feedId: feed._id,
            title: article.title,
            link: article.link,
            contentSnippet: article.contentSnippet,
            pubDate: article.pubDate,
        }));
        
        // نئے آرٹیکلز ڈیٹا بیس میں شامل کریں
        const result = await Article.insertMany(articlesToSave, { ordered: false })
            .catch(err => {
                // اگر لنک پہلے سے موجود ہے تو ایرر کو نظرانداز کریں
                if (err.code !== 11000) throw err; 
            });

        // فیڈ کا آخری اپ ڈیٹ وقت تبدیل کریں
        feed.lastFetched = new Date();
        await feed.save();

        console.log(`[Worker] Successfully added ${result.insertedCount || newArticles.length} new articles for ${feed.title}.`);

    } catch (error) {
        console.error(`[Worker] Error updating feed ${feed.url}: ${error.message}`);
        // یہاں ایرر لاگنگ شامل کریں تاکہ خراب فیڈز کو ٹریک کیا جا سکے
    }
}

// یہ فنکشن ہر بار Cron Job چلنے پر تمام فیڈز کو چیک کرے گا
async function runFeedUpdates() {
    console.log('\n--- [Worker] Starting scheduled feed check ---');
    try {
        // وہ تمام فیڈز نکالیں جنہیں اپ ڈیٹ کی ضرورت ہے
        // یہاں ایک پیچیدہ لاجک ہونی چاہیے جو ہر فیڈ کے refreshRate کو چیک کرے،
        // لیکن سادگی کے لیے ہم ابھی تمام فیڈز نکال رہے ہیں۔
        const feeds = await Feed.find({}); 

        for (const feed of feeds) {
            // فی الحال، ہم فیڈز کو ایک ایک کر کے (sequentially) اپ ڈیٹ کر رہے ہیں تاکہ سرور اوورلوڈ نہ ہو
            await updateSingleFeed(feed); 
        }

        console.log('--- [Worker] Finished scheduled feed check ---');
    } catch (error) {
        console.error('[Worker] Global Update Error:', error.message);
    }
}

// Cron Job کو شروع کرنے کا مرکزی فنکشن
exports.startScheduler = () => {
    // Cron Syntax: * * * * * * (second minute hour day-of-month month day-of-week)
    // یہاں ہم اسے ہر 30 ویں منٹ پر چلا رہے ہیں (مثلاً 1:30، 2:30 وغیرہ)
    cron.schedule('0 */30 * * * *', runFeedUpdates, {
        scheduled: true,
        timezone: "Asia/Karachi" // یا آپ کا مطلوبہ ٹائم زون
    });
    
    console.log('Worker Scheduler started. Running updates every 30 minutes.');
    
    // سرور شروع ہونے پر فوری طور پر ایک بار چلائیں
    // runFeedUpdates(); 
};
