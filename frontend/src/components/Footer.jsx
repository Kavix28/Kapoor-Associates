import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-700">
      <div className="container-custom py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Firm Information */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <ScaleIcon className="h-8 w-8 text-gold-500 mr-3" />
              <h3 className="text-xl font-display font-bold text-white">
                KAPOOR & ASSOCIATES
              </h3>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Advocates & Legal Advisors specializing in corporate and commercial law with 20+ years of Delhi High Court experience.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gold-400 mr-3 mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p className="font-medium">Tis Hazari Courts Office</p>
                  <p>257, Civil Wing, Tis Hazari Courts, Delhi – 110054</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gold-400 mr-3 mt-1 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <p className="font-medium">Preet Vihar Office</p>
                  <p>103, First Floor, Plot No. 6, LSC, Main Vikas Marg, New Rajdhani Enclave, Near Preet Vihar Metro Station, Delhi – 110092</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gold-400 mr-3" />
                <div className="text-gray-300 text-sm">
                  <p>+91 98916 56411 | +91 98103 16427</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <EnvelopeIcon className="h-5 w-5 text-gold-400 mr-3" />
                <div className="text-gray-300 text-sm">
                  <p>kapoorandassociatesadv@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/practice-areas" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                  Practice Areas
                </Link>
              </li>
              <li>
                <Link to="/high-court-practice" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                  High Court Practice
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                  Contact & Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-use" className="text-gray-400 hover:text-gold-400 transition-colors text-sm">
                  Terms of Use
                </Link>
              </li>
            </ul>
            
            <div className="mt-6">
              <h5 className="text-sm font-medium text-white mb-2">Office Hours</h5>
              <p className="text-gray-400 text-xs">
                Monday - Friday<br />
                11:00 AM - 1:00 PM<br />
                3:00 PM - 5:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p>© {new Date().getFullYear()} Kapoor & Associates, Advocates & Legal Advisors. All rights reserved.</p>
            </div>
            
            <div className="text-gray-500 text-xs text-center md:text-right">
              <p className="font-medium">
                As per the rules of the Bar Council of India, this website does not seek to advertise or solicit work in any manner.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;