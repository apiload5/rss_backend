// src/controllers/feedController.js

const User = require('../models/User');
const Feed = require('../models/Feed');

// @desc    Add a new RSS feed URL for the authenticated user
// @route   POST /api/feeds/add
// @access  Private
const addFeed = async (req, res) => {
    const userId = req.userId;
    const { url, name } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, message: 'RSS feed URL is required.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        const newFeed = new Feed({
            owner: userId,
            url,
            name: name || url,
            lastFetched: null,
            feedItems: []
        });

        await newFeed.save();

        res.status(201).json({
            success: true,
            message: 'Feed added successfully. Worker will fetch content shortly.',
            feed: {
                id: newFeed._id,
                name: newFeed.name,
                url: newFeed.url
            }
        });

    } catch (error) {
        console.error('Error adding feed:', error);
        res.status(500).json({ success: false, message: 'Server error while adding feed.' });
    }
};

// @desc    Get all feeds and their latest items for the authenticated user
// @route   GET /api/feeds
// @access  Private
const getUserFeeds = async (req, res) => {
    try {
        const userId = req.userId;
        const feeds = await Feed.find({ owner: userId }).select('-feedItems.content -feedItems.summary');

        if (!feeds || feeds.length === 0) {
            return res.status(200).json({ success: true, message: 'No feeds found.', feeds: [] });
        }

        res.status(200).json({
            success: true,
            count: feeds.length,
            feeds
        });

    } catch (error) {
        console.error('Error fetching user feeds:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching feeds.' });
    }
};

// @desc    Get detailed items for a specific feed
// @route   GET /api/feeds/:feedId
// @access  Private
const getFeedItems = async (req, res) => {
    try {
        const feedId = req.params.feedId;
        const userId = req.userId;

        const feed = await Feed.findOne({ _id: feedId, owner: userId });

        if (!feed) {
            return res.status(404).json({ success: false, message: 'Feed not found or unauthorized.' });
        }

        res.status(200).json({
            success: true,
            feed: {
                id: feed._id,
                name: feed.name,
                url: feed.url,
                lastFetched: feed.lastFetched,
                itemCount: feed.feedItems.length,
                items: feed.feedItems
            }
        });

    } catch (error) {
        console.error('Error fetching feed items:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching feed items.' });
    }
};

// ✅ Proper export for Vercel + Node.js compatibility
module.exports = {
    addFeed,
    getUserFeeds,
    getFeedItems
};
        
