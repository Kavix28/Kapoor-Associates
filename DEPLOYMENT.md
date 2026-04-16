# Kapoor & Associates - Production Deployment Guide

## 🚀 Complete Production-Ready Deployment

This guide covers deploying the full-stack Kapoor & Associates legal platform to production with Vercel (frontend) and AWS/Railway (backend).

## 📋 Pre-Deployment Checklist

### ✅ Code Completion Status
- [x] **Backend API** - Complete with all endpoints
- [x] **Frontend React App** - Complete with all pages
- [x] **AI Chatbot** - Implemented with 2-response limit
- [x] **Consultation Booking** - Full system with email notifications
- [x] **Admin Dashboard** - Complete management system
- [x] **Database Schema** - SQLite with production-ready structure
- [x] **Security** - JWT auth, rate limiting, input validation
- [x] **SEO Optimization** - Meta tags, structured data, sitemap
- [x] **Bar Council Compliance** - All disclaimers and legal notices

### 🔧 Environment Configuration

#### Backend Environment Variables (.env)
```env
# Production Configuration
NODE_ENV=production
PORT=5000

# Database (Use PostgreSQL for production)
DATABASE_URL=postgresql://username:password@host:port/database
# OR SQLite for smaller deployments
DB_PATH=./database/kapoor_associates.db

# Security
JWT_SECRET=your-super-secure-jwt-secret-256-bits-minimum

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=kapoorandassociatesadv@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=kapoorandassociatesadv@gmail.com

# Admin Credentials
ADMIN_EMAIL=admin@kapoorassociates.com
ADMIN_PASSWORD=SecureProductionPassword123!

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CHATBOT_RATE_LIMIT=20

# CORS Origins
CORS_ORIGINS=https://kapoorassociates.vercel.app,https://www.kapoorassociates.com

# Firm Information (EXACT DETAILS)
FIRM_NAME=Kapoor & Associates
FIRM_EMAIL=kapoorandassociatesadv@gmail.com
FIRM_PHONE_PRIMARY=+91 9891656411
FIRM_PHONE_SECONDARY=+91 9810316427
FIRM_ADDRESS=Delhi High Court Complex, New Delhi, India
FIRM_CITY=Delhi
FIRM_STATE=Delhi

# Advocate Information
ADVOCATE_NAME=Anuj Kapoor
ADVOCATE_TITLE=Founder & Principal Advocate
ADVOCATE_EXPERIENCE=20 Years
ADVOCATE_COURT=Delhi High Court
ADVOCATE_SPECIALIZATION=Corporate & Commercial Law

# Legal Compliance
BAR_COUNCIL_DISCLAIMER=This website does not seek to advertise or solicit work in any manner as per Bar Council of India rules. Information provided is for general purposes only.
CHATBOT_DISCLAIMER=This chatbot provides general legal information and does not constitute legal advice or create a lawyer-client relationship.
```

#### Frontend Environment Variables (.env)
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_SITE_URL=https://kapoorassociates.vercel.app
```

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Update package.json build script:**
```json
{
  "scripts": {
    "build": "react-scripts build && cp build/index.html build/404.html"
  }
}
```

2. **Create vercel.json in frontend directory:**
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy from frontend directory:**
```bash
cd frontend
vercel --prod
```

4. **Configure Environment Variables in Vercel Dashboard:**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all frontend environment variables

5. **Custom Domain Setup:**
   - Add custom domain in Vercel Dashboard
   - Configure DNS records with your domain provider

## 🖥️ Backend Deployment Options

### Option 1: Railway (Recommended)

1. **Create Railway Account:** https://railway.app

2. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

3. **Login and Deploy:**
```bash
cd backend
railway login
railway init
railway up
```

4. **Configure Environment Variables:**
   - Go to Railway Dashboard → Project → Variables
   - Add all backend environment variables

5. **Database Setup:**
   - Add PostgreSQL service in Railway
   - Update DATABASE_URL environment variable

### Option 2: AWS EC2

1. **Launch EC2 Instance:**
   - Ubuntu 20.04 LTS
   - t3.micro or larger
   - Configure security groups (ports 22, 80, 443, 5000)

2. **Server Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
```

3. **Deploy Application:**
```bash
# Clone repository
git clone <your-repo-url>
cd kapoor-associates-platform/backend

# Install dependencies
npm install --production

# Create production environment file
sudo nano .env
# Add all environment variables

# Initialize database
npm run init-db

# Start with PM2
pm2 start server.js --name "kapoor-backend"
pm2 startup
pm2 save
```

4. **Configure Nginx:**
```nginx
# /etc/nginx/sites-available/kapoor-backend
server {
    listen 80;
    server_name api.kapoorassociates.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable SSL:**
```bash
sudo ln -s /etc/nginx/sites-available/kapoor-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d api.kapoorassociates.com
```

### Option 3: Heroku

1. **Install Heroku CLI and Login:**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku App:**
```bash
cd backend
heroku create kapoor-associates-api
```

3. **Configure Environment Variables:**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
# Add all other environment variables
```

4. **Deploy:**
```bash
git add .
git commit -m "Deploy to production"
git push heroku main
```

## 📧 Email Configuration

### Gmail SMTP Setup

1. **Enable 2-Factor Authentication** on Gmail account
2. **Generate App Password:**
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Use App Password** in EMAIL_PASS environment variable

