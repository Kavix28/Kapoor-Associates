import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  EyeIcon, 
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { authService } from '../../services/api';
import otpService from '../../services/otpService';
import OTPModal from '../../components/common/OTPModal';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingLoginData, setPendingLoginData] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (tokenData.exp > currentTime) {
          const from = location.state?.from?.pathname || '/admin';
          navigate(from, { replace: true });
        } else {
          localStorage.removeItem('adminToken');
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
      }
    }
  }, [navigate, location]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAdminEmail(data.email);
    
    try {
      // First check credentials
      await authService.login({
        email: data.email,
        password: data.password,
      });

      // If credentials are valid, credentials check succeeded (service will throw otherwise)
      // Now trigger OTP
      setPendingLoginData(data);
      await otpService.sendOTP(data.email, 'login');
      setIsOtpModalOpen(true);
      
    } catch (error) {
      console.error('Login initial check error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Invalid credentials. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerified = async () => {
    if (!pendingLoginData) return;

    setIsLoading(true);
    try {
      const response = await authService.login({
        email: pendingLoginData.email,
        password: pendingLoginData.password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        toast.success('Login verified and successful!');
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error('Session expired. Please login again.');
    } finally {
      setIsLoading(false);
      setPendingLoginData(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login - Kapoor & Associates</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzNzQxNTEiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="card-dark p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <ScaleIcon className="h-12 w-12 text-gold-500 mr-3" />
                <div>
                  <h1 className="text-2xl font-display font-bold text-white">
                    KAPOOR & ASSOCIATES
                  </h1>
                  <p className="text-gold-400 text-sm">Admin Portal</p>
                </div>
              </div>
              <p className="text-gray-400">
                Secure access to administrative dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="input-dark w-full pl-10"
                    placeholder="admin@kapoorassociates.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    className="input-dark w-full pl-10 pr-10"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Default Credentials Info (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm font-medium mb-2">Development Credentials:</p>
                <p className="text-gray-300 text-xs">Email: admin@kapoorassociates.com</p>
                <p className="text-gray-300 text-xs">Password: SecureAdminPassword123!</p>
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-xs">
                This is a secure area. All access is logged and monitored.
              </p>
            </div>
          </div>

          {/* Back to Website Link */}
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-gray-400 hover:text-gold-400 transition-colors text-sm"
            >
              ← Back to Website
            </a>
          </div>
        </motion.div>
      </div>

      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        contactInfo={adminEmail}
        actionType="login"
        onVerified={handleOtpVerified}
      />
    </>
  );
};

export default AdminLogin;