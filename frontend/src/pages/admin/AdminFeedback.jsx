import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  HandThumbUpIcon, 
  HandThumbDownIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

/**
 * Chatbot Feedback analysis view.
 */
const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFeedback();
  }, [page]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await adminService.getFeedback({ page, size: 10 });
      setFeedbacks(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 text-black font-bold">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800">Assistant Intelligence Feedback</h1>
          <p className="text-gray-500">Analyze user satisfaction with chatbot responses</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Session & Message</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Captured At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center italic">
                    <div className="flex items-center justify-center">
                      <div className="spinner h-6 w-6 border-2 border-gold-500 border-t-transparent animate-spin rounded-full"></div>
                    </div>
                  </td>
                </tr>
              ) : feedbacks.length > 0 ? (
                feedbacks.map((fb) => (
                  <tr key={fb.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-gold-500 mr-3 shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Session ID</p>
                          <p className="text-xs font-mono text-gray-400 truncate max-w-[200px]">{fb.sessionId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {fb.isHelpful ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                          <HandThumbUpIcon className="h-3 w-3 mr-1" /> HELPFUL
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-100">
                          <HandThumbDownIcon className="h-3 w-3 mr-1" /> UNHELPFUL
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {new Date(fb.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-20 text-center text-gray-400 italic font-bold uppercase tracking-widest">No feedback signals received yet.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 tracking-tight uppercase italic">Page {page + 1} of {totalPages}</p>
            <div className="flex space-x-2">
              <button 
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="p-2 border rounded hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button 
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="p-2 border rounded hover:bg-white disabled:opacity-30 transition-colors"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFeedback;