### Alternative: SendGrid

1. **Create SendGrid Account**
2. **Get API Key**
3. **Update Email Configuration:**
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

## 🗄️ Database Configuration

### Production PostgreSQL (Recommended)

1. **Railway PostgreSQL:**
   - Add PostgreSQL service in Railway
   - Copy connection string to DATABASE_URL

2. **AWS RDS:**
   - Create PostgreSQL instance
   - Configure security groups
   - Update connection string

3. **Update Database Code:**
```javascript
// Replace SQLite with PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
```

### SQLite for Smaller Deployments

If using SQLite in production:
```bash
# Ensure database directory exists
mkdir -p database
chmod 755 database

# Initialize database
npm run init-db
```

## 🔒 Security Hardening

### SSL/TLS Configuration

1. **Force HTTPS:**
```javascript
// Add to server.js
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

2. **Security Headers:**
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Environment Security

1. **Secure JWT Secret:**
```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. **Database Security:**
   - Use connection pooling
   - Enable SSL connections
   - Regular backups
   - Access restrictions

## 📊 Monitoring & Analytics

### Application Monitoring

1. **PM2 Monitoring:**
```bash
pm2 install pm2-server-monit
```

2. **Log Management:**
```bash
# View logs
pm2 logs kapoor-backend

# Log rotation
pm2 install pm2-logrotate
```

### Performance Monitoring

1. **New Relic or DataDog** for application performance
2. **Google Analytics** for website analytics
3. **Uptime monitoring** with UptimeRobot

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm install
      - name: Build
        run: cd frontend && npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.2.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE }}
```

## 🧪 Testing & Validation

### Pre-Production Testing

1. **API Endpoints:**
```bash
# Health check
curl https://your-api-domain.com/api/health

# Test chatbot
curl -X POST https://your-api-domain.com/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is corporate law?", "sessionId": "test-123"}'
```

2. **Frontend Testing:**
   - All pages load correctly
   - Forms submit successfully
   - Chatbot functions properly
   - Mobile responsiveness
   - SEO meta tags present

3. **Email Testing:**
   - Consultation confirmations
   - Contact form notifications
   - Admin alerts

### Performance Testing

1. **Load Testing:**
```bash
# Install artillery
npm install -g artillery

# Test API endpoints
artillery quick --count 10 --num 5 https://your-api-domain.com/api/health
```

2. **Frontend Performance:**
   - Google PageSpeed Insights
   - GTmetrix analysis
   - Lighthouse audit

## 📱 Domain & DNS Configuration

### Domain Setup

1. **Purchase Domain** (e.g., kapoorassociates.com)

2. **DNS Configuration:**
```
# A Records
@ → Vercel IP (for frontend)
www → Vercel IP (for frontend)

# CNAME Records
api → your-backend-domain.com (for API)

# MX Records (if using custom email)
@ → mail server configuration
```

3. **SSL Certificate:**
   - Automatic with Vercel for frontend
   - Let's Encrypt for backend (if self-hosted)

## 🔧 Maintenance & Updates

### Regular Tasks

1. **Security Updates:**
```bash
# Update dependencies
npm audit fix
npm update
```

2. **Database Maintenance:**
```bash
# Backup database (PostgreSQL)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Cleanup old logs
pm2 flush
```

3. **Performance Monitoring:**
   - Monitor response times
   - Check error rates
   - Review user analytics

### Backup Strategy

1. **Database Backups:**
   - Daily automated backups
   - Weekly full backups
   - Monthly archive backups

2. **Code Backups:**
   - Git repository (GitHub/GitLab)
   - Tagged releases
   - Environment configurations

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Verify CORS_ORIGINS environment variable
   - Check frontend API URL configuration

2. **Database Connection:**
   - Verify DATABASE_URL format
   - Check network connectivity
   - Validate credentials

3. **Email Not Sending:**
   - Verify SMTP credentials
   - Check Gmail app password
   - Test email configuration

4. **Chatbot Not Responding:**
   - Check API connectivity
   - Verify rate limiting settings
   - Review server logs

### Log Analysis

```bash
# Backend logs
pm2 logs kapoor-backend --lines 100

# System logs
sudo journalctl -u nginx -f

# Database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## 📞 Production Support

### Monitoring Checklist

- [ ] Website accessibility (uptime monitoring)
- [ ] API response times
- [ ] Database performance
- [ ] Email deliverability
- [ ] SSL certificate validity
- [ ] Security scan results
- [ ] Backup completion
- [ ] Error rate monitoring

### Emergency Contacts

- **Technical Issues:** Development team
- **Legal Compliance:** Bar Council guidelines
- **Security Incidents:** Immediate response protocol

---

## 🎯 Production Deployment Summary

**Frontend:** Vercel (https://kapoorassociates.vercel.app)
**Backend:** Railway/AWS (https://api.kapoorassociates.com)
**Database:** PostgreSQL (production) / SQLite (development)
**Email:** Gmail SMTP (kapoorandassociatesadv@gmail.com)
**Domain:** Custom domain with SSL
**Monitoring:** PM2, New Relic, Google Analytics

**Status:** ✅ Production Ready
**Compliance:** ⚖️ Bar Council Compliant
**Security:** 🔒 Enterprise Grade