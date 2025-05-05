const jwt = require('jsonwebtoken');

exports.checkUser = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(401).json({ message: 'Unauthorized user' });
    }
}