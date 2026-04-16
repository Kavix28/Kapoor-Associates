# Kapoor & Associates - Full Stack Legal Platform Setup Guide

## 🏗️ System Architecture

This is a complete production-ready legal platform featuring:

### Backend (Node.js/Express)
- **RESTful API** with JWT authentication
- **SQLite Database** with comprehensive schema
- **AI-powered Chatbot** with legal knowledge base
- **Email Integration** for notifications
- **Rate Limiting** and security middleware
- **Admin Dashboard** APIs

### Frontend (React/Tailwind)
- **Dark Premium Theme** optimized for corporate clients
- **Responsive Design** across all devices
- **SEO Optimized** with structured data
- **AI Chatbot Interface** with consultation escalation
- **Consultation Booking System** with calendar integration
- **Admin Panel** for managing bookings and queries

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### 1. Install Dependencies

```bash
# Install root dependencies
npm run install-all

# Or install manually:
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit backend/.env with your configuration:
# - Database path
# - JWT secret (generate a strong one)
# - Email credentials (Gmail/SMTP)
# - Admin credentials
# - Firm information
```

### 3. Initialize Database

```bash
# Initialize SQLite database with tables and default data
cd backend
npm run init-db
```

### 4. Start Development Servers

```bash
# Start both backend and frontend (from root directory)
npm run dev

# Or start individually:
# Backend: npm run server
# Frontend: npm run client
```

### 5. Access the Platform

- **Website**: http://localhost:3000
- **API**: http://localhost:5000
- **Admin Panel**: http://localhost:3000/admin/login

**Default Admin Credentials:**
- Email: admin@kapoorassociates.com
- Password: SecureAdminPassword123!

## 🔧 Configuration

### Backend Configuration (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_PATH=./database/kapoor_associates.db

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@kapoorassociates.com

# Admin Account
ADMIN_EMAIL=admin@kapoorassociates.com
ADMIN_PASSWORD=SecureAdminPassword123!

# Firm Details
FIRM_NAME=Kapoor & Associates
FIRM_EMAIL=info@kapoorassociates.com
FIRM_PHONE=+91-XXXXXXXXXX
FIRM_ADDRESS=High Court Complex, New Delhi, India
```

### Frontend Configuration

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SITE_URL=http://localhost:3000
```

## 🤖 AI Chatbot Features

### Legal Knowledge Base
- **Corporate Law** concepts and procedures
- **High Court Practice** information
- **Contract Law** basics
- **Compliance** requirements
- **Consultation** guidance

### Smart Limitations
- **3 advice responses** per session
- **Automatic escalation** to consultation booking
- **Disclaimer** on every response
- **No case-specific advice** policy

### Conversation Flow
1. User asks legal question
2. Bot provides general information + disclaimer
3. After 3 advice responses → locks session
4. Redirects to consultation booking

## 📅 Consultation System

### Features
- **Calendar-based** slot selection
- **Office/Online** consultation options
- **Email confirmations** to client and firm
- **Admin management** of bookings
- **Time slot** availability management

### Booking Process
1. Client selects available time slot
2. Fills consultation form with company details
3. System checks slot availability
4. Creates booking and sends confirmations
5. Admin receives notification

## 🛡️ Security Features

### Authentication & Authorization
- **JWT tokens** with expiration
- **Role-based access** (admin only)
- **Token refresh** mechanism
- **Secure password** hashing (bcrypt)

### API Security
- **Rate limiting** (100 requests/15min)
- **Input validation** and sanitization
- **CORS protection**
- **Helmet.js** security headers
- **SQL injection** prevention

### Data Protection
- **Attorney-client privilege** compliance
- **GDPR-style** privacy handling
- **Secure data storage**
- **Audit trails** for admin actions

## 📊 Admin Dashboard

### Capabilities
- **View/manage** consultation bookings
- **Respond to** contact queries
- **Monitor** chatbot conversations
- **Manage** available time slots
- **Analytics** dashboard with key metrics

### Access Control
- **Secure login** with JWT
- **Session management**
- **Password change** functionality
- **Activity logging**

## 🎨 Design System

### Dark Premium Theme
- **Deep charcoal/black** backgrounds
- **Navy blue** highlights (#1a2b4c)
- **Gold accents** (#d4af37)
- **Professional typography** (Playfair Display + Inter)

### Responsive Design
- **Mobile-first** approach
- **Tablet optimization**
- **Desktop enhancement**
- **Touch-friendly** interfaces

## 📈 SEO Optimization

### Technical SEO
- **Semantic HTML5** structure
- **Meta tags** optimization
- **Structured data** (JSON-LD)
- **Open Graph** tags
- **Twitter Cards**

### Content SEO
- **Keyword optimization** for corporate law terms
- **H1-H3 hierarchy**
- **Alt text** for images
- **Internal linking** structure

## 🚀 Production Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use strong JWT secret
3. Configure production database
4. Set up SSL certificates
5. Configure email service

### Build Process
```bash
# Build frontend
cd frontend
npm run build

# Start production server
cd ../backend
npm start
```

### Recommended Hosting
- **Backend**: VPS/Cloud server (DigitalOcean, AWS)
- **Database**: SQLite (or upgrade to PostgreSQL)
- **Frontend**: CDN (Netlify, Vercel)
- **Email**: Professional SMTP service

## 🔍 Testing

### Manual Testing Checklist
- [ ] Website loads and navigation works
- [ ] Chatbot responds correctly
- [ ] Consultation booking works
- [ ] Email notifications sent
- [ ] Admin login and dashboard
- [ ] Mobile responsiveness
- [ ] Form validations
- [ ] Error handling

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Test chatbot
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is corporate law?", "sessionId": "test-123"}'
```

## 📞 Support & Maintenance

### Regular Tasks
- **Database backups**
- **Security updates**
- **Performance monitoring**
- **Email deliverability**
- **SSL certificate renewal**

### Monitoring
- **Server uptime**
- **API response times**
- **Error rates**
- **User engagement**
- **Consultation conversion**

## 🔒 Legal Compliance

### Bar Council Compliance
- **No advertising** language
- **Proper disclaimers** on all pages
- **No outcome guarantees**
- **Attorney-client privilege** protection

### Privacy & Data
- **Privacy Policy** implementation
- **Terms of Use** enforcement
- **Data retention** policies
- **Consent management**

## 📋 Troubleshooting

### Common Issues

**Database Connection Error:**
```bash
# Reinitialize database
cd backend
npm run init-db
```

**Email Not Sending:**
- Check SMTP credentials
- Verify app password (Gmail)
- Test email configuration

**Chatbot Not Responding:**
- Check API connection
- Verify rate limiting
- Review server logs

**Admin Login Issues:**
- Verify JWT secret
- Check admin credentials
- Clear browser cache

## 🎯 Next Steps

### Enhancements
- **Payment integration** for consultation fees
- **Document upload** system
- **Client portal** with case tracking
- **Multi-language** support
- **Advanced analytics**

### Scaling
- **PostgreSQL** database upgrade
- **Redis** for session management
- **Load balancing**
- **CDN integration**
- **Microservices** architecture

---

## 📞 Technical Support

For technical issues or customization requests:
- Review logs in `backend/logs/`
- Check database in `backend/database/`
- Monitor API responses
- Test email configuration

**Platform Status:** ✅ Production Ready
**Security Level:** 🔒 High
**Compliance:** ⚖️ Bar Council Compliant