// /server.js

const app = require('./src/app');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const { startScheduler } = require('./src/services/workerService'); // Worker سروس شامل کریں

dotenv.config();

// ڈیٹا بیس سے جڑیں
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Worker Scheduler کو شروع کریں!
    startScheduler(); 
    
    console.log(`Environment: ${process.env.NODE_ENV}`);
});
