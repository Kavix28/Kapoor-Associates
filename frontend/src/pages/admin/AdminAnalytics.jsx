/**
 * Kapoor & Associates Legal Platform
 * Advanced Analytics Dashboard
 */
import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';
import { 
  CurrencyRupeeIcon, BriefcaseIcon, UserGroupIcon, 
  TrendingUpIcon, PlusIcon, TrashIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const COLORS = ['#d4af37', '#1a1a2e', '#4f46e5', '#10b981', '#f59e0b', '#6b7280'];
const CASE_COLORS = {
  'OPEN': '#10b981',
  'IN_PROGRESS': '#f59e0b',
  'CLOSED': '#6b7280'
};

const AdminAnalytics = () => {
  const [caseStats, setCaseStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [clientStats, setClientStats] = useState(null);
  const [chatbotStats, setChatbotStats] = useState(null);
  const [revenueLog, setRevenueLog] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revenuePeriod, setRevenuePeriod] = useState(12); // 6 or 12

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRevenue, setNewRevenue] = useState({
    clientId: '',
    caseId: '',
    description: '',
    amount: '',
    type: 'CONSULTATION_FEE',
    receivedAt: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cases, revs, clis, bots, log, allClients] = await Promise.all([
        adminService.getAnalyticsCases(),
        adminService.getAnalyticsRevenue(),
        adminService.getClientAnalytics(),
        adminService.getAnalyticsChatbot(),
        adminService.getRevenue(),
        adminService.getClients()
      ]);
      setCaseStats(cases.data);
      setRevenueStats(revs.data);
      setClientStats(clis.data);
      setChatbotStats(bots.data);
      setRevenueLog(log.data);
      setClients(allClients.data);
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRevenue = async (e) => {
    e.preventDefault();
    try {
      await adminService.createRevenue(newRevenue);
      toast.success('Revenue entry added');
      setIsModalOpen(false);
      fetchData(); // Refresh
    } catch (error) {
      toast.error('Failed to add revenue');
    }
  };

  const handleDeleteRevenue = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await adminService.deleteRevenue(id);
        toast.success('Entry deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete entry');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Analytics...</div>;

  const filteredRevenuePerMonth = revenueStats.revenuePerMonth.slice(-revenuePeriod);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">📊 Advanced Analytics</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#d4af37] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#b8962d] transition-colors"
        >
          <PlusIcon className="w-5 h-5" /> Add Revenue Entry
        </button>
      </div>

      {/* Section 1: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value={`₹${revenueStats.totalRevenue.toLocaleString()}`} 
          icon={<CurrencyRupeeIcon className="w-8 h-8 text-[#d4af37]" />}
          change={((revenueStats.revenueThisMonth - revenueStats.revenueLastMonth) / (revenueStats.revenueLastMonth || 1) * 100).toFixed(1)}
        />
        <StatCard 
          title="Active Cases" 
          value={caseStats.openCases + caseStats.inProgressCases} 
          icon={<BriefcaseIcon className="w-8 h-8 text-[#d4af37]" />}
        />
        <StatCard 
          title="Total Clients" 
          value={clientStats.totalClients} 
          icon={<UserGroupIcon className="w-8 h-8 text-[#d4af37]" />}
        />
        <StatCard 
          title="Monthly Growth" 
          value={`+${clientStats.newClientsThisMonth}`} 
          icon={<TrendingUpIcon className="w-8 h-8 text-[#d4af37]" />}
          subtext="New clients this month"
        />
      </div>

      {/* Section 2: Revenue Trends */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Revenue Trends (INR)</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setRevenuePeriod(6)}
              className={`px-3 py-1 text-sm rounded ${revenuePeriod === 6 ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              6 Months
            </button>
            <button 
              onClick={() => setRevenuePeriod(12)}
              className={`px-3 py-1 text-sm rounded ${revenuePeriod === 12 ? 'bg-[#1a1a2e] text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              12 Months
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredRevenuePerMonth}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4af37" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="total" stroke="#d4af37" fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section 3: Pie & Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Case Distribution</h2>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'OPEN', value: caseStats.openCases },
                    { name: 'IN_PROGRESS', value: caseStats.inProgressCases },
                    { name: 'CLOSED', value: caseStats.closedCases }
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={CASE_COLORS.OPEN} />
                  <Cell fill={CASE_COLORS.IN_PROGRESS} />
                  <Cell fill={CASE_COLORS.CLOSED} />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-2xl font-bold block">{caseStats.totalCases}</span>
              <span className="text-xs text-gray-500">Total Cases</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Cases by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={caseStats.casesByType}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#d4af37" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section 4: Client Growth & Chatbot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Client Acquisition Growth</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={clientStats.clientsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1a1a2e" strokeWidth={2} dot={{ r: 4, fill: '#d4af37' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">AI Chatbot Performance</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <span className="block text-2xl font-bold text-green-700">{chatbotStats.helpfulPercent.toFixed(1)}%</span>
              <span className="text-sm text-green-600 font-medium">Helpful Rating</span>
            </div>
            <div className="p-4 bg-red-50 rounded-lg text-center">
              <span className="block text-2xl font-bold text-red-700">{chatbotStats.notHelpfulPercent.toFixed(1)}%</span>
              <span className="text-sm text-red-600 font-medium">Needs Improvement</span>
            </div>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chatbotStats.sessionsPerDay.slice(-7)}>
                <XAxis dataKey="date" tickFormatter={(v) => v.split('-')[2]} />
                <Tooltip />
                <Bar dataKey="count" fill="#1a1a2e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-xs text-gray-400 mt-2">Sessions per Day (Last 7 Days)</p>
          </div>
        </div>
      </div>

      {/* Section 6: Revenue Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Revenue Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {revenueLog.map((rev) => (
                <tr key={rev.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{rev.receivedAt}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {clients.find(c => c.id === rev.clientId)?.name || 'Unknown Client'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{rev.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(rev.type)}`}>
                      {rev.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{rev.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDeleteRevenue(rev.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">Add Revenue Entry</h3>
            <form onSubmit={handleAddRevenue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
                <select 
                  className="w-full border rounded-lg p-2 focus:ring-[#d4af37] focus:border-[#d4af37]"
                  required
                  value={newRevenue.clientId}
                  onChange={(e) => {
                    const clientId = e.target.value;
                    const client = clients.find(c => c.id === clientId);
                    setNewRevenue({...newRevenue, clientId, caseId: client?.cases?.[0]?.id || ''});
                  }}
                >
                  <option value="">-- Choose Client --</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg p-2"
                  required
                  placeholder="e.g., Initial Retainer - Case 402"
                  value={newRevenue.description}
                  onChange={(e) => setNewRevenue({...newRevenue, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (INR)</label>
                  <input 
                    type="number" 
                    className="w-full border rounded-lg p-2"
                    required
                    value={newRevenue.amount}
                    onChange={(e) => setNewRevenue({...newRevenue, amount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select 
                    className="w-full border rounded-lg p-2"
                    value={newRevenue.type}
                    onChange={(e) => setNewRevenue({...newRevenue, type: e.target.value})}
                  >
                    <option value="CONSULTATION_FEE">Consultation Fee</option>
                    <option value="RETAINER">Retainer</option>
                    <option value="FILING_FEE">Filing Fee</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Received Date</label>
                <input 
                  type="date" 
                  className="w-full border rounded-lg p-2"
                  required
                  value={newRevenue.receivedAt}
                  onChange={(e) => setNewRevenue({...newRevenue, receivedAt: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#1a1a2e] text-white px-6 py-2 rounded-lg font-medium"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon, change, subtext }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h3 className="text-xl font-bold text-gray-900">{value}</h3>
      {change && (
        <p className={`text-xs mt-1 font-bold ${parseFloat(change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {parseFloat(change) >= 0 ? '↗' : '↘'} {Math.abs(change)}%
          <span className="text-gray-400 font-normal ml-1">vs last month</span>
        </p>
      )}
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  </div>
);

const getTypeColor = (type) => {
  switch (type) {
    case 'RETAINER': return 'bg-purple-100 text-purple-700';
    case 'CONSULTATION_FEE': return 'bg-blue-100 text-blue-700';
    case 'FILING_FEE': return 'bg-amber-100 text-amber-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default AdminAnalytics;
