import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Practice Areas', href: '/practice-areas' },
    { name: 'High Court Practice', href: '/high-court-practice' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-dark-900/95 backdrop-blur-md shadow-dark-lg border-b border-dark-700' 
        : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 group"
            aria-label="Kapoor & Associates Home"
          >
            <div className="text-2xl lg:text-3xl font-display font-bold">
              <span className="text-white group-hover:text-gold-400 transition-colors duration-300">
                KAPOOR
              </span>
              <span className="text-gold-500 mx-2">&</span>
              <span className="text-white group-hover:text-gold-400 transition-colors duration-300">
                ASSOCIATES
              </span>
            </div>
            <div className="text-xs lg:text-sm text-gray-400 font-medium tracking-wider">
              CORPORATE & COMMERCIAL LAW
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative font-medium transition-colors duration-300 group ${
                  isActive(item.href)
                    ? 'text-gold-500'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full ${
                  isActive(item.href) ? 'w-full' : ''
                }`} />
              </Link>
            ))}
            
            {/* CTA Button */}
            <Link
              to="/contact"
              className="btn-primary ml-4"
            >
              Corporate Consultation
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-800 transition-colors duration-300"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-dark-900/98 backdrop-blur-md border-t border-dark-700"
          >
            <div className="container-custom py-4">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block py-2 px-4 rounded-lg font-medium transition-colors duration-300 ${
                      isActive(item.href)
                        ? 'text-gold-500 bg-dark-800'
                        : 'text-gray-300 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile CTA Button */}
                <Link
                  to="/contact"
                  className="btn-primary mt-4 text-center"
                >
                  Corporate Consultation
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;