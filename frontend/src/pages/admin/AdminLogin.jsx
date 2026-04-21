import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  EyeIcon, 
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
  ScaleIcon,
  EnvelopeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { authService } from '../../services/api';

/**
 * Kapoor & Associates Legal Platform
 * Updated Admin Login with Two-Step OTP Verification (Gmail SMTP)
 */
const AdminLogin = () => {
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  // Step 1: Submit email and password
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      if (res.data.success && res.data.otpRequired) {
        setStep("otp");
        toast.success("Credentials verified. Check your email for OTP.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Invalid credentials";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp });
      if (res.data.success) {
        localStorage.setItem("adminToken", res.data.token);
        toast.success("Login successful!");
        const from = location.state?.from?.pathname || '/admin';
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid OTP";
      toast.error(msg);
    } finally {
      setIsLoading(false);
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="card-dark p-8 border-gold-500/20 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <ScaleIcon className="h-16 w-16 text-gold-500 mx-auto mb-4" />
              <h1 className="text-2xl font-display font-bold text-white tracking-widest uppercase">
                KAPOOR & ASSOCIATES
              </h1>
              <div className="h-px w-24 bg-gold-500/50 mx-auto my-2"></div>
              <p className="text-gold-400 text-sm font-medium">ADMIN SECURITY GATEWAY</p>
            </div>

            <AnimatePresence mode="wait">
              {step === "credentials" ? (
                <motion.form
                  key="credentials"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleCredentialsSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Email Address</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-dark w-full pl-10"
                        placeholder="admin@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Password</label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-dark w-full pl-10 pr-10"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-4 tracking-widest font-bold"
                  >
                    {isLoading ? "VERIFYING..." : "SECURE LOGIN"}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleOtpSubmit}
                  className="space-y-6"
                >
                  <div className="text-center p-4 bg-gold-500/5 rounded-lg border border-gold-500/10 mb-6">
                    <EnvelopeIcon className="h-10 w-10 text-gold-500 mx-auto mb-2" />
                    <p className="text-gray-300 text-sm">
                      A 6-digit OTP has been sent to:
                    </p>
                    <p className="text-gold-400 font-bold text-sm truncate">{email}</p>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase mb-2 text-center">Enter Verification Code</label>
                    <input
                      type="text"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-dark-800 border-2 border-gold-500/30 text-white text-3xl text-center py-3 tracking-[0.5em] focus:border-gold-500 focus:outline-none rounded-lg"
                      placeholder="000000"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-4 tracking-widest font-bold"
                  >
                    {isLoading ? "AUTHENTICATING..." : "VERIFY & ENTER"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("credentials")}
                    className="w-full text-gray-500 text-xs hover:text-white transition-colors"
                  >
                    Use different account
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 text-center">
            <a href="/" className="text-gray-500 hover:text-gold-500 text-sm flex items-center justify-center transition-colors">
              <CheckCircleIcon className="h-4 w-4 mr-1" /> Authorized Personnel Only
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLogin;