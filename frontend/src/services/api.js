import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

// Create axios instance
const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    // Check for new token in response headers (token refresh)
    const newToken = response.headers['x-new-token'];
    if (newToken) {
      localStorage.setItem('adminToken', newToken);
    }
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('adminToken');
          if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
            window.location.href = '/admin/login';
          }
          break;
          
        case 403:
          toast.error('Access denied. Insufficient permissions.');
          break;
          
        case 404:
          toast.error('Resource not found.');
          break;
          
        case 429:
          toast.error(data.message || 'Too many requests. Please try again later.');
          break;
          
        case 500:
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          if (data.message) {
            toast.error(data.message);
          } else if (data.error) {
            toast.error(data.error);
          }
      }
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    } else {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// API service methods
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
  changePassword: (passwords) => api.post('/auth/change-password', passwords),
  logout: () => api.post('/auth/logout'),
};

export const contactService = {
  submit: (contactData) => api.post('/contact/submit', contactData),
  getQuery: (queryId) => api.get(`/contact/query/${queryId}`),
  getInfo: () => api.get('/contact/info'),
};

export const consultationService = {
  getAvailableSlots: (params) => api.get('/consultation/available-slots', { params }),
  book: (bookingData) => api.post('/consultation/book', bookingData),
  getBooking: (bookingId) => api.get(`/consultation/booking/${bookingId}`),
  holdSlot: (data) => api.post('/slots/hold', data),
  releaseSlot: (data) => api.post('/slots/release', data),
};

export const clientService = {
  requestLogin: (email) => api.post('/client/login-request', { email }),
  verifyLogin: (email, otp) => api.post('/client/verify', { email, otp }),
  getProfile: (email) => api.get('/client/profile', { params: { email } }),
};

export const chatbotService = {
  chat: (messageData) => api.post('/chatbot/chat', messageData),
  getSession: (sessionId) => api.get(`/chatbot/session/${sessionId}`),
  resetSession: (sessionId) => api.post(`/chatbot/session/${sessionId}/reset`),
};

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getConsultations: (params) => api.get('/admin/consultations', { params }),
  updateConsultation: (id, data) => api.patch(`/admin/consultations/${id}`, data),
  cancelConsultation: (id, reason) => api.post(`/admin/consultations/${id}/cancel`, { reason }),
  syncCalendar: (id) => api.post(`/admin/consultations/${id}/sync-calendar`),
  getQueries: (params) => api.get('/admin/queries', { params }),
  updateQuery: (id, data) => api.patch(`/admin/queries/${id}`, data),
  getChatbotLogs: (params) => api.get('/admin/chatbot-logs', { params }),
  getTimeSlots: (params) => api.get('/admin/time-slots', { params }),
  updateTimeSlot: (id, data) => api.patch(`/admin/time-slots/${id}`, data),
  createTimeSlot: (data) => api.post('/admin/time-slots', data),
  bulkUpdateTimeSlots: (updates) => api.post('/admin/time-slots/bulk-update', { updates }),
  getAdvocates: () => api.get('/admin/advocates'),
  getAdvocate: (id) => api.get(`/admin/advocates/${id}`),
  createAdvocate: (data) => api.post('/admin/advocates', data),
  updateAdvocate: (id, data) => api.patch(`/admin/advocates/${id}`, data),
  deleteAdvocate: (id) => api.delete(`/admin/advocates/${id}`),
  getAnalytics: (period) => api.get('/admin/analytics', { params: { period } }),
  getAuditLog: (params) => api.get('/admin/audit-log', { params }),
  getCalendarStatus: () => api.get('/admin/calendar-status'),
  
  // New Admin Methods
  getStats: () => api.get('/admin/stats'),
  getClients: () => api.get('/admin/clients'),
  getClientProfile: (clientId) => api.get(`/admin/clients/${clientId}`),
  createCase: (clientId, caseData) => api.post(`/admin/clients/${clientId}/cases`, caseData),
  updateCase: (clientId, caseId, caseData) => api.put(`/admin/clients/${clientId}/cases/${caseId}`, caseData),
  deleteCase: (clientId, caseId) => api.delete(`/admin/clients/${clientId}/cases/${caseId}`),
  uploadDocument: (clientId, caseId, formData) => api.post(`/admin/clients/${clientId}/cases/${caseId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteDocument: (documentId) => api.delete(`/admin/documents/${documentId}`),
  updateConsultationStatus: (id, status) => api.put(`/admin/consultations/${id}`, { status }),
  getFeedback: (params) => api.get('/admin/feedback', { params }),
  
  // AI Insights
  generateCaseInsight: (caseId) => api.post(`/admin/cases/${caseId}/insights`),
  getCaseInsights: (caseId) => api.get(`/admin/cases/${caseId}/insights`),

  // Reminders
  triggerReminders: () => api.post('/admin/reminders/trigger'),
  getReminderLogs: (params) => api.get('/admin/reminders/logs', { params }),

  // Analytics
  getAnalyticsCases: () => api.get('/admin/analytics/cases'),
  getAnalyticsRevenue: () => api.get('/admin/analytics/revenue'),
  getAnalyticsClients: () => api.get('/admin/analytics/clients'),
  getAnalyticsChatbot: () => api.get('/admin/analytics/chatbot'),

  // Revenue
  getRevenue: (params) => api.get('/admin/revenue', { params }),
  createRevenue: (data) => api.post('/admin/revenue', data),
  deleteRevenue: (id) => api.delete(`/admin/revenue/${id}`),
};

// Utility functions
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.response?.data?.error) {
    return error.response.data.error;
  } else if (error.message) {
    return error.message;
  }
  return defaultMessage;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return false;
  
  try {
    // Basic token validation (check if it's not expired)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

export const setAuthToken = (token) => {
  localStorage.setItem('adminToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('adminToken');
};

export default api;