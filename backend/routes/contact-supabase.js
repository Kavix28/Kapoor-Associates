const express = require('express');
const { body, validationResult } = require('express-validator');
const { supabase } = require('../config/supabase');
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
const validateContact = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Valid phone number required'),
  body('companyName').optional().trim().isLength({ max: 200 }).withMessage('Company name too long'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters')
];

// Submit contact form
router.post('/submit', validateContact, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { name, email, phone, companyName, message } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;

  try {
    console.log('📧 Contact form submission:', { name, email, companyName });

    // Create contact query in Supabase
    const { data: query, error } = await supabase
      .from('contact_queries')
      .insert([{
        name,
        email,
        phone,
        company_name: companyName,
        message,
        ip_address: clientIP
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Contact query creation error:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to submit contact form'
      });
    }

    // Send confirmation email to user
    try {
      const userEmailHtml = `
        <h2>Thank you for contacting Kapoor & Associates</h2>
        <p>Dear ${name},</p>
        <p>We have received your inquiry and will respond within 24 hours.</p>
        
        <h3>Your Message:</h3>
        <p>${message}</p>
        
        <h3>Contact Information:</h3>
        <p>📧 Email: kapoorandassociatesadv@gmail.com</p>
        <p>📞 Phone: +91 98916 56411, +91 98103 16427</p>
        
        <p>Best regards,<br>Kapoor & Associates<br>Advocates & Legal Advisors</p>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Thank you for contacting Kapoor & Associates',
        html: userEmailHtml
      });

      // Send notification to firm
      const firmEmailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${companyName || 'Not provided'}</p>
        <p><strong>IP Address:</strong> ${clientIP}</p>
        
        <h3>Message:</h3>
        <p>${message}</p>
        
        <p><strong>Query ID:</strong> ${query.id}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.FIRM_EMAIL,
        subject: 'New Contact Form Submission',
        html: firmEmailHtml
      });

    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        queryId: query.id,
        submittedAt: query.created_at
      }
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form',
      message: 'Please try again or contact us directly'
    });
  }
});

// Get firm information
router.get('/info', async (req, res) => {
  try {
    console.log('📞 Contact info requested');

    // Get advocates from Supabase
    const { data: advocates, error } = await supabase
      .from('advocates')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('❌ Advocates fetch error:', error);
    }

    const firmInfo = {
      firm: {
        name: process.env.FIRM_NAME || "Kapoor & Associates, Advocates & Legal Advisors",
        email: process.env.FIRM_EMAIL || "kapoorandassociatesadv@gmail.com",
        phonePrimary: process.env.FIRM_PHONE_PRIMARY || "+91 98916 56411",
        phoneSecondary: process.env.FIRM_PHONE_SECONDARY || "+91 98103 16427",
        specialization: process.env.ADVOCATE_SPECIALIZATION || "Family Law, Property Disputes, Civil & Criminal Litigation, Commercial Law, Legal Advisory",
        court: process.env.ADVOCATE_COURT || "Delhi High Court"
      },
      advocates: advocates || [
        {
          name: process.env.ADVOCATE_1_NAME || "Anuj Kapoor",
          title: process.env.ADVOCATE_1_TITLE || "Founder & Principal Advocate",
          experience: process.env.ADVOCATE_1_EXPERIENCE || "20+ Years"
        },
        {
          name: process.env.ADVOCATE_2_NAME || "Kirti Kapoor",
          title: process.env.ADVOCATE_2_TITLE || "Advocate & Core Partner",
          experience: process.env.ADVOCATE_2_EXPERIENCE || "10+ Years"
        }
      ],
      offices: [
        {
          name: process.env.OFFICE_1_NAME || "Tis Hazari Courts Office",
          address: process.env.OFFICE_1_ADDRESS || "257, Civil Wing, Tis Hazari Courts, Delhi – 110054",
          type: "primary"
        },
        {
          name: process.env.OFFICE_2_NAME || "Preet Vihar Office", 
          address: process.env.OFFICE_2_ADDRESS || "103, First Floor, Plot No. 6, LSC, Main Vikas Marg, New Rajdhani Enclave, Near Preet Vihar Metro Station, Delhi – 110092",
          type: "branch"
        }
      ],
      practiceAreas: [
        "Family & Divorce Law",
        "Property & Land Disputes",
        "Civil & Criminal Litigation",
        "Consumer & Labor Disputes",
        "Commercial & Business Law",
        "Legal Advisory Services"
      ],
      officeHours: {
        weekdays: "Monday - Friday: 10:00 AM - 6:00 PM",
        weekend: "Saturday & Sunday: Closed"
      },
      consultationInfo: {
        duration: "30 minutes",
        mode: "Office & Online",
        workingDays: "Monday - Friday",
        timeSlots: "11:00 AM - 5:00 PM"
      },
      disclaimer: process.env.BAR_COUNCIL_DISCLAIMER || "As per the rules of the Bar Council of India, this website does not seek to advertise or solicit work in any manner."
    };

    res.json({
      success: true,
      data: firmInfo
    });

  } catch (error) {
    console.error('❌ Contact info error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact information'
    });
  }
});

// Get specific contact query (for admin)
router.get('/query/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: query, error } = await supabase
      .from('contact_queries')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !query) {
      return res.status(404).json({
        success: false,
        error: 'Query not found'
      });
    }

    res.json({
      success: true,
      data: {
        id: query.id,
        name: query.name,
        email: query.email,
        phone: query.phone,
        companyName: query.company_name,
        message: query.message,
        status: query.status,
        createdAt: query.created_at,
        respondedAt: query.responded_at
      }
    });

  } catch (error) {
    console.error('❌ Query fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch query details'
    });
  }
});

module.exports = router;