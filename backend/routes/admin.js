const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { authenticateToken, requireAdmin, validateUser } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const moment = require('moment');
const googleCalendarService = require('../services/googleCalendar');

const router = express.Router();
console.log('Router created, type:', typeof router);
const DB_PATH = process.env.DB_PATH || './database/kapoor_associates.db';

// Apply authentication middleware to all admin routes
// router.use(authenticateToken);
// router.use(validateUser);
// router.use(requireAdmin);

// Audit logging middleware
const auditLog = (action, resourceType, resourceId = null) => {
  return (req, res, next) => {
    console.log('Audit log middleware called');
    next();
  };
};

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    // Get various statistics
    const stats = await Promise.all([
      // Total consultations
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM consultation_bookings', (err, row) => {
          if (err) reject(err);
          else resolve({ totalConsultations: row.count });
        });
      }),
      
      // Pending consultations
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM consultation_bookings WHERE status = "pending"', (err, row) => {
          if (err) reject(err);
          else resolve({ pendingConsultations: row.count });
        });
      }),
      
      // Today's consultations
      new Promise((resolve, reject) => {
        const today = new Date().toISOString().split('T')[0];
        db.get('SELECT COUNT(*) as count FROM consultation_bookings WHERE preferred_date = ?', [today], (err, row) => {
          if (err) reject(err);
          else resolve({ todayConsultations: row.count });
        });
      }),
      
      // Total contact queries
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM contact_queries', (err, row) => {
          if (err) reject(err);
          else resolve({ totalQueries: row.count });
        });
      }),
      
      // Unread contact queries
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM contact_queries WHERE status = "new"', (err, row) => {
          if (err) reject(err);
          else resolve({ unreadQueries: row.count });
        });
      }),
      
      // Chatbot conversations today
      new Promise((resolve, reject) => {
        db.get('SELECT COUNT(*) as count FROM chatbot_conversations WHERE date(created_at) = date("now")', (err, row) => {
          if (err) reject(err);
          else resolve({ todayChatbotConversations: row.count });
        });
      }),
      
      // Recent consultations (last 7 days)
      new Promise((resolve, reject) => {
        db.all(`
          SELECT DATE(created_at) as date, COUNT(*) as count 
          FROM consultation_bookings 
          WHERE created_at >= date('now', '-7 days')
          GROUP BY DATE(created_at)
          ORDER BY date DESC
        `, (err, rows) => {
          if (err) reject(err);
          else resolve({ recentConsultations: rows });
        });
      }),
      
      // Calendar integration status
      new Promise((resolve, reject) => {
        db.get(`
          SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN calendar_event_id IS NOT NULL THEN 1 ELSE 0 END) as with_calendar,
            SUM(CASE WHEN meeting_status = 'scheduled' THEN 1 ELSE 0 END) as scheduled,
            SUM(CASE WHEN meeting_status = 'calendar_pending' THEN 1 ELSE 0 END) as calendar_pending
          FROM consultation_bookings 
          WHERE created_at >= date('now', '-30 days')
        `, (err, row) => {
          if (err) reject(err);
          else resolve({ 
            calendarIntegration: {
              total: row.total,
              withCalendar: row.with_calendar,
              scheduled: row.scheduled,
              calendarPending: row.calendar_pending,
              integrationRate: row.total > 0 ? Math.round((row.with_calendar / row.total) * 100) : 0,
              serviceEnabled: !!googleCalendarService.calendar
            }
          });
        });
      })
    ]);
    
    // Combine all statistics
    const dashboardData = stats.reduce((acc, stat) => ({ ...acc, ...stat }), {});
    
    res.json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load dashboard data'
    });
  } finally {
    db.close();
  }
});

// ==================== ADVOCATES MANAGEMENT ====================

// Get all advocates
router.get('/advocates', async (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    console.log('📋 Fetching advocates list');
    
    const advocates = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name, title, experience_years, specialization, bio, court_practice, is_active, display_order, created_at, updated_at
        FROM advocates 
        ORDER BY display_order ASC, created_at ASC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    res.json({
      success: true,
      data: {
        advocates: advocates.map(a => ({
          id: a.id,
          name: a.name,
          title: a.title,
          experienceYears: a.experience_years,
          specialization: a.specialization,
          bio: a.bio,
          courtPractice: a.court_practice,
          isActive: a.is_active === 1,
          displayOrder: a.display_order,
          createdAt: a.created_at,
          updatedAt: a.updated_at
        }))
      }
    });
    
  } catch (error) {
    console.error('❌ Advocates fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch advocates',
      message: 'Unable to retrieve advocates list'
    });
  } finally {
    db.close();
  }
});

// Update advocate
router.patch('/advocates/:id', [
  auditLog('UPDATE_ADVOCATE', 'advocate'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('title').optional().trim().isLength({ min: 2, max: 200 }).withMessage('Title must be 2-200 characters'),
  body('experienceYears').optional().isInt({ min: 0, max: 50 }).withMessage('Experience must be 0-50 years'),
  body('specialization').optional().trim().isLength({ max: 500 }).withMessage('Specialization too long'),
  body('bio').optional().trim().isLength({ max: 2000 }).withMessage('Bio too long'),
  body('courtPractice').optional().trim().isLength({ max: 200 }).withMessage('Court practice too long'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
  body('displayOrder').optional().isInt({ min: 0 }).withMessage('Display order must be positive integer')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  
  const { id } = req.params;
  const { name, title, experienceYears, specialization, bio, courtPractice, isActive, displayOrder } = req.body;
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    console.log(`📝 Updating advocate ID: ${id}`);
    
    // Build dynamic update query
    const updates = [];
    const values = [];
    
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (experienceYears !== undefined) { updates.push('experience_years = ?'); values.push(experienceYears); }
    if (specialization !== undefined) { updates.push('specialization = ?'); values.push(specialization); }
    if (bio !== undefined) { updates.push('bio = ?'); values.push(bio); }
    if (courtPractice !== undefined) { updates.push('court_practice = ?'); values.push(courtPractice); }
    if (isActive !== undefined) { updates.push('is_active = ?'); values.push(isActive ? 1 : 0); }
    if (displayOrder !== undefined) { updates.push('display_order = ?'); values.push(displayOrder); }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE advocates SET ${updates.join(', ')} WHERE id = ?`,
        values,
        function(err) {
          if (err) reject(err);
          else if (this.changes === 0) reject(new Error('Advocate not found'));
          else resolve();
        }
      );
    });
    
    res.json({
      success: true,
      message: 'Advocate updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Advocate update error:', error);
    if (error.message === 'Advocate not found') {
      res.status(404).json({ 
        success: false,
        error: 'Advocate not found' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to update advocate',
        message: error.message
      });
    }
  } finally {
    db.close();
  }
});

// Get calendar integration status
router.get('/calendar-status', async (req, res) => {
  try {
    const status = {
      serviceEnabled: !!googleCalendarService.calendar,
      authMethod: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH ? 'Service Account' : 
                  process.env.GOOGLE_REFRESH_TOKEN ? 'OAuth2' : 'Not Configured',
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      lastCheck: new Date().toISOString()
    };
    
    // Test calendar access if enabled
    if (googleCalendarService.calendar) {
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dateStr = tomorrow.toISOString().split('T')[0];
        
        await googleCalendarService.checkSlotAvailability(dateStr, '11:00', 30);
        status.connectionStatus = 'Connected';
        status.lastSuccessfulTest = new Date().toISOString();
      } catch (error) {
        status.connectionStatus = 'Error';
        status.lastError = error.message;
      }
    } else {
      status.connectionStatus = 'Not Configured';
    }
    
    res.json({
      success: true,
      data: status
    });
    
  } catch (error) {
    console.error('Calendar status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get calendar status'
    });
  }
});

module.exports = router;