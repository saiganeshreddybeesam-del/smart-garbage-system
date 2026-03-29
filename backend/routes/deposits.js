const express = require('express');
const Deposit = require('../models/Deposit');
const User = require('../models/User');
const Bin = require('../models/Bin');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Record a new garbage deposit and award points
router.post('/new', authMiddleware, async (req, res) => {
    try {
        const { binId, weight } = req.body;
        
        if (!binId || !weight) {
            return res.status(400).json({ error: 'Missing binId or weight' });
        }

        const bin = await Bin.findByPk(binId);
        if (!bin) return res.status(404).json({ error: 'Bin not found' });

        // Calculate points (10 points per kg)
        const w = Number(weight);
        const pointsEarned = Math.floor(w * 10);

        // 1. Create Deposit Ledger Record
        const deposit = await Deposit.create({
            userId: req.user.id,
            binId: bin.id,
            weight: w,
            pointsEarned: pointsEarned
        });

        // 2. Update the User's Total Points
        const user = await User.findByPk(req.user.id);
        user.points += pointsEarned;
        await user.save();

        // 3. Update the Smart Bin's Fill Level
        bin.currentFill += w;
        bin.fillPercentage = Math.min((bin.currentFill / bin.maxCapacity) * 100, 100);
        if (bin.fillPercentage >= 90) {
            bin.status = 'Full';
        }
        await bin.save();

        res.json({
            message: 'Deposit recorded successfully',
            deposit,
            newTotalPoints: user.points,
            binFillPercentage: bin.fillPercentage
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get recent deposits for the logged-in user
router.get('/my-history', authMiddleware, async (req, res) => {
     try {
         const history = await Deposit.findAll({
             where: { userId: req.user.id },
             order: [['timestamp', 'DESC']],
             limit: 10
         });
         res.json(history);
     } catch (error) {
         res.status(500).json({ error: 'Server error' });
     }
});

module.exports = router;
