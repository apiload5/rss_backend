// /src/routes/publicRoutes.js

const express = require('express');
const { getWidgetData } = require('../controllers/publicController');

const router = express.Router();

// GET /api/public/widget/:widgetKey
// یہ وہ endpoint ہے جسے آپ کا فرنٹ اینڈ یا embeddable JavaScript استعمال کرے گا
router.get('/widget/:widgetKey', getWidgetData);

module.exports = router;
