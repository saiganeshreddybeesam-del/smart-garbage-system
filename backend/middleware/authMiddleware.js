const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ error: 'No token, authorization denied' });
    
    // Format: "Bearer <token>"
    const token = header.split(' ')[1] || header;
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
}

module.exports = authMiddleware;
