import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import otpService from '../../services/otpService';
import toast from 'react-hot-toast';

const OTPModal = ({ isOpen, onClose, contactInfo, onVerified, actionType }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      toast.error('Please enter the full 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      await otpService.verifyOTP(contactInfo, otpValue);
      toast.success('Verification successful!');
      onVerified();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await otpService.sendOTP(contactInfo, actionType);
      toast.success('New OTP sent!');
      setTimer(60);
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-dark-800 border border-gold-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
                <ShieldCheckIcon className="h-10 w-10 text-gold-500" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">Verify OTP</h3>
              <p className="text-gray-400">
                A verification code has been sent to <br />
                <span className="text-gold-400 font-medium">{contactInfo}</span>
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-14 bg-dark-700 border border-dark-600 rounded-lg text-center text-2xl font-bold text-white focus:border-gold-500 focus:ring-1 focus:ring-gold-500 outline-none transition-all"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full btn-primary py-4 text-lg mb-6 flex items-center justify-center"
            >
              {isVerifying ? <ArrowPathIcon className="h-6 w-6 animate-spin mr-2" /> : null}
              {isVerifying ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <div className="text-center">
              <p className="text-gray-400 mb-2">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={timer > 0 || isResending}
                className={`text-gold-500 font-medium hover:text-gold-400 transition-colors ${
                  timer > 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isResending ? 'Resending...' : timer > 0 ? `Resend Code in ${timer}s` : 'Resend OTP Now'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OTPModal;
