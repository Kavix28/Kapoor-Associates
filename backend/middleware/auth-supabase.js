const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'Authentication token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return res.status(403).json({
      error: 'Invalid token',
      message: 'Authentication token is invalid or expired'
    });
  }
};

// Middleware to validate user exists and is active
const validateUser = async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, role, is_active')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'User account does not exist'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        error: 'Account disabled',
        message: 'User account has been disabled'
      });
    }

    req.user = { ...req.user, ...user };
    next();
  } catch (error) {
    console.error('❌ User validation error:', error);
    return res.status(500).json({
      error: 'Validation failed',
      message: 'Unable to validate user account'
    });
  }
};

// Middleware to require admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Admin privileges required'
    });
  }
  next();
};

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'kapoor-associates',
    audience: 'admin-panel'
  });
};

// Verify JWT token (utility function)
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  authenticateToken,
  validateUser,
  requireAdmin,
  generateToken,
  verifyToken
};