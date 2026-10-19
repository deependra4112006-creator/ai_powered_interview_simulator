import jwt from 'jsonwebtoken';
import dbStore from '../services/dbStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'interviewai_super_secret_jwt_key_2026_dev_secure';
      const decoded = jwt.verify(token, secret);

      const user = await dbStore.findUserById(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found for this token' });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};
