const jwt = require('jsonwebtoken');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;


module.exports = (req, res, next) => {
try {
const authHeader = req.headers.authorization;
if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });
const parts = authHeader.split(' ');
if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid authorization header' });
const token = parts[1];
const payload = jwt.verify(token, JWT_SECRET);
req.user = { id: payload.id };
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid or expired token' });
}
};