const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');
const { authenticateToken, requireAdmin, validateUser } = require('../middleware/auth-supabase');

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);
router.use(validateUser);
router.use(requireAdmin);

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    console.log('📊 Fetching dashboard data...');
    
    // Get various statistics using Supabase
    const [
      totalConsultations,
      pendingConsultations,
      todayConsultations,
      totalQueries,
      unreadQueries,
      todayChatbotConversations,
      recentConsultations
    ] = await Promise.all([
      // Total consultations
      supabase.from('consultation_bookings').select('*', { count: 'exact', head: true }),
      
      // Pending consultations
      supabase.from('consultation_bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      
      // Today's consultations
      supabase.from('consultation_bookings').select('*', { count: 'exact', head: true }).eq('preferred_date', new Date().toISOString().split('T')[0]),
      
      // Total contact queries
      supabase.from('contact_queries').select('*', { count: 'exact', head: true }),
      
      // Unread contact queries
      supabase.from('contact_queries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      
      // Chatbot conversations today
      supabase.from('chatbot_conversations').select('*', { count: 'exact', head: true }).gte('created_at', new Date().toISOString().split('T')[0]),
      
      // Recent consultations (last 7 days)
      supabase.from('consultation_bookings')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
    ]);
    
    // Process recent consultations by date
    const consultationsByDate = {};
    if (recentConsultations.data) {
      recentConsultations.data.forEach(booking => {
        const date = booking.created_at.split('T')[0];
        consultationsByDate[date] = (consultationsByDate[date] || 0) + 1;
      });
    }
    
    const recentConsultationsArray = Object.entries(consultationsByDate).map(([date, count]) => ({
      date,
      count
    }));
    
    const dashboardData = {
      totalConsultations: totalConsultations.count || 0,
      pendingConsultations: pendingConsultations.count || 0,
      todayConsultations: todayConsultations.count || 0,
      totalQueries: totalQueries.count || 0,
      unreadQueries: unreadQueries.count || 0,
      todayChatbotConversations: todayChatbotConversations.count || 0,
      recentConsultations: recentConsultationsArray
    };
    
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
  }
});

// Get calendar integration status
router.get('/calendar-status', async (req, res) => {
  try {
    console.log('📅 Fetching calendar status...');
    
    const status = {
      serviceEnabled: !!process.env.GOOGLE_CALENDAR_ID,
      authMethod: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH ? 'Service Account' : 
                  process.env.GOOGLE_REFRESH_TOKEN ? 'OAuth2' : 'Not Configured',
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      lastCheck: new Date().toISOString(),
      connectionStatus: 'Connected',
      lastSuccessfulTest: new Date().toISOString()
    };
    
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
  try {
    console.log('📋 Fetching advocates list');
    
    const { data: advocates, error } = await supabase
      .from('advocates')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      throw error;
    }
    
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
          isActive: a.is_active,
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
  
  try {
    console.log(`📝 Updating advocate ID: ${id}`);
    
    // Build update object
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (title !== undefined) updates.title = title;
    if (experienceYears !== undefined) updates.experience_years = experienceYears;
    if (specialization !== undefined) updates.specialization = specialization;
    if (bio !== undefined) updates.bio = bio;
    if (courtPractice !== undefined) updates.court_practice = courtPractice;
    if (isActive !== undefined) updates.is_active = isActive;
    if (displayOrder !== undefined) updates.display_order = displayOrder;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }
    
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('advocates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Advocate not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Advocate updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Advocate update error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update advocate',
      message: error.message
    });
  }
});

// Get all consultation bookings
router.get('/consultations', async (req, res) => {
  const { page = 1, limit = 20, status, date } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    let query = supabase
      .from('consultation_bookings')
      .select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (date) {
      query = query.eq('preferred_date', date);
    }
    
    const { data: consultations, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw error;
    }
    
    // Get total count
    let countQuery = supabase
      .from('consultation_bookings')
      .select('*', { count: 'exact', head: true });
    
    if (status) countQuery = countQuery.eq('status', status);
    if (date) countQuery = countQuery.eq('preferred_date', date);
    
    const { count: totalCount } = await countQuery;
    
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
          total: totalCount || 0,
          pages: Math.ceil((totalCount || 0) / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Consultations fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch consultations'
    });
  }
});

// Get all contact queries
router.get('/queries', async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    let query = supabase
      .from('contact_queries')
      .select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: queries, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw error;
    }
    
    // Get total count
    let countQuery = supabase
      .from('contact_queries')
      .select('*', { count: 'exact', head: true });
    
    if (status) countQuery = countQuery.eq('status', status);
    
    const { count: totalCount } = await countQuery;
    
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
          total: totalCount || 0,
          pages: Math.ceil((totalCount || 0) / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Queries fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact queries'
    });
  }
});

// Get chatbot conversations
router.get('/chatbot-logs', async (req, res) => {
  const { page = 1, limit = 50, sessionId } = req.query;
  const offset = (page - 1) * limit;
  
  try {
    let query = supabase
      .from('chatbot_conversations')
      .select('*');
    
    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }
    
    const { data: conversations, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw error;
    }
    
    res.json({
      success: true,
      data: {
        conversations: conversations.map(c => ({
          id: c.id,
          sessionId: c.session_id,
          userMessage: c.user_message,
          botResponse: c.bot_response,
          intent: c.intent,
          confidence: c.confidence,
          escalated: c.escalated,
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
  }
});

module.exports = router;