// /server.js

require('dotenv').config(); // ✅ Yeh line sabse upar honi chahiye (dotenv load before any imports)

const app = require('./src/app');
const connectDB = require('./src/config/db');
const { startScheduler } = require('./src/services/workerService');

// ✅ Database Connection
connectDB();

// ✅ Start server (Vercel / Local compatible)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    
    // ✅ Worker scheduler (optional in Vercel — will only run on main instance)
    try {
        startScheduler();
        console.log('⏱️ Worker scheduler started successfully.');
    } catch (err) {
        console.error('❌ Worker scheduler error:', err.message);
    }

    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
    
