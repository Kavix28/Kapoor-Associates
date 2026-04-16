import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  UsersIcon, 
  FolderIcon, 
  CalendarIcon, 
  ScaleIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

/**
 * Main dashboard view for administrators.
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentConsultations, setRecentConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, consultationsRes] = await Promise.all([
          adminService.getStats(),
          adminService.getConsultations({ limit: 5 })
        ]);
        setStats(statsRes.data);
        setRecentConsultations(consultationsRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="spinner h-10 w-10 border-2 border-gold-500 border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  const statCards = [
    { title: 'Total Clients', value: stats.totalClients, icon: UsersIcon, color: 'blue' },
    { title: 'Active Cases', value: stats.totalCases, icon: FolderIcon, color: 'gold' },
    { title: 'Upcoming Consults', value: stats.upcomingConsultations, icon: CalendarIcon, color: 'green' },
    { title: 'Open Cases', value: stats.openCases, icon: ScaleIcon, color: 'amber' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Operational Overview</h1>
          <p className="text-gray-500">Real-time performance and volume indicators</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center
                ${card.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  card.color === 'gold' ? 'bg-amber-50 text-gold-600' :
                  card.color === 'green' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
              >
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{card.title}</p>
                <p className="text-2xl font-display font-bold text-gray-900">{card.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Case Status Donut (SVG Implementation) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Case Status Distribution</h3>
            <div className="flex items-center justify-around h-64">
              <svg viewBox="0 0 100 100" className="w-48 h-48 -rotate-90">
                {/* Simplified static segments based on stats */}
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e7eb" strokeWidth="8" />
                <circle 
                  cx="50" cy="50" r="40" fill="transparent" stroke="#d4af37" strokeWidth="8" 
                  strokeDasharray={`${(stats.openCases / Math.max(1, stats.totalCases)) * 251.2} 251.2`} 
                />
              </svg>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-gold-500 rounded-full mr-2"></span>
                  <span className="text-gray-600">Open ({stats.openCases})</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-gray-600 rounded-full mr-2"></span>
                  <span className="text-gray-600">In Progress ({stats.inProgressCases})</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="w-3 h-3 bg-gray-200 rounded-full mr-2"></span>
                  <span className="text-gray-600">Closed ({stats.closedCases})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chatbot Feedback Bars */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Assistant Performance</h3>
            <div className="space-y-8 pt-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Helpful Responses</span>
                  <span className="text-sm font-bold text-green-600">
                    {Math.round((stats.chatbotFeedbackHelpful / Math.max(1, stats.chatbotFeedbackHelpful + stats.chatbotFeedbackNotHelpful)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-500 h-full transition-all duration-1000" 
                    style={{ width: `${(stats.chatbotFeedbackHelpful / Math.max(1, stats.chatbotFeedbackHelpful + stats.chatbotFeedbackNotHelpful)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Room for Improvement</span>
                  <span className="text-sm font-bold text-red-600">
                    {Math.round((stats.chatbotFeedbackNotHelpful / Math.max(1, stats.chatbotFeedbackHelpful + stats.chatbotFeedbackNotHelpful)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-red-500 h-full transition-all duration-1000" 
                    style={{ width: `${(stats.chatbotFeedbackNotHelpful / Math.max(1, stats.chatbotFeedbackHelpful + stats.chatbotFeedbackNotHelpful)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Consultations Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-black">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Recent Consultation Requests</h3>
            <button className="text-sm text-gold-600 font-bold hover:text-gold-700">View All</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-bold">
              {recentConsultations.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{booking.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.preferredDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{booking.preferredTime}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider
                      ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;