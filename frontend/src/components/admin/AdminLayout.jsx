import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChartBarIcon, 
  UsersIcon, 
  CalendarIcon, 
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ScaleIcon,
  ChartPieIcon,
  BellAlertIcon
} from '@heroicons/react/24/outline';

/**
 * Shared layout component for all admin-restricted pages.
 */
const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = localStorage.getItem('adminName') || 'Administrator';

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  const navLinks = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: ChartBarIcon },
    { title: 'Clients', path: '/admin/clients', icon: UsersIcon },
    { title: 'Firm Analytics', path: '/admin/analytics', icon: ChartPieIcon },
    { title: 'Reminders', path: '/admin/reminders', icon: BellAlertIcon },
    { title: 'Consultations', path: '/admin/consultations', icon: CalendarIcon },
    { title: 'Chatbot Feedback', path: '/admin/feedback', icon: ChatBubbleLeftRightIcon },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleSidebar} className="p-2 bg-dark-800 text-white rounded-lg">
          {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 80 }}
        className="fixed inset-y-0 left-0 z-40 bg-dark-900 text-white border-r border-dark-700 flex flex-col transition-all duration-300 overflow-hidden"
      >
        <div className="p-6 h-16 flex items-center border-b border-dark-700">
          <ScaleIcon className="h-8 w-8 text-gold-500 mr-3 shrink-0" />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-display font-bold text-lg tracking-tight whitespace-nowrap"
              >
                Kapoor & <span className="text-gold-500">Associates</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex items-center p-3 rounded-lg transition-all duration-200 group
                ${isActive ? 'bg-gold-500 text-dark-900 font-bold' : 'text-gray-400 hover:bg-dark-800 hover:text-white'}
              `}
            >
              <link.icon className={`h-6 w-6 shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
              {isSidebarOpen && <span className="text-sm">{link.title}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-700">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-3 text-red-400 hover:bg-red-500/10 rounded-lg group transition-colors"
          >
            <ArrowLeftOnRectangleIcon className={`h-6 w-6 shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {isSidebarOpen && <span className="text-sm font-medium">Log Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'pl-[240px]' : 'pl-[80px]'}`}
      >
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-30">
          <h2 className="text-xl font-display font-bold text-gray-800">Admin Panel</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 font-medium">Welcome, {adminName}</span>
            <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-dark-900 font-bold">
              {adminName[0]}
            </div>
          </div>
        </header>

        {/* Page Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
