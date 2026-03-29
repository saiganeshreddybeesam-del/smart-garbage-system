const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get current logged-in user profile
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get leaderboard (top 10 users by points)
router.get('/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.findAll({
            attributes: ['id', 'username', 'points'],
            order: [['points', 'DESC']],
            limit: 10
        });
        res.json(topUsers);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all users (Admin view)
router.get('/all', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'points', 'role'],
            order: [['points', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
