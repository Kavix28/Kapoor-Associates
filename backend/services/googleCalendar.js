const { google } = require('googleapis');
const moment = require('moment-timezone');

class GoogleCalendarService {
  constructor() {
    this.calendar = null;
    this.auth = null;
    this.initializeAuth();
  }

  initializeAuth() {
    try {
      // Check if using Service Account (recommended for production)
      if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH) {
        this.auth = new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH,
          scopes: ['https://www.googleapis.com/auth/calendar'],
          subject: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
        });
      } else if (process.env.GOOGLE_REFRESH_TOKEN) {
        // OAuth2 method
        this.auth = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_REDIRECT_URI
        );
        
        this.auth.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });
      } else {
        console.warn('Google Calendar credentials not configured. Calendar integration disabled.');
        return;
      }

      this.calendar = google.calendar({ version: 'v3', auth: this.auth });
      console.log('✅ Google Calendar service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Calendar service:', error);
    }
  }

  async createConsultationEvent(consultationData) {
    if (!this.calendar) {
      throw new Error('Google Calendar service not initialized');
    }

    try {
      const {
        clientName,
        companyName,
        email,
        phone,
        consultationType,
        date,
        time,
        officeLocation,
        legalMatter
      } = consultationData;

      // Parse date and time in Asia/Kolkata timezone
      const startDateTime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata');
      const endDateTime = startDateTime.clone().add(30, 'minutes');

      // Determine office address
      const officeAddresses = {
        'tis-hazari': process.env.OFFICE_1_ADDRESS || '257, Civil Wing, Tis Hazari Courts, Delhi – 110054',
        'preet-vihar': process.env.OFFICE_2_ADDRESS || '103, First Floor, Plot No. 6, LSC, Main Vikas Marg, New Rajdhani Enclave, Near Preet Vihar Metro Station, Delhi – 110092'
      };

      const selectedOfficeAddress = officeAddresses[officeLocation] || officeAddresses['tis-hazari'];
      
      // Create event description
      const description = this.createEventDescription({
        clientName,
        companyName,
        email,
        phone,
        consultationType,
        legalMatter,
        officeLocation
      });

      // Create calendar event
      const event = {
        summary: `Legal Consultation – Kapoor & Associates`,
        description,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'Asia/Kolkata'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'Asia/Kolkata'
        },
        location: consultationType === 'office' ? selectedOfficeAddress : 'Online Meeting',
        attendees: [
          { email: process.env.FIRM_EMAIL },
          { email: email, optional: true }
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 30 }       // 30 minutes before
          ]
        },
        conferenceData: consultationType === 'online' ? {
          createRequest: {
            requestId: `consultation-${Date.now()}`,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        } : undefined
      };

      const response = await this.calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        resource: event,
        conferenceDataVersion: consultationType === 'online' ? 1 : 0,
        sendUpdates: 'all'
      });

      console.log('✅ Calendar event created:', response.data.id);
      
      return {
        eventId: response.data.id,
        eventLink: response.data.htmlLink,
        meetingLink: response.data.conferenceData?.entryPoints?.[0]?.uri || null
      };

    } catch (error) {
      console.error('❌ Failed to create calendar event:', error);
      throw new Error(`Calendar event creation failed: ${error.message}`);
    }
  }

  createEventDescription({ clientName, companyName, email, phone, consultationType, legalMatter, officeLocation }) {
    const firmName = process.env.FIRM_NAME || 'Kapoor & Associates, Advocates & Legal Advisors';
    const advocate1 = process.env.ADVOCATE_1_NAME || 'Anuj Kapoor';
    const advocate2 = process.env.ADVOCATE_2_NAME || 'Kirti Kapoor';
    
    return `
LEGAL CONSULTATION - ${firmName}

CLIENT DETAILS:
• Name: ${clientName}
${companyName ? `• Company: ${companyName}` : ''}
• Email: ${email}
• Phone: ${phone}

CONSULTATION DETAILS:
• Type: ${consultationType === 'office' ? 'Office Meeting' : 'Online Meeting'}
• Duration: 30 minutes
• Office: ${officeLocation === 'tis-hazari' ? 'Tis Hazari Courts' : 'Preet Vihar Office'}

ADVOCATES:
• ${advocate1} - Founder & Principal Advocate
• ${advocate2} - Advocate

LEGAL MATTER:
${legalMatter}

CONFIDENTIALITY NOTICE:
This consultation is protected by attorney-client privilege and strict confidentiality protocols.

CONTACT:
${process.env.FIRM_PHONE_PRIMARY} | ${process.env.FIRM_PHONE_SECONDARY}
${process.env.FIRM_EMAIL}
    `.trim();
  }

  async updateConsultationEvent(eventId, updates) {
    if (!this.calendar) {
      throw new Error('Google Calendar service not initialized');
    }

    try {
      const response = await this.calendar.events.patch({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
        resource: updates,
        sendUpdates: 'all'
      });

      console.log('✅ Calendar event updated:', eventId);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to update calendar event:', error);
      throw new Error(`Calendar event update failed: ${error.message}`);
    }
  }

  async cancelConsultationEvent(eventId) {
    if (!this.calendar) {
      throw new Error('Google Calendar service not initialized');
    }

    try {
      await this.calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
        sendUpdates: 'all'
      });

      console.log('✅ Calendar event cancelled:', eventId);
      return true;
    } catch (error) {
      console.error('❌ Failed to cancel calendar event:', error);
      throw new Error(`Calendar event cancellation failed: ${error.message}`);
    }
  }

  async getCalendarEvents(startDate, endDate) {
    if (!this.calendar) {
      throw new Error('Google Calendar service not initialized');
    }

    try {
      const response = await this.calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        timeMin: moment.tz(startDate, 'Asia/Kolkata').toISOString(),
        timeMax: moment.tz(endDate, 'Asia/Kolkata').toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.data.items || [];
    } catch (error) {
      console.error('❌ Failed to fetch calendar events:', error);
      throw new Error(`Calendar events fetch failed: ${error.message}`);
    }
  }

  async checkSlotAvailability(date, time, duration = 30) {
    if (!this.calendar) {
      return true; // If calendar not configured, assume available
    }

    try {
      const startDateTime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD HH:mm', 'Asia/Kolkata');
      const endDateTime = startDateTime.clone().add(duration, 'minutes');

      const events = await this.getCalendarEvents(
        startDateTime.format('YYYY-MM-DD'),
        endDateTime.format('YYYY-MM-DD')
      );

      // Check for conflicts
      const hasConflict = events.some(event => {
        if (!event.start?.dateTime || !event.end?.dateTime) return false;
        
        const eventStart = moment(event.start.dateTime);
        const eventEnd = moment(event.end.dateTime);
        
        return (
          (startDateTime.isBefore(eventEnd) && endDateTime.isAfter(eventStart))
        );
      });

      return !hasConflict;
    } catch (error) {
      console.error('❌ Failed to check slot availability:', error);
      return true; // Assume available on error
    }
  }

  async generateOAuthUrl() {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('Google OAuth credentials not configured');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const scopes = ['https://www.googleapis.com/auth/calendar'];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });

    return url;
  }

  async exchangeCodeForTokens(code) {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('Google OAuth credentials not configured');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }
}

// Create singleton instance
const googleCalendarService = new GoogleCalendarService();

module.exports = googleCalendarService;