const express = require('express');
const { body, validationResult } = require('express-validator');
const moment = require('moment');
const { supabase } = require('../config/supabase');
const googleCalendarService = require('../services/googleCalendar');
const { createTransport } = require('nodemailer');

const router = express.Router();

// Email configuration
const transporter = createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Validation middleware
const validateConsultation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').matches(/^[\+]?[0-9\s\-\(\)]{10,20}$/).withMessage('Valid phone number required'),
  body('legalMatter').trim().isLength({ min: 10, max: 1000 }).withMessage('Legal matter must be 10-1000 characters'),
  body('consultationType').isIn(['office', 'online']).withMessage('Invalid consultation type'),
  body('officeLocation').optional().isIn(['tis_hazari', 'preet_vihar']).withMessage('Invalid office location'),
  body('preferredDate').isISO8601().withMessage('Valid date required'),
  body('preferredTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Valid time required')
];

// Get available time slots
router.get('/available-slots', async (req, res) => {
  try {
    const { date, consultationType = 'both' } = req.query;
    console.log('📅 Available slots requested:', { date, consultationType });
    
    let query = supabase
      .from('available_slots')
      .select('*')
      .eq('is_available', true);
    
    if (date) {
      query = query.eq('date', date);
    } else {
      // Get slots for next 30 days
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const futureDateStr = futureDate.toISOString().split('T')[0];
      
      query = query.gte('date', today).lte('date', futureDateStr);
    }
    
    if (consultationType !== 'both') {
      query = query.or(`consultation_type.eq.${consultationType},consultation_type.eq.both`);
    }
    
    const { data: slots, error } = await query.order('date').order('time_slot');
    
    if (error) {
      console.error('❌ Slots fetch error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch available slots'
      });
    }
    
    console.log(`📊 Found ${slots.length} available slots`);
    
    // Group slots by date
    const slotsByDate = {};
    slots.forEach(slot => {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = [];
      }
      slotsByDate[slot.date].push({
        time: slot.time_slot,
        duration: slot.duration_minutes,
        officeLocation: slot.office_location,
        consultationType: slot.consultation_type
      });
    });
    
    console.log(`📅 Grouped into ${Object.keys(slotsByDate).length} dates`);
    
    res.json({
      success: true,
      data: {
        availableSlots: slotsByDate,
        totalSlots: slots.length
      }
    });
    
  } catch (error) {
    console.error('❌ Available slots error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available slots'
    });
  }
});

