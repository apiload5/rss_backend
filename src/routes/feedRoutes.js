// /src/routes/feedRoutes.js

const express = require('express');
const feedController = require('../controllers/feedController');

const router = express.Router();

// POST /api/feeds/add - صارف کی طرف سے نئی فیڈ شامل کرنے کے لیے
router.post('/add', feedController.addFeed);

// دیگر routes یہاں شامل کیے جائیں گے (جیسے: /api/feeds/:id, /api/feeds/articles)

module.exports = router;
