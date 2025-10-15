// /server.js

const app = require('./src/app');
const dotenv = require('dotenv');

// .env فائل سے انوائرمنٹ ویری ایبلز لوڈ کریں
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
