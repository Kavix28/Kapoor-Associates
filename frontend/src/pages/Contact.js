import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { contactService, consultationService } from '../services/api';
import otpService from '../services/otpService';
import OTPModal from '../components/common/OTPModal';

const Contact = () => {
  const [firmInfo, setFirmInfo] = useState(null);
  const [availableSlots, setAvailableSlots] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState('office');
  const [officeLocation, setOfficeLocation] = useState('tis_hazari');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState(null);
  
  // Real-time Slot States
  const [sessionId] = useState(() => {
    const stored = localStorage.getItem('legal_session_id');
    if (stored) return stored;
    const newId = crypto.randomUUID();
    localStorage.setItem('legal_session_id', newId);
    return newId;
  });
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Fetch firm information
  useEffect(() => {
    const fetchFirmInfo = async () => {
      try {
        const response = await contactService.getInfo();
        console.log('Firm info response:', response.data); // Debug log
        if (response.data && response.data.success && response.data.data) {
          setFirmInfo(response.data.data); // Extract the nested data
        } else {
          console.error('Invalid firm info response structure:', response.data);
          // Set fallback data
          setFirmInfo({
            firm: {
              name: "Kapoor & Associates, Advocates & Legal Advisors",
              email: "kapoorandassociatesadv@gmail.com",
              phonePrimary: "+91 98916 56411",
              phoneSecondary: "+91 98103 16427"
            },
            officeHours: {
              weekdays: "Monday - Friday: 10:00 AM - 6:00 PM"
            },
            consultationInfo: {
              duration: "30 minutes",
              mode: "Office & Online",
              workingDays: "Monday - Friday",
              timeSlots: "11:00 AM - 5:00 PM"
            },
            disclaimer: "As per the rules of the Bar Council of India, this website does not seek to advertise or solicit work in any manner."
          });
        }
      } catch (error) {
        console.error('Failed to fetch firm info:', error);
        toast.error('Failed to load contact information');
        // Set fallback data even on error
        setFirmInfo({
          firm: {
            name: "Kapoor & Associates, Advocates & Legal Advisors",
            email: "kapoorandassociatesadv@gmail.com",
            phonePrimary: "+91 98916 56411",
            phoneSecondary: "+91 98103 16427"
          },
          officeHours: {
            weekdays: "Monday - Friday: 10:00 AM - 6:00 PM"
          },
          consultationInfo: {
            duration: "30 minutes",
            mode: "Office & Online",
            workingDays: "Monday - Friday",
            timeSlots: "11:00 AM - 5:00 PM"
          },
          disclaimer: "As per the rules of the Bar Council of India, this website does not seek to advertise or solicit work in any manner."
        });
      }
    };

    fetchFirmInfo();
  }, []);

  // Fetch available slots when consultation type changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await consultationService.getAvailableSlots({
          consultationType: consultationType
        });
        console.log('Available slots response:', response.data); // Debug log
        if (response.data && response.data.success && response.data.data && response.data.data.availableSlots) {
          setAvailableSlots(response.data.data.availableSlots); // Extract nested data
        } else {
          console.error('Invalid slots response structure:', response.data);
          setAvailableSlots({});
          toast.error('Failed to load available time slots');
        }
      } catch (error) {
        console.error('Failed to fetch available slots:', error);
        setAvailableSlots({});
        toast.error('Failed to load available time slots');
      }
    };

    fetchAvailableSlots();
    const interval = setInterval(fetchAvailableSlots, 30000); // 30s polling
    return () => {
      clearInterval(interval);
      // Release slot on unmount if any
      if (selectedSlotId) {
        consultationService.releaseSlot({ slotId: selectedSlotId, sessionId });
      }
    };
  }, [consultationType, selectedSlotId, sessionId]);

  const handleSlotSelection = async (slotId, time) => {
    try {
      // 1. If there's an existing hold, release it first (optional, but good practice)
      if (selectedSlotId && selectedSlotId !== slotId) {
        await consultationService.releaseSlot({ slotId: selectedSlotId, sessionId });
      }

      // 2. Try to hold the new slot
      const response = await consultationService.holdSlot({ slotId, sessionId });
      
      if (response.status === 200) {
        setSelectedSlotId(slotId);
        setSelectedTime(time);
        toast.success('Time slot reserved for 10 minutes');
      }
    } catch (error) {
      console.error('Failed to hold slot:', error);
      if (error.response?.status === 409) {
        toast.error('This slot was just taken. Please pick another.');
      } else {
        toast.error('Failed to reserve slot. Please try again.');
      }
    }
  };

  const onSubmit = async (data) => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a consultation date and time');
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean phone number - remove spaces, hyphens, parentheses, and country code
      let cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
      if (cleanPhone.startsWith('+91')) {
        cleanPhone = cleanPhone.substring(3);
      } else if (cleanPhone.startsWith('91') && cleanPhone.length > 10) {
        cleanPhone = cleanPhone.substring(2);
      }

      const consultationData = {
        name: data.name,
        companyName: data.companyName,
        email: data.email,
        phone: cleanPhone,
        legalMatter: data.legalMatter,
        consultationType,
        officeLocation: consultationType === 'office' ? officeLocation : undefined,
        preferredDate: selectedDate,
        preferredTime: selectedTime,
        slotId: selectedSlotId,
        sessionId
      };

      setPendingBookingData(consultationData);
      
      // Trigger OTP
      await otpService.sendOTP(cleanPhone, 'booking');
      setIsOtpModalOpen(true);

    } catch (error) {
      console.error('Initial consultation booking request error:', error);
      toast.error('Failed to initiate booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerified = async () => {
    if (!pendingBookingData) return;

    setIsSubmitting(true);
    try {
      await consultationService.book(pendingBookingData);
      
      toast.success('Consultation booked successfully!');
      reset();
      setSelectedDate('');
      setSelectedTime('');
      setSelectedSlotId(null);
      setPendingBookingData(null);
      
      // Refresh available slots
      const slotsResponse = await consultationService.getAvailableSlots({
        consultationType: consultationType
      });
      if (slotsResponse.data && slotsResponse.data.success && slotsResponse.data.data && slotsResponse.data.data.availableSlots) {
        setAvailableSlots(slotsResponse.data.data.availableSlots);
      }

    } catch (error) {
      console.error('Final consultation booking error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to complete booking. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (!firmInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Contact & Consultation - Kapoor & Associates | Schedule Legal Consultation</title>
        <meta name="description" content="Contact Kapoor & Associates for corporate legal consultation. Schedule a meeting with Advocate Anuj Kapoor for expert legal advice in Delhi High Court matters." />
        <meta name="keywords" content="legal consultation Delhi, corporate lawyer appointment, Delhi High Court consultation, business legal advice, Anuj Kapoor consultation" />
        <link rel="canonical" href="https://kapoorassociates.vercel.app/contact" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzNzQxNTEiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative z-10 container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Contact & Consultation
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Schedule a confidential consultation for your corporate legal matters
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information & Consultation Form */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-8">
                Get in Touch
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPinIcon className="h-6 w-6 text-dark-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Office Locations</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gold-400 font-medium">Tis Hazari Courts Office</p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          257, Civil Wing, Tis Hazari Courts, Delhi – 110054
                        </p>
                      </div>
                      <div>
                        <p className="text-gold-400 font-medium">Preet Vihar Office</p>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          103, First Floor, Plot No. 6, LSC, Main Vikas Marg, New Rajdhani Enclave, Near Preet Vihar Metro Station, Delhi – 110092
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <PhoneIcon className="h-6 w-6 text-dark-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Phone Numbers</h3>
                    <p className="text-gray-300">{firmInfo?.firm?.phonePrimary || '+91 98916 56411'}</p>
                    <p className="text-gray-300">{firmInfo?.firm?.phoneSecondary || '+91 98103 16427'}</p>
                    <p className="text-gray-400 text-sm mt-1">Available during office hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <EnvelopeIcon className="h-6 w-6 text-dark-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Email Address</h3>
                    <p className="text-gray-300">{firmInfo?.firm?.email || 'kapoorandassociatesadv@gmail.com'}</p>
                    <p className="text-gray-400 text-sm mt-1">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-dark-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Office Hours</h3>
                    <p className="text-gray-300">{firmInfo?.officeHours?.weekdays || 'Monday - Friday: 10:00 AM - 6:00 PM'}</p>
                    <p className="text-gray-300">Saturday & Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* Consultation Information */}
              <div className="card-dark p-6 border-gold-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <CalendarDaysIcon className="h-5 w-5 text-gold-400 mr-2" />
                  Consultation Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-gray-300">{firmInfo?.consultationInfo?.duration || '30 minutes'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mode:</span>
                    <span className="text-gray-300">{firmInfo?.consultationInfo?.mode || 'Office & Online'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Working Days:</span>
                    <span className="text-gray-300">{firmInfo?.consultationInfo?.workingDays || 'Monday - Friday'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Slots:</span>
                    <span className="text-gray-300">{firmInfo?.consultationInfo?.timeSlots || '11:00 AM - 5:00 PM'}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Consultation Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="card-dark p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                    Schedule Corporate Consultation
                  </h3>
                  <div className="inline-flex items-center bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-2">
                    <ShieldCheckIcon className="h-4 w-4 text-gold-400 mr-2" />
                    <span className="text-gold-400 text-sm font-medium">All consultations are strictly confidential</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-white font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      className="input-dark w-full"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-white font-medium mb-2">Company Name *</label>
                    <input
                      type="text"
                      {...register('companyName', { 
                        required: 'Company name is required',
                        minLength: { value: 2, message: 'Company name must be at least 2 characters' }
                      })}
                      className="input-dark w-full"
                      placeholder="Enter your company name"
                    />
                    {errors.companyName && (
                      <p className="text-red-400 text-sm mt-1">{errors.companyName.message}</p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="input-dark w-full"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        {...register('phone', { 
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[+]?[1-9][\d]{0,15}$/,
                            message: 'Invalid phone number'
                          }
                        })}
                        className="input-dark w-full"
                        placeholder="+91 XXXXXXXXXX"
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Consultation Type */}
                  <div>
                    <label className="block text-white font-medium mb-2">Consultation Mode</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setConsultationType('office')}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          consultationType === 'office'
                            ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                            : 'border-dark-600 bg-dark-700 text-gray-300 hover:border-dark-500'
                        }`}
                      >
                        <MapPinIcon className="h-6 w-6 mx-auto mb-2" />
                        <span className="font-medium">Office Meeting</span>
                        <p className="text-xs mt-1 opacity-75">Preferred</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConsultationType('online')}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          consultationType === 'online'
                            ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                            : 'border-dark-600 bg-dark-700 text-gray-300 hover:border-dark-500'
                        }`}
                      >
                        <CalendarDaysIcon className="h-6 w-6 mx-auto mb-2" />
                        <span className="font-medium">Online Meeting</span>
                        <p className="text-xs mt-1 opacity-75">Available</p>
                      </button>
                    </div>
                  </div>

                  {/* Office Location Selection (only for office consultations) */}
                  {consultationType === 'office' && (
                    <div>
                      <label className="block text-white font-medium mb-2">Office Location</label>
                      <div className="grid grid-cols-1 gap-4">
                        <button
                          type="button"
                          onClick={() => setOfficeLocation('tis_hazari')}
                          className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                            officeLocation === 'tis_hazari'
                              ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                              : 'border-dark-600 bg-dark-700 text-gray-300 hover:border-dark-500'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <MapPinIcon className="h-5 w-5 mr-2" />
                            <span className="font-medium">Tis Hazari Courts Office</span>
                          </div>
                          <p className="text-xs opacity-75">257, Civil Wing, Tis Hazari Courts, Delhi – 110054</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setOfficeLocation('preet_vihar')}
                          className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                            officeLocation === 'preet_vihar'
                              ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                              : 'border-dark-600 bg-dark-700 text-gray-300 hover:border-dark-500'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <MapPinIcon className="h-5 w-5 mr-2" />
                            <span className="font-medium">Preet Vihar Office</span>
                          </div>
                          <p className="text-xs opacity-75">103, First Floor, Plot No. 6, LSC, Main Vikas Marg, New Rajdhani Enclave, Near Preet Vihar Metro Station, Delhi – 110092</p>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Date Selection */}
                  <div>
                    <label className="block text-white font-medium mb-2">Preferred Date *</label>
                    <div className="grid gap-2 max-h-48 overflow-y-auto">
                      {Object.keys(availableSlots).length > 0 ? (
                        Object.keys(availableSlots).slice(0, 10).map((date) => (
                          <button
                            key={date}
                            type="button"
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedTime(''); // Reset time when date changes
                            }}
                            className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                              selectedDate === date
                                ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                                : 'border-dark-600 bg-dark-700 text-gray-300 hover:border-dark-500'
                            }`}
                          >
                            <div className="font-medium">{formatDate(date)}</div>
                            <div className="text-xs opacity-75">
                              {availableSlots[date].length} slots available
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="text-gray-400 text-center py-4">Loading available dates...</p>
                      )}
                    </div>
                  </div>

                  {/* Time Selection */}
                  {selectedDate && availableSlots[selectedDate] && (
                    <div>
                      <label className="block text-white font-medium mb-2">Preferred Time *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots[selectedDate].map((slot) => {
                          const isHeldByOthers = slot.status === 'HELD' && slot.heldBySession !== sessionId;
                          const isBooked = slot.status === 'BOOKED';
                          const isAvailable = slot.status === 'AVAILABLE' || (slot.status === 'HELD' && slot.heldBySession === sessionId);

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={!isAvailable}
                              onClick={() => handleSlotSelection(slot.id, slot.time)}
                              className={`p-3 rounded-lg border text-center transition-all duration-300 ${
                                selectedSlotId === slot.id
                                  ? 'border-gold-500 bg-gold-500/10 text-gold-400'
                                  : isAvailable
                                  ? 'border-dark-600 bg-dark-700 text-gray-300 hover:border-dark-500'
                                  : 'border-red-900/30 bg-red-900/10 text-red-400/50 cursor-not-allowed'
                              }`}
                            >
                              <div className="text-sm font-medium">{formatTime(slot.time)}</div>
                              {!isAvailable && (
                                <div className="text-[10px] uppercase tracking-wider font-bold">
                                  {isBooked ? 'Booked' : 'Held'}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Legal Matter Description */}
                  <div>
                    <label className="block text-white font-medium mb-2">Nature of Legal Matter *</label>
                    <textarea
                      {...register('legalMatter', { 
                        required: 'Please describe your legal matter',
                        minLength: { value: 10, message: 'Please provide more details (at least 10 characters)' }
                      })}
                      rows={4}
                      className="input-dark w-full resize-none"
                      placeholder="Please provide a brief overview of your corporate legal matter. This information will help us prepare for your consultation."
                    />
                    {errors.legalMatter && (
                      <p className="text-red-400 text-sm mt-1">{errors.legalMatter.message}</p>
                    )}
                  </div>

                  {/* Consent Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        {...register('consent', { required: 'Please provide consent for data processing' })}
                        className="mt-1 mr-3"
                      />
                      <span className="text-gray-300 text-sm">
                        I consent to the collection and processing of my personal information for the purpose of legal consultation and communication.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="text-red-400 text-sm">{errors.consent.message}</p>
                    )}

                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        {...register('disclaimer', { required: 'Please acknowledge the disclaimer' })}
                        className="mt-1 mr-3"
                      />
                      <span className="text-gray-300 text-sm">
                        I understand that this form does not create an attorney-client relationship and that confidentiality is not established until a formal consultation agreement is signed.
                      </span>
                    </label>
                    {errors.disclaimer && (
                      <p className="text-red-400 text-sm">{errors.disclaimer.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedDate || !selectedTime}
                    className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="spinner mr-2"></div>
                        Booking Consultation...
                      </>
                    ) : (
                      <>
                        <CalendarDaysIcon className="h-5 w-5 mr-2" />
                        Schedule Consultation
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="section-padding bg-dark-900">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="card-dark p-6 text-center"
            >
              <ShieldCheckIcon className="h-12 w-12 text-gold-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Confidentiality Assured</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                All communications and consultations are protected by attorney-client privilege and strict confidentiality protocols.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="card-dark p-6 text-center"
            >
              <ClockIcon className="h-12 w-12 text-gold-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Prompt Response</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We respond to all consultation requests within 24 hours and emergency matters are given immediate attention.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="card-dark p-6 text-center"
            >
              <CheckCircleIcon className="h-12 w-12 text-gold-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-3">Professional Excellence</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every consultation is conducted with the highest standards of professional ethics and legal expertise.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bar Council Disclaimer */}
      <section className="section-padding bg-dark-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card-dark p-8 text-center border-gold-500/20"
          >
            <ExclamationTriangleIcon className="h-12 w-12 text-gold-500 mx-auto mb-4" />
            <h3 className="text-xl font-display font-semibold text-white mb-4">
              Professional Compliance Notice
            </h3>
            <p className="text-gray-300 leading-relaxed max-w-4xl mx-auto">
              <strong>{firmInfo?.disclaimer || 'As per the rules of the Bar Council of India, this website does not seek to advertise or solicit work in any manner.'}</strong>
            </p>
          </motion.div>
        </div>
      </section>

      <OTPModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        contactInfo={pendingBookingData?.phone}
        actionType="booking"
        onVerified={handleOtpVerified}
      />
    </>
  );
};

export default Contact;