import axios from 'axios';

// n8n configuration constants
const N8N_BASE_URL = process.env.REACT_APP_N8N_BASE_URL || "http://localhost:5678";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGEwNjE0Zi05NjNiLTQ1M2UtYjM3My1iMmNiYWIzZDdiMDciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzc0ODA3ODI3fQ.hDKVNKnDuzW3b25bh6EHsfd3r5efenG69xiuwq12o7s";
const OTP_ENGINE_KEY = "otp_engine_key_v1_z8x2c9v4";

// Webhook paths discovered (defaults if rebuild scripts missing)
const SEND_OTP_PATH = "/webhook/send-otp";
const VERIFY_OTP_PATH = "/webhook/verify-otp";

const otpApi = axios.create({
  baseURL: N8N_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-N8N-API-KEY': N8N_API_KEY,
    'x-otp-api-key': OTP_ENGINE_KEY
  },
});

const otpService = {
  /**
   * Request an OTP to be sent to the user
   * @param {string} phone - User phone number
   * @param {string} action - booking | login | register
   * @returns {Promise<Object>}
   */
  async sendOTP(phone, action) {
    try {
      console.log(`[otpService] Sending OTP to ${phone} for ${action}`);
      const response = await otpApi.post(SEND_OTP_PATH, {
        phone: phone,
        action: action
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send OTP';
      console.error('[otpService] Error sending OTP:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  /**
   * Verify the OTP entered by the user
   * @param {string} phone - User phone number
   * @param {string} otp - Entered verification code
   * @returns {Promise<Object>}
   */
  async verifyOTP(phone, otp) {
    try {
      console.log(`[otpService] Verifying OTP for ${phone}`);
      const response = await otpApi.post(VERIFY_OTP_PATH, {
        phone: phone,
        otp: otp
      });
      
      // n8n might return { success: true } or similar
      if (response.data && (response.data.success || response.status === 200)) {
        return { success: true };
      } else {
        throw new Error(response.data?.message || 'Verification failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Verification failed. Please try again.';
      console.error('[otpService] Error verifying OTP:', errorMessage);
      throw new Error(errorMessage);
    }
  },

  // Maintain backward compatibility for existing code if needed, 
  // but we should update consumers to use the new methods.
  async requestOtp(userData, action) {
    const phone = userData.contact || userData.phone || userData.email;
    return this.sendOTP(phone, action);
  },

  async verifyOtp(userData) {
    return this.verifyOTP(userData.contact || userData.phone || userData.email, userData.otp);
  }
};

export default otpService;

// TEST: call sendOTP('+919999999999', 'register') to verify n8n connectivity
