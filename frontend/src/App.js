import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import PracticeAreas from './pages/PracticeAreas';
import HighCourtPractice from './pages/HighCourtPractice';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse.jsx';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClients from './pages/admin/AdminClients';
import AdminConsultations from './pages/admin/AdminConsultations';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReminders from './pages/admin/AdminReminders';
import ClientLogin from './pages/client/ClientLogin';
import ClientDashboard from './pages/client/ClientDashboard';

// Context
import { ChatbotProvider } from './context/ChatbotContext';

// Protected Route Components
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AdminProtectedRoute } from './utils/adminAuth';

function App() {
  return (
    <HelmetProvider>
      <ChatbotProvider>
        <Router>
          <div className="min-h-screen bg-dark-900 text-gray-100">
            <ScrollToTop />
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#f1f5f9',
                  border: '1px solid #475569',
                },
                success: {
                  iconTheme: {
                    primary: '#d4af37',
                    secondary: '#1e293b',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#1e293b',
                  },
                },
              }}
            />
            
            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/clients" element={<AdminProtectedRoute><AdminClients /></AdminProtectedRoute>} />
              <Route path="/admin/consultations" element={<AdminProtectedRoute><AdminConsultations /></AdminProtectedRoute>} />
              <Route path="/admin/feedback" element={<AdminProtectedRoute><AdminFeedback /></AdminProtectedRoute>} />
              <Route path="/admin/analytics" element={<AdminProtectedRoute><AdminAnalytics /></AdminProtectedRoute>} />
              <Route path="/admin/reminders" element={<AdminProtectedRoute><AdminReminders /></AdminProtectedRoute>} />
              
              {/* Public Routes */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/practice-areas" element={<PracticeAreas />} />
                      <Route path="/high-court-practice" element={<HighCourtPractice />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-of-use" element={<TermsOfUse />} />
                      
                      {/* Client Routes */}
                      <Route path="/client/login" element={<ClientLogin />} />
                      <Route path="/client/dashboard" element={<ClientDashboard />} />
                      
                      {/* 404 Route */}
                      <Route path="*" element={
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-6xl font-bold text-gold-500 mb-4">404</h1>
                            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
                            <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
                            <a 
                              href="/" 
                              className="btn-primary inline-block"
                            >
                              Return Home
                            </a>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </ChatbotProvider>
    </HelmetProvider>
  );
}

export default App;