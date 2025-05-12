const jwt = require('jsonwebtoken');
const { config } = require('../../config');

const authenticator = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    try{
        const decoded = jwt.verify(token, config.jwtKey);
        const { userId } = decoded;
        req.body.userId = userId;

        next();
    } catch (error) {
        res.status(401).json({ message: 'not Authenticated' });
    }
};

module.exports = { authenticator };