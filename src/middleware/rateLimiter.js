// /src/middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');

// 1. عمومی API کے لیے (Authenticated Users)
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 منٹ
  max: 100, // 15 منٹ میں فی IP 100 درخواستیں
  standardHeaders: true, 
  legacyHeaders: false, 
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});

// 2. Public Widget API کے لیے (زیادہ کھلا رکھنا چاہیے)
exports.publicLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 منٹ
  max: 60, // 1 منٹ میں فی IP 60 درخواستیں (یعنی 1 درخواست فی سیکنڈ)
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Public access rate limit exceeded. Please wait a moment.'
});
