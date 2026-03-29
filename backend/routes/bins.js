const express = require('express');
const Bin = require('../models/Bin');

const router = express.Router();

// Get all smart bins (For the map visualization)
router.get('/', async (req, res) => {
    try {
        const bins = await Bin.findAll();
        res.json(bins);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Seed some initial demo bins if database is empty
router.post('/seed', async (req, res) => {
    try {
        const count = await Bin.count();
        if (count === 0) {
            await Bin.bulkCreate([
                { name: 'Banjara Hills Sector 4', location: '17.4156, 78.4347', maxCapacity: 100, currentFill: 24.5, fillPercentage: 24.5 },
                { name: 'Jubilee Hills Checkpost', location: '17.4265, 78.4116', maxCapacity: 100, currentFill: 85.0, fillPercentage: 85.0, status: 'Full' },
                { name: 'Madhapur Cyber Towers', location: '17.4504, 78.3808', maxCapacity: 150, currentFill: 102.0, fillPercentage: 68.0 }
            ]);
            return res.json({ message: 'Bins seeded successfully' });
        }
        res.json({ message: 'Bins already exist in database' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Empty a specific bin via Admin Dashboard
router.post('/:id/empty', async (req, res) => {
    try {
        const bin = await Bin.findByPk(req.params.id);
        if (!bin) return res.status(404).json({ error: 'Bin not found' });
        
        bin.currentFill = 0;
        bin.fillPercentage = 0;
        bin.status = 'Good';
        await bin.save();
        
        res.json({ message: 'Bin successfully emptied', bin });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a new smart bin (Admin Deployment)
router.post('/new', async (req, res) => {
    try {
        const { name, location, maxCapacity } = req.body;
        if (!name || !location || !maxCapacity) return res.status(400).json({ error: 'Missing required fields' });
        
        const newBin = await Bin.create({
            name,
            location,
            maxCapacity: parseFloat(maxCapacity) || 100,
            currentFill: 0,
            fillPercentage: 0,
            status: 'Good'
        });
        res.status(201).json({ message: 'Bin successfully deployed', bin: newBin });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
