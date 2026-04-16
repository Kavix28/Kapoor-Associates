const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { supabase, testConnection } = require('./config/supabase');
require('dotenv').config();

const authRoutes = require('./routes/auth-supabase');
const contactRoutes = require('./routes/contact-supabase');
const consultationRoutes = require('./routes/consultation-supabase');
const chatbotRoutes = require('./routes/chatbot-supabase');
const adminRoutes = require('./routes/admin-supabase');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware - simplified for development
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.CORS_ORIGINS ? 
      process.env.CORS_ORIGINS.split(',') : 
      ['http://localhost:3000', 'http://127.0.0.1:3000'];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Stricter rate limiting for chatbot
const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit chatbot interactions
  message: {
    error: 'Too many chatbot requests. Please schedule a consultation for detailed assistance.',
    action: 'schedule_consultation'
  }
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Global error handling for async routes
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/chatbot', chatbotLimiter, chatbotRoutes);
app.use('/api/admin', adminRoutes);

// Simple ping endpoint for testing
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Kapoor & Associates API Server',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      contact: '/api/contact', 
      consultation: '/api/consultation',
      chatbot: '/api/chatbot',
      admin: '/api/admin'
    }
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Legal disclaimer endpoint
app.get('/api/disclaimer', (req, res) => {
  res.json({
    disclaimer: "This website and any information provided herein is for informational purposes only and does not constitute legal advice. No attorney-client relationship is created through use of this website or communication with our firm until a formal engagement agreement is executed. Please consult with a qualified legal professional for advice specific to your situation.",
    barCouncilCompliance: "This website complies with the Bar Council of India guidelines. We do not guarantee outcomes or make promises regarding case results.",
    confidentiality: "All consultations are handled with strict confidentiality in accordance with attorney-client privilege."
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`❌ Error on ${req.method} ${req.path}:`, err);
  
  // Prevent ECONNRESET by always sending a response
  if (res.headersSent) {
    return next(err);
  }
  
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON format',
      message: 'Please check your request format'
    });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: err.message
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `The requested resource ${req.originalUrl} does not exist`,
    availableEndpoints: [
      '/health',
      '/api/health',
      '/api/contact/info',
      '/api/consultation/available-slots',
      '/api/chatbot/chat',
      '/api/admin/dashboard'
    ]
  });
});

// Initialize Supabase and start server
async function startServer() {
  try {
    // Test Supabase connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Failed to connect to Supabase. Please check your configuration.');
      process.exit(1);
    }
    
    console.log('✅ Supabase connection established successfully');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Kapoor & Associates API Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: Supabase (PostgreSQL)`);
      console.log(`🔒 Security: Helmet, CORS, Rate Limiting enabled`);
      console.log(`📧 Email service: ${process.env.EMAIL_HOST ? 'Configured' : 'Not configured'}`);
      console.log(`🌐 Server accessible at: http://localhost:${PORT}`);
      console.log(`📊 Supabase Dashboard: ${process.env.SUPABASE_URL}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;