const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { authenticateToken, requireAdmin, validateUser } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const moment = require('moment');
const googleCalendarService = require('../services/googleCalendar');

const router = express.Router();
const DB_PATH = process.env.DB_PATH || './database/kapoor_associates.db';

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(validateUser);
router.use(requireAdmin);

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    console.log('📊 Fetching dashboard data...');
    
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
    console.error('❌ Dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to load dashboard data'
    });
  } finally {
    db.close();
  }
});

// Get calendar integration status
router.get('/calendar-status', async (req, res) => {
  try {
    console.log('📅 Fetching calendar status...');
    
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
    console.error('❌ Calendar status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get calendar status'
    });
  }
});

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

// Create new advocate
router.post('/advocates', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('title').trim().isLength({ min: 2, max: 200 }).withMessage('Title must be 2-200 characters'),
  body('experienceYears').isInt({ min: 0, max: 50 }).withMessage('Experience must be 0-50 years'),
  body('specialization').optional().trim().isLength({ max: 500 }).withMessage('Specialization too long'),
  body('bio').optional().trim().isLength({ max: 2000 }).withMessage('Bio too long'),
  body('courtPractice').optional().trim().isLength({ max: 200 }).withMessage('Court practice too long'),
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
  
  const { name, title, experienceYears, specialization, bio, courtPractice, displayOrder } = req.body;
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    console.log(`➕ Creating new advocate: ${name}`);
    
    const advocateId = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO advocates (name, title, experience_years, specialization, bio, court_practice, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        name, 
        title, 
        experienceYears, 
        specialization || null, 
        bio || null, 
        courtPractice || null, 
        displayOrder || 0
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
    
    res.status(201).json({
      success: true,
      message: 'Advocate created successfully',
      data: { advocateId }
    });
    
  } catch (error) {
    console.error('❌ Advocate creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create advocate',
      message: error.message
    });
  } finally {
    db.close();
  }
});

// Delete advocate (soft delete - set inactive)
router.delete('/advocates/:id', async (req, res) => {
  const { id } = req.params;
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    console.log(`🗑️ Deactivating advocate ID: ${id}`);
    
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE advocates SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id],
        function(err) {
          if (err) reject(err);
          else if (this.changes === 0) reject(new Error('Advocate not found'));
          else resolve();
        }
      );
    });
    
    res.json({
      success: true,
      message: 'Advocate deactivated successfully'
    });
    
  } catch (error) {
    console.error('❌ Advocate deletion error:', error);
    if (error.message === 'Advocate not found') {
      res.status(404).json({ 
        success: false,
        error: 'Advocate not found' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to deactivate advocate'
      });
    }
  } finally {
    db.close();
  }
});

// Get all consultation bookings
router.get('/consultations', async (req, res) => {
  const { page = 1, limit = 20, status, date } = req.query;
  const offset = (page - 1) * limit;
  
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    let query = `
      SELECT id, name, company_name, email, phone, legal_matter, consultation_type, office_location,
             preferred_date, preferred_time, status, meeting_status, calendar_event_id, meeting_link,
             created_at, confirmed_at, notes
      FROM consultation_bookings
    `;
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    
    if (date) {
      conditions.push('preferred_date = ?');
      params.push(date);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const consultations = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM consultation_bookings';
    const countParams = [];
    
    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
      countParams.push(...params.slice(0, -2)); // Remove limit and offset
    }
    
    const totalCount = await new Promise((resolve, reject) => {
      db.get(countQuery, countParams, (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });
    
    res.json({
      success: true,
      data: {
        consultations: consultations.map(c => ({
          id: c.id,
          name: c.name,
          companyName: c.company_name,
          email: c.email,
          phone: c.phone,
          legalMatter: c.legal_matter,
          consultationType: c.consultation_type,
          officeLocation: c.office_location,
          preferredDate: c.preferred_date,
          preferredTime: c.preferred_time,
          status: c.status,
          meetingStatus: c.meeting_status,
          calendarEventId: c.calendar_event_id,
          meetingLink: c.meeting_link,
          createdAt: c.created_at,
          confirmedAt: c.confirmed_at,
          notes: c.notes
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Consultations fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consultations'
    });
  } finally {
    db.close();
  }
});

// Get all contact queries
router.get('/queries', async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const offset = (page - 1) * limit;
  
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    let query = `
      SELECT id, name, email, phone, company_name, message, status, created_at, responded_at
      FROM contact_queries
    `;
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const queries = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM contact_queries';
    const countParams = [];
    
    if (status) {
      countQuery += ' WHERE status = ?';
      countParams.push(status);
    }
    
    const totalCount = await new Promise((resolve, reject) => {
      db.get(countQuery, countParams, (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });
    
    res.json({
      success: true,
      data: {
        queries: queries.map(q => ({
          id: q.id,
          name: q.name,
          email: q.email,
          phone: q.phone,
          companyName: q.company_name,
          message: q.message,
          status: q.status,
          createdAt: q.created_at,
          respondedAt: q.responded_at
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Queries fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact queries'
    });
  } finally {
    db.close();
  }
});

// Get chatbot conversations
router.get('/chatbot-logs', async (req, res) => {
  const { page = 1, limit = 50, sessionId } = req.query;
  const offset = (page - 1) * limit;
  
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    let query = `
      SELECT id, session_id, user_message, bot_response, intent, confidence, escalated, created_at
      FROM chatbot_conversations
    `;
    const params = [];
    
    if (sessionId) {
      query += ' WHERE session_id = ?';
      params.push(sessionId);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const conversations = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    res.json({
      success: true,
      data: {
        conversations: conversations.map(c => ({
          id: c.id,
          sessionId: c.session_id,
          userMessage: c.user_message,
          botResponse: JSON.parse(c.bot_response),
          intent: c.intent,
          confidence: c.confidence,
          escalated: c.escalated === 1,
          createdAt: c.created_at
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Chatbot logs fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chatbot logs'
    });
  } finally {
    db.close();
  }
});

// Update consultation
router.patch('/consultations/:id', [
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 1000 }).withMessage('Notes too long'),
  body('meetingLink').optional().isURL().withMessage('Invalid meeting link')
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
  const { status, notes, meetingLink } = req.body;
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    const updates = [];
    const values = [];
    
    if (status !== undefined) { updates.push('status = ?'); values.push(status); }
    if (notes !== undefined) { updates.push('notes = ?'); values.push(notes); }
    if (meetingLink !== undefined) { updates.push('meeting_link = ?'); values.push(meetingLink); }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }
    
    values.push(id);
    
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE consultation_bookings SET ${updates.join(', ')} WHERE id = ?`,
        values,
        function(err) {
          if (err) reject(err);
          else if (this.changes === 0) reject(new Error('Consultation not found'));
          else resolve();
        }
      );
    });
    
    res.json({
      success: true,
      message: 'Consultation updated successfully'
    });
    
  } catch (error) {
    console.error('Consultation update error:', error);
    if (error.message === 'Consultation not found') {
      res.status(404).json({ 
        success: false,
        error: 'Consultation not found' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to update consultation'
      });
    }
  } finally {
    db.close();
  }
});

// Cancel consultation
router.post('/consultations/:id/cancel', [
  body('reason').trim().isLength({ min: 5, max: 500 }).withMessage('Cancellation reason must be 5-500 characters')
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
  const { reason } = req.body;
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE consultation_bookings SET status = "cancelled", notes = ? WHERE id = ?',
        [reason, id],
        function(err) {
          if (err) reject(err);
          else if (this.changes === 0) reject(new Error('Consultation not found'));
          else resolve();
        }
      );
    });
    
    res.json({
      success: true,
      message: 'Consultation cancelled successfully'
    });
    
  } catch (error) {
    console.error('Consultation cancellation error:', error);
    if (error.message === 'Consultation not found') {
      res.status(404).json({ 
        success: false,
        error: 'Consultation not found' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to cancel consultation'
      });
    }
  } finally {
    db.close();
  }
});

// Sync consultation with calendar
router.post('/consultations/:id/sync-calendar', async (req, res) => {
  const { id } = req.params;
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    // Get consultation details
    const consultation = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM consultation_bookings WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else if (!row) reject(new Error('Consultation not found'));
          else resolve(row);
        }
      );
    });
    
    // Sync with Google Calendar if service is available
    if (googleCalendarService.calendar) {
      try {
        const eventDetails = {
          summary: `Legal Consultation - ${consultation.name}`,
          description: `Legal Matter: ${consultation.legal_matter}\nConsultation Type: ${consultation.consultation_type}`,
          start: {
            dateTime: `${consultation.preferred_date}T${consultation.preferred_time}:00`,
            timeZone: 'Asia/Kolkata'
          },
          end: {
            dateTime: `${consultation.preferred_date}T${consultation.preferred_time}:00`,
            timeZone: 'Asia/Kolkata'
          },
          attendees: [{ email: consultation.email }]
        };
        
        const event = await googleCalendarService.calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
          resource: eventDetails
        });
        
        // Update consultation with calendar event ID
        await new Promise((resolve, reject) => {
          db.run(
            'UPDATE consultation_bookings SET calendar_event_id = ?, meeting_status = "scheduled" WHERE id = ?',
            [event.data.id, id],
            function(err) {
              if (err) reject(err);
              else resolve();
            }
          );
        });
        
        res.json({
          success: true,
          message: 'Calendar synced successfully',
          data: { eventId: event.data.id }
        });
      } catch (calendarError) {
        console.error('Calendar sync error:', calendarError);
        res.status(500).json({
          success: false,
          error: 'Failed to sync with calendar',
          message: calendarError.message
        });
      }
    } else {
      res.status(503).json({
        success: false,
        error: 'Calendar service not available'
      });
    }
    
  } catch (error) {
    console.error('Calendar sync error:', error);
    if (error.message === 'Consultation not found') {
      res.status(404).json({ 
        success: false,
        error: 'Consultation not found' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to sync calendar'
      });
    }
  } finally {
    db.close();
  }
});

// Update contact query status
router.patch('/queries/:id', [
  body('status').isIn(['new', 'in_progress', 'resolved']).withMessage('Invalid status')
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
  const { status } = req.body;
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE contact_queries SET status = ?, responded_at = CURRENT_TIMESTAMP WHERE id = ?',
        [status, id],
        function(err) {
          if (err) reject(err);
          else if (this.changes === 0) reject(new Error('Query not found'));
          else resolve();
        }
      );
    });
    
    res.json({
      success: true,
      message: 'Query status updated successfully'
    });
    
  } catch (error) {
    console.error('Query update error:', error);
    if (error.message === 'Query not found') {
      res.status(404).json({ 
        success: false,
        error: 'Query not found' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to update query'
      });
    }
  } finally {
    db.close();
  }
});

// Manage available time slots
router.get('/time-slots', async (req, res) => {
  const { date } = req.query;
  
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    let query = 'SELECT * FROM available_slots';
    const params = [];
    
    if (date) {
      query += ' WHERE date = ?';
      params.push(date);
    } else {
      // Get slots for next 30 days
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateStr = futureDate.toISOString().split('T')[0];
      
      query += ' WHERE date BETWEEN ? AND ?';
      params.push(today, futureDateStr);
    }
    
    query += ' ORDER BY date, time_slot';
    
    const slots = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    res.json({
      success: true,
      data: { slots }
    });
    
  } catch (error) {
    console.error('Time slots fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch time slots'
    });
  } finally {
    db.close();
  }
});

// Update time slot
router.patch('/time-slots/:id', [
  body('isAvailable').optional().isBoolean().withMessage('isAvailable must be boolean')
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
  const { isAvailable } = req.body;
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE available_slots SET is_available = ? WHERE id = ?',
        [isAvailable ? 1 : 0, id],
        function(err) {
          if (err) reject(err);
          else if (this.changes === 0) reject(new Error('Time slot not found'));
          else resolve();
        }
      );
    });
    
    res.json({
      success: true,
      message: 'Time slot updated successfully'
    });
    
  } catch (error) {
    console.error('Time slot update error:', error);
    if (error.message === 'Time slot not found') {
      res.status(404).json({ 
        success: false,
        error: 'Time slot not found' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to update time slot'
      });
    }
  } finally {
    db.close();
  }
});

// Create time slot
router.post('/time-slots', [
  body('date').isISO8601().withMessage('Invalid date format'),
  body('timeSlot').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('duration').isInt({ min: 15, max: 180 }).withMessage('Duration must be 15-180 minutes'),
  body('officeLocation').isIn(['tis_hazari', 'preet_vihar']).withMessage('Invalid office location')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  
  const { date, timeSlot, duration, officeLocation } = req.body;
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    const slotId = await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO available_slots (date, time_slot, duration_minutes, office_location) VALUES (?, ?, ?, ?)',
        [date, timeSlot, duration, officeLocation],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
    
    res.status(201).json({
      success: true,
      message: 'Time slot created successfully',
      data: { slotId }
    });
    
  } catch (error) {
    console.error('Time slot creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create time slot'
    });
  } finally {
    db.close();
  }
});

// Bulk update time slots
router.post('/time-slots/bulk-update', [
  body('updates').isArray().withMessage('Updates must be an array'),
  body('updates.*.id').isInt().withMessage('Invalid slot ID'),
  body('updates.*.isAvailable').isBoolean().withMessage('isAvailable must be boolean')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  
  const { updates } = req.body;
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    await new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        let completed = 0;
        let hasError = false;
        
        updates.forEach((update) => {
          db.run(
            'UPDATE available_slots SET is_available = ? WHERE id = ?',
            [update.isAvailable ? 1 : 0, update.id],
            function(err) {
              if (err && !hasError) {
                hasError = true;
                db.run('ROLLBACK');
                reject(err);
                return;
              }
              
              completed++;
              if (completed === updates.length && !hasError) {
                db.run('COMMIT');
                resolve();
              }
            }
          );
        });
      });
    });
    
    res.json({
      success: true,
      message: `${updates.length} time slots updated successfully`
    });
    
  } catch (error) {
    console.error('Bulk time slot update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update time slots'
    });
  } finally {
    db.close();
  }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
  const { period = 30 } = req.query;
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    const analytics = await Promise.all([
      // Consultation trends
      new Promise((resolve, reject) => {
        db.all(`
          SELECT DATE(created_at) as date, COUNT(*) as count
          FROM consultation_bookings 
          WHERE created_at >= date('now', '-${period} days')
          GROUP BY DATE(created_at)
          ORDER BY date
        `, (err, rows) => {
          if (err) reject(err);
          else resolve({ consultationTrends: rows });
        });
      }),
      
      // Query trends
      new Promise((resolve, reject) => {
        db.all(`
          SELECT DATE(created_at) as date, COUNT(*) as count
          FROM contact_queries 
          WHERE created_at >= date('now', '-${period} days')
          GROUP BY DATE(created_at)
          ORDER BY date
        `, (err, rows) => {
          if (err) reject(err);
          else resolve({ queryTrends: rows });
        });
      }),
      
      // Popular consultation types
      new Promise((resolve, reject) => {
        db.all(`
          SELECT consultation_type, COUNT(*) as count
          FROM consultation_bookings 
          WHERE created_at >= date('now', '-${period} days')
          GROUP BY consultation_type
          ORDER BY count DESC
        `, (err, rows) => {
          if (err) reject(err);
          else resolve({ consultationTypes: rows });
        });
      }),
      
      // Office location distribution
      new Promise((resolve, reject) => {
        db.all(`
          SELECT office_location, COUNT(*) as count
          FROM consultation_bookings 
          WHERE created_at >= date('now', '-${period} days')
          GROUP BY office_location
          ORDER BY count DESC
        `, (err, rows) => {
          if (err) reject(err);
          else resolve({ officeDistribution: rows });
        });
      })
    ]);
    
    const analyticsData = analytics.reduce((acc, data) => ({ ...acc, ...data }), {});
    
    res.json({
      success: true,
      data: analyticsData
    });
    
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics data'
    });
  } finally {
    db.close();
  }
});

// Get audit log
router.get('/audit-log', async (req, res) => {
  const { page = 1, limit = 50, action, resourceType } = req.query;
  const offset = (page - 1) * limit;
  
  const db = new sqlite3.Database(DB_PATH);
  
  try {
    let query = 'SELECT * FROM audit_log';
    const params = [];
    const conditions = [];
    
    if (action) {
      conditions.push('action = ?');
      params.push(action);
    }
    
    if (resourceType) {
      conditions.push('resource_type = ?');
      params.push(resourceType);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    const logs = await new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    res.json({
      success: true,
      data: { logs }
    });
    
  } catch (error) {
    console.error('Audit log fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit log'
    });
  } finally {
    db.close();
  }
});

module.exports = router;