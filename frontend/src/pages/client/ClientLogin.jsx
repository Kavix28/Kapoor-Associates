import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { clientService } from '../../services/api';
import { ShieldCheckIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import otpService from '../../services/otpService';
import OTPModal from '../../components/common/OTPModal';

const ClientLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      setEmail(data.email);
      await clientService.requestLogin(data.email);
      
      // Trigger OTP via n8n
      await otpService.sendOTP(data.email, 'login');
      
      setIsOtpModalOpen(true);
    } catch (error) {
      console.error('Login request error:', error);
      toast.error(error.response?.data || 'Failed to request login. Please ensure your email is registered.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerified = () => {
    localStorage.setItem('clientEmail', email);
    toast.success('Successfully logged in!');
    navigate('/client/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <div className="card-dark p-8 border-gold-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Client Portal</h1>
            <p className="text-gray-400">Secure access to your case details and documents</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-gray-300 font-medium mb-2">Registered Email Address</label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                  })}
                  className="input-dark w-full pl-10"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="spinner h-5 w-5 border-2 border-dark-900 border-t-transparent animate-spin"></div>
              ) : (
                'Secure Login via OTP'
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-dark-700 flex items-center justify-center text-xs text-gray-500">
            <ShieldCheckIcon className="h-4 w-4 mr-1 text-gold-500/50" />
            Two-factor authentication enabled for your security
          </div>
        </div>
      </motion.div>

      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        contactInfo={email}
        actionType="login"
        onVerified={handleOtpVerified}
      />
    </div>
  );
};

export default ClientLogin;
