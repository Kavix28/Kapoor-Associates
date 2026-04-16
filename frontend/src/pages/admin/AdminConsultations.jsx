import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleBottomCenterTextIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import toast from 'react-hot-toast';

/**
 * Administrative Consultation Scheduling and Calendar view.
 */
const AdminConsultations = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchConsultations();
  }, [dateRange]);

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const res = await adminService.getConsultations(dateRange);
      setConsultations(res.data);
    } catch (error) {
      toast.error('Failed to load consultations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminService.updateConsultationStatus(id, status);
      toast.success(`Booking ${status}`);
      fetchConsultations();
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const selectedDayBookings = consultations.filter(c => isSameDay(new Date(c.preferredDate), selectedDate));
  const hasBooking = (day) => consultations.some(c => isSameDay(new Date(c.preferredDate), day));

  return (
    <AdminLayout>
      <div className="flex flex-col xl:flex-row gap-8 min-h-[calc(100vh-160px)] text-black font-bold">
        {/* Left: Calendar Panel */}
        <div className="w-full xl:w-[450px] space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-display font-bold text-gray-800">{format(currentMonth, 'MMMM yyyy')}</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest py-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 italic">
              {calendarDays.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200
                    ${!isSameMonth(day, monthStart) ? 'text-gray-200 cursor-default' : 'text-gray-700 hover:bg-gold-50 hover:text-gold-600'}
                    ${isSameDay(day, selectedDate) ? 'bg-dark-900 text-white shadow-lg ring-2 ring-gold-500 ring-offset-2' : ''}
                  `}
                >
                  <span className="text-sm font-bold">{format(day, 'd')}</span>
                  {hasBooking(day) && (
                    <div className={`w-1 h-1 rounded-full mt-1 ${isSameDay(day, selectedDate) ? 'bg-white' : 'bg-gold-500'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <FunnelIcon className="h-4 w-4 mr-2 text-gold-500" />
              Filter Range
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">From</label>
                <input 
                  type="date" 
                  className="w-full text-xs p-2 border border-gray-200 rounded-lg outline-none focus:border-gold-500 font-bold"
                  value={dateRange.from}
                  onChange={e => setDateRange({...dateRange, from: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">To</label>
                <input 
                  type="date" 
                  className="w-full text-xs p-2 border border-gray-200 rounded-lg outline-none focus:border-gold-500 font-bold"
                  value={dateRange.to}
                  onChange={e => setDateRange({...dateRange, to: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking List Panel */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xl font-display font-bold text-gray-800">
                {format(selectedDate, 'MMM d, yyyy')}
              </h2>
              <p className="text-sm text-gray-500 font-bold">{selectedDayBookings.length} Appointment(s) Found</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="spinner h-8 w-8 border-2 border-gold-500 border-t-transparent animate-spin rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDayBookings.length > 0 ? (
                selectedDayBookings.map((booking) => (
                  <div 
                    key={booking.id}
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-gold-500/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center text-gold-600 font-bold text-lg">
                        {booking.preferredTime.substring(0, 5)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 flex items-center">
                          {booking.name}
                          <span className={`ml-3 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-tight border ${
                            booking.status === 'CONFIRMED' ? 'border-green-200 text-green-600 bg-green-50' : 
                            booking.status === 'CANCELLED' ? 'border-red-200 text-red-600 bg-red-50' : 'border-amber-200 text-amber-600 bg-amber-50'
                          }`}>
                            {booking.status}
                          </span>
                        </h3>
                        <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 font-bold">
                          <span className="flex items-center"><PhoneIcon className="h-3 w-3 mr-1" /> {booking.phone}</span>
                          <span className="flex items-center"><EnvelopeIcon className="h-3 w-3 mr-1 text-gold-500" /> {booking.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-64">
                       <p className="text-xs text-gray-500 italic line-clamp-2">
                        <ChatBubbleBottomCenterTextIcon className="h-3 w-3 inline mr-1 text-gold-500" />
                        "{booking.legalMatter}"
                       </p>
                    </div>

                    <div className="flex space-x-2 shrink-0">
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                            className="p-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all shadow-lg shadow-green-500/20"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
                            className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-lg shadow-red-500/20"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl py-20 flex flex-col items-center justify-center text-gray-400 italic">
                  <CalendarIcon className="h-12 w-12 mb-4 opacity-20" />
                  <p className="font-bold">Clear queue for this date.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminConsultations;
