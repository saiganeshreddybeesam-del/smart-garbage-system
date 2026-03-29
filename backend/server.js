require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Models
require('./models/User');
require('./models/Bin');
require('./models/Deposit');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const binRoutes = require('./routes/bins');
const depositRoutes = require('./routes/deposits');

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend static files natively to bypass browser file:/// camera sandboxes
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

// Register API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/deposits', depositRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'EcoReward API Server is running.' });
});

const PORT = process.env.PORT || 5000;

// Initialize Database connection and launch server
sequelize.sync({ force: false }).then(() => {
    console.log('✅ SQLite Database Connected and Synced');
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('❌ Database connection failed:', err);
});