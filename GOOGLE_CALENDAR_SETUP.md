# Google Calendar Integration Setup Guide

This guide will help you set up automatic Google Calendar integration for consultation bookings.

## Overview

The system supports two authentication methods:
1. **Service Account** (Recommended for production)
2. **OAuth2** (Good for development/testing)

## Method 1: Service Account Setup (Recommended)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

### Step 2: Create Service Account
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in service account details:
   - Name: `kapoor-calendar-service`
   - Description: `Service account for Kapoor & Associates calendar integration`
4. Click "Create and Continue"
5. Skip role assignment (click "Continue")
6. Click "Done"

### Step 3: Generate Service Account Key
1. Click on the created service account
2. Go to "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Select "JSON" format
5. Download the key file
6. Save it as `google-service-account.json` in your backend folder

### Step 4: Share Calendar with Service Account
1. Open Google Calendar
2. Go to calendar settings (gear icon)
3. Select the calendar you want to use
4. Go to "Share with specific people"
5. Add the service account email (found in the JSON file)
6. Give "Make changes to events" permission

### Step 5: Update Environment Variables
Add these to your `.env` file:

```env
# Google Calendar - Service Account Method
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./google-service-account.json
GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
```

## Method 2: OAuth2 Setup (Alternative)

### Step 1: Create OAuth2 Credentials
1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Select "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:5000/api/calendar/oauth/callback` (development)
   - `https://your-domain.com/api/calendar/oauth/callback` (production)

### Step 2: Get Refresh Token
1. Use the OAuth2 playground or run the setup script:

```bash
cd backend
node -e "
const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'http://localhost:5000/api/calendar/oauth/callback'
);

const scopes = ['https://www.googleapis.com/auth/calendar'];
const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('Visit this URL:', url);
"
```

2. Visit the URL, authorize the application
3. Get the authorization code from the callback
4. Exchange it for tokens:

```bash
node -e "
const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'http://localhost:5000/api/calendar/oauth/callback'
);

oauth2Client.getToken('AUTHORIZATION_CODE').then(({tokens}) => {
  console.log('Refresh Token:', tokens.refresh_token);
});
"
```

### Step 3: Update Environment Variables
Add these to your `.env` file:

```env
# Google Calendar - OAuth2 Method
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/calendar/oauth/callback
GOOGLE_REFRESH_TOKEN=your-refresh-token
GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
```

## Testing the Integration

1. Run the test script:
```bash
cd backend
node test-calendar.js
```

2. Check the admin dashboard for calendar integration status

3. Try booking a consultation through the frontend

## Environment Variables Reference

```env
# Required for both methods
GOOGLE_CALENDAR_ID=primary  # or specific calendar ID

# Service Account Method (Recommended)
GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./google-service-account.json

# OAuth2 Method (Alternative)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/calendar/oauth/callback
GOOGLE_REFRESH_TOKEN=your-refresh-token

# Firm Information (for calendar events)
FIRM_NAME=Kapoor & Associates, Advocates & Legal Advisors
FIRM_EMAIL=kapoorandassociatesadv@gmail.com
FIRM_PHONE_PRIMARY=+91 98916 56411
FIRM_PHONE_SECONDARY=+91 98103 16427

# Office Locations
OFFICE_1_ADDRESS=257, Civil Wing, Tis Hazari Courts, Delhi – 110054
OFFICE_2_ADDRESS=103, First Floor, Plot No. 6, LSC, Main Vikas Marg, New Rajdhani Enclave, Near Preet Vihar Metro Station, Delhi – 110092

# Advocates Information
ADVOCATE_1_NAME=Anuj Kapoor
ADVOCATE_1_TITLE=Founder & Principal Advocate
ADVOCATE_1_EXPERIENCE=20+ Years
ADVOCATE_2_NAME=Kirti Kapoor
ADVOCATE_2_TITLE=Advocate
```

## Features

### Automatic Calendar Events
- Creates calendar events automatically when consultations are booked
- Includes client details, office location, and confidentiality notice
- Sets appropriate reminders (1 day and 30 minutes before)
- Generates meeting links for online consultations

### Slot Availability Checking
- Checks Google Calendar for conflicts before allowing bookings
- Prevents double-booking automatically
- Respects existing calendar events

### Admin Dashboard Integration
- Shows calendar integration status
- Displays which bookings have calendar events
- Allows manual calendar sync for failed bookings
- Provides calendar connection diagnostics

### Email Integration
- Includes calendar event links in confirmation emails
- Shows meeting details and office locations
- Provides meeting links for online consultations

## Troubleshooting

### Common Issues

1. **"Calendar service not initialized"**
   - Check environment variables are set correctly
   - Verify service account key file exists and is valid
   - Ensure Google Calendar API is enabled

2. **"Calendar event creation failed"**
   - Check calendar sharing permissions
   - Verify service account has "Make changes to events" permission
   - Check if calendar ID is correct

3. **"Slot availability check failed"**
   - Usually non-critical, booking will still work
   - Check calendar API quotas
   - Verify authentication credentials

### Testing Commands

```bash
# Test calendar integration
cd backend
node test-calendar.js

# Check environment variables
node -e "console.log(process.env.GOOGLE_CALENDAR_ID)"

# Test database connection
node scripts/initDatabase.js
```

## Security Notes

- Keep service account key files secure and never commit to version control
- Use environment variables for all sensitive configuration
- Regularly rotate service account keys
- Monitor API usage and quotas
- Use HTTPS in production for OAuth2 callbacks

## Support

If you encounter issues:
1. Check the admin dashboard calendar status
2. Review server logs for error messages
3. Test with the provided test script
4. Verify Google Cloud Console settings
5. Check calendar sharing permissions