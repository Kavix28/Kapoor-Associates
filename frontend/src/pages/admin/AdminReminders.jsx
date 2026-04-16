/**
 * Kapoor & Associates Legal Platform
 * Automated Hearing and Consultation Reminders Management
 */
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { 
  BellAlertIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminReminders = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [lastTriggered, setLastTriggered] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await adminService.getReminderLogs();
      setLogs(response.data);
    } catch (error) {
      toast.error('Failed to fetch reminder logs');
    } finally {
      setLoading(false);
    }
  };

  const handleManualTrigger = async () => {
    try {
      setTriggering(true);
      const response = await adminService.triggerReminders();
      const { hearingRemindersSent, consultationRemindersSent } = response.data;
      
      toast.success(
        `Sent ${hearingRemindersSent} hearing reminders and ${consultationRemindersSent} consultation reminders.`
      );
      setLastTriggered(new Date().toLocaleTimeString());
      fetchLogs();
    } catch (error) {
      toast.error('Failed to trigger reminders');
    } finally {
      setTriggering(false);
    }
  };

  const filteredLogs = filterType === 'ALL' 
    ? logs 
    : logs.filter(log => log.reminderType === filterType);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🔔 Reminder Management</h1>
          {lastTriggered && (
            <p className="text-sm text-gray-500 mt-1">Last manually triggered at: {lastTriggered}</p>
          )}
        </div>
        <button 
          onClick={handleManualTrigger}
          disabled={triggering}
          className="bg-[#1a1a2e] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#2e2e4a] disabled:opacity-50 transition-all shadow-lg"
        >
          {triggering ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <BellAlertIcon className="w-5 h-5" />
          )}
          {triggering ? 'Sending Reminders...' : 'Send Today\'s Reminders'}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 capitalize">Total Reminders Sent</p>
          <h3 className="text-2xl font-bold text-gray-900">{logs.filter(l => l.status === 'SENT').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 capitalize">Failures</p>
          <h3 className="text-2xl font-bold text-red-600">{logs.filter(l => l.status === 'FAILED').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 capitalize">Success Rate</p>
          <h3 className="text-2xl font-bold text-green-600">
            {logs.length > 0 ? ((logs.filter(l => l.status === 'SENT').length / logs.length) * 100).toFixed(1) : 0}%
          </h3>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Reminder History</h2>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg text-sm p-2 outline-none focus:ring-1 focus:ring-[#d4af37]"
            >
              <option value="ALL">All Types</option>
              <option value="HEARING">Hearings</option>
              <option value="CONSULTATION">Consultations</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center text-gray-400">Loading logs...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Channel</th>
                  <th className="px-6 py-4 font-semibold">Preview</th>
                  <th className="px-6 py-4 font-semibold">Sent At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className={`${log.status === 'FAILED' ? 'bg-red-50/30' : 'hover:bg-gray-50'} transition-colors`}>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${log.reminderType === 'HEARING' ? 'bg-indigo-100 text-indigo-700' : 'bg-cyan-100 text-cyan-700'}`}>
                        {log.reminderType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {log.status === 'SENT' ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                        )}
                        <span className={log.status === 'SENT' ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                          {log.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{log.channel}</td>
                    <td className="px-6 py-4 text-gray-600 italic">"{log.messagePreview}"</td>
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                      {new Date(log.sentAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">
                      No reminder logs found for this filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReminders;