// Book consultation
router.post('/book', validateConsultation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  
  const {
    name,
    companyName,
    email,
    phone,
    legalMatter,
    consultationType,
    officeLocation = 'tis_hazari',
    preferredDate,
    preferredTime
  } = req.body;
  
  const clientIP = req.ip || req.connection.remoteAddress;
  
  try {
    // Initialize date and time variables first
    const dateStr = moment(preferredDate).format('YYYY-MM-DD');
    const timeStr = preferredTime;
    
    // Check slot availability with Google Calendar (with error handling)
    try {
      const isSlotAvailable = await googleCalendarService.checkSlotAvailability(
        dateStr, 
        timeStr, 
        30 // 30 minutes duration
      );
      
      if (!isSlotAvailable) {
        return res.status(409).json({
          success: false,
          error: 'Time slot unavailable',
          message: 'The selected time slot conflicts with existing appointments. Please choose another time.',
          action: 'refresh_slots'
        });
      }
    } catch (calendarError) {
      console.warn('⚠️ Google Calendar check failed, proceeding with booking:', calendarError.message);
      // Continue with booking even if calendar check fails
    }
    
    // Check if the time slot is still available in database
    const { data: slotCheck, error: slotError } = await supabase
      .from('available_slots')
      .select('*')
      .eq('date', dateStr)
      .eq('time_slot', timeStr)
      .eq('office_location', officeLocation)
      .eq('is_available', true)
      .or(`consultation_type.eq.${consultationType},consultation_type.eq.both`);
    
    if (slotError || !slotCheck || slotCheck.length === 0) {
      console.log('❌ Slot check failed:', { slotError, dateStr, timeStr, consultationType, officeLocation, slotsFound: slotCheck?.length });
      return res.status(409).json({
        success: false,
        error: 'Time slot unavailable',
        message: 'The selected time slot is no longer available. Please choose another time.',
        action: 'refresh_slots'
      });
    }
    
    // Check for duplicate booking (same email, date, time)
    const { data: existingBooking } = await supabase
      .from('consultation_bookings')
      .select('*')
      .eq('email', email)
      .eq('preferred_date', dateStr)
      .eq('preferred_time', timeStr)
      .neq('status', 'cancelled')
      .single();
    
    if (existingBooking) {
      return res.status(409).json({
        success: false,
        error: 'Duplicate booking',
        message: 'You already have a consultation booked for this time slot.',
        bookingId: existingBooking.id
      });
    }
    
    // Create consultation booking
    const { data: booking, error: bookingError } = await supabase
      .from('consultation_bookings')
      .insert([{
        name,
        company_name: companyName,
        email,
        phone,
        legal_matter: legalMatter,
        consultation_type: consultationType,
        office_location: officeLocation,
        preferred_date: dateStr,
        preferred_time: timeStr,
        ip_address: clientIP
      }])
      .select()
      .single();
    
    if (bookingError) {
      console.error('❌ Booking creation error:', bookingError);
      return res.status(500).json({
        success: false,
        error: 'Failed to create booking'
      });
    }
    
    // Try to create Google Calendar event
    let calendarEventId = null;
    let meetingStatus = 'scheduled';
    
    try {
      if (googleCalendarService.calendar) {
        const eventDetails = {
          summary: `Legal Consultation - ${name}`,
          description: `Legal Matter: ${legalMatter}\nConsultation Type: ${consultationType}\nOffice: ${officeLocation}`,
          start: {
            dateTime: `${dateStr}T${timeStr}:00`,
            timeZone: 'Asia/Kolkata'
          },
          end: {
            dateTime: moment(`${dateStr}T${timeStr}:00`).add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
            timeZone: 'Asia/Kolkata'
          },
          attendees: [{ email }]
        };
        
        const event = await googleCalendarService.calendar.events.insert({
          calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
          resource: eventDetails
        });
        
        calendarEventId = event.data.id;
        meetingStatus = 'scheduled';
        
        // Update booking with calendar event ID
        await supabase
          .from('consultation_bookings')
          .update({
            calendar_event_id: calendarEventId,
            meeting_status: meetingStatus
          })
          .eq('id', booking.id);
      }
    } catch (calendarError) {
      console.error('⚠️ Calendar event creation failed:', calendarError);
      meetingStatus = 'calendar_pending';
    }
    
    // Send confirmation email
    try {
      const emailHtml = `
        <h2>Consultation Booking Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Your consultation has been successfully booked with Kapoor & Associates.</p>
        
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Date:</strong> ${moment(dateStr).format('MMMM DD, YYYY')}</li>
          <li><strong>Time:</strong> ${timeStr}</li>
          <li><strong>Type:</strong> ${consultationType === 'office' ? 'Office Visit' : 'Online Consultation'}</li>
          <li><strong>Office:</strong> ${officeLocation === 'tis_hazari' ? 'Tis Hazari Courts' : 'Preet Vihar'}</li>
          <li><strong>Legal Matter:</strong> ${legalMatter}</li>
        </ul>
        
        <p>We will contact you shortly to confirm the consultation details.</p>
        
        <p>Best regards,<br>Kapoor & Associates<br>Advocates & Legal Advisors</p>
      `;
      
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Consultation Booking Confirmation - Kapoor & Associates',
        html: emailHtml
      });
      
      // Send notification to firm
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.FIRM_EMAIL,
        subject: 'New Consultation Booking',
        html: `
          <h2>New Consultation Booking</h2>
          <p><strong>Client:</strong> ${name}</p>
          <p><strong>Company:</strong> ${companyName || 'N/A'}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Date:</strong> ${moment(dateStr).format('MMMM DD, YYYY')}</p>
          <p><strong>Time:</strong> ${timeStr}</p>
          <p><strong>Type:</strong> ${consultationType}</p>
          <p><strong>Office:</strong> ${officeLocation}</p>
          <p><strong>Legal Matter:</strong> ${legalMatter}</p>
          <p><strong>Calendar Event:</strong> ${calendarEventId ? 'Created' : 'Pending'}</p>
        `
      });
      
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError);
    }
    
    res.status(201).json({
      success: true,
      message: 'Consultation booked successfully',
      data: {
        bookingId: booking.id,
        confirmationNumber: booking.id.slice(-8).toUpperCase(),
        scheduledDate: dateStr,
        scheduledTime: timeStr,
        consultationType,
        officeLocation,
        calendarEventCreated: !!calendarEventId,
        meetingStatus
      }
    });
    
  } catch (error) {
    console.error('❌ Consultation booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to book consultation',
      message: 'Please try again or contact us directly for assistance'
    });
  }
});

// Get booking details
router.get('/booking/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: booking, error } = await supabase
      .from('consultation_bookings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        companyName: booking.company_name,
        legalMatter: booking.legal_matter,
        consultationType: booking.consultation_type,
        officeLocation: booking.office_location,
        preferredDate: booking.preferred_date,
        preferredTime: booking.preferred_time,
        status: booking.status,
        meetingStatus: booking.meeting_status,
        calendarEventId: booking.calendar_event_id,
        createdAt: booking.created_at
      }
    });
    
  } catch (error) {
    console.error('❌ Booking fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking details'
    });
  }
});

module.exports = router;