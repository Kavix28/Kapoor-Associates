import axios from 'axios';

/**
 * Kapoor & Associates Legal Platform
 * OTP Service — wraps the n8n webhook automation for phone verification.
 *
 * PRODUCTION BEHAVIOR:
 *   If REACT_APP_N8N_BASE_URL is not set (blank .env.production), OTP is
 *   silently skipped and all methods return { success: true, skipped: true }.
 *   This ensures the booking flow is never blocked by OTP unavailability.
 *
 * LOCAL DEV:
 *   Set REACT_APP_N8N_BASE_URL=http://localhost:5678 in .env.local to enable.
 */

// --- Configuration ---
const N8N_BASE_URL = process.env.REACT_APP_N8N_BASE_URL || '';
const N8N_API_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOGEwNjE0Zi05NjNiLTQ1M2UtYjM3My1iMmNiYWIzZDdiMDciLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzc0ODA3ODI3fQ.hDKVNKnDuzW3b25bh6EHsfd3r5efenG69xiuwq12o7s';
const OTP_ENGINE_KEY = 'otp_engine_key_v1_z8x2c9v4';

// Webhook paths
const SEND_OTP_PATH   = '/webhook/send-otp';
const VERIFY_OTP_PATH = '/webhook/verify-otp';

// Soft-failure sentinel returned when n8n is not available
const OTP_SKIPPED = { success: true, skipped: true };

/** Returns true if the n8n webhook is configured and reachable (URL set). */
const isN8nConfigured = () => Boolean(N8N_BASE_URL);

const otpApi = isN8nConfigured()
  ? axios.create({
      baseURL: N8N_BASE_URL,
      timeout: 8000,                      // 8 s timeout — don't hang the user
      headers: {
        'Content-Type':   'application/json',
        'X-N8N-API-KEY':  N8N_API_KEY,
        'x-otp-api-key':  OTP_ENGINE_KEY,
      },
    })
  : null;

// ---------------------------------------------------------------------------

const otpService = {
  /**
   * Send an OTP to the given phone number for the specified action.
   * NEVER throws — returns { success, skipped?, error? } always.
   *
   * @param {string} phone  - 10-digit phone number
   * @param {string} action - 'booking' | 'login' | 'register'
   * @returns {Promise<{ success: boolean, skipped?: boolean, error?: string }>}
   */
  async sendOTP(phone, action) {
    if (!isN8nConfigured()) {
      console.warn('[otpService] n8n not configured — OTP step skipped (production mode).');
      return OTP_SKIPPED;
    }

    try {
      console.log(`[otpService] Sending OTP to ${phone} for ${action}`);
      const response = await otpApi.post(SEND_OTP_PATH, { phone, action });
      return { success: true, data: response.data };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to send OTP';
      console.warn('[otpService] sendOTP soft-failure:', msg);
      // Return soft failure — callers must NOT throw based on this
      return { success: false, skipped: true, error: msg };
    }
  },

  /**
   * Verify an OTP submitted by the user.
   * NEVER throws — returns { success, verified?, error? } always.
   *
   * @param {string} phone
   * @param {string} otp
   * @returns {Promise<{ success: boolean, verified?: boolean, error?: string }>}
   */
  async verifyOTP(phone, otp) {
    if (!isN8nConfigured()) {
      console.warn('[otpService] n8n not configured — OTP verification skipped.');
      return { success: true, verified: true, skipped: true };
    }

    try {
      console.log(`[otpService] Verifying OTP for ${phone}`);
      const response = await otpApi.post(VERIFY_OTP_PATH, { phone, otp });
      const ok = response.data?.success || response.status === 200;
      if (ok) {
        return { success: true, verified: true };
      }
      return { success: false, error: response.data?.message || 'Verification failed' };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Verification failed';
      console.warn('[otpService] verifyOTP soft-failure:', msg);
      return { success: false, error: msg };
    }
  },

  /** Check whether the n8n OTP service is currently configured. */
  isAvailable: isN8nConfigured,

  // ---- Backward-compat wrappers ----
  async requestOtp(userData, action) {
    const phone = userData.contact || userData.phone || userData.email;
    return this.sendOTP(phone, action);
  },

  async verifyOtp(userData) {
    return this.verifyOTP(userData.contact || userData.phone || userData.email, userData.otp);
  },
};

export default otpService;
