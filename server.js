// /server.js

const app = require('./src/app');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db'); // DB فنکشن شامل کریں

dotenv.config();

// ڈیٹا بیس سے جڑیں
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
