import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  MagnifyingGlassIcon, 
  UserCircleIcon,
  ChevronRightIcon,
  FolderPlusIcon,
  DocumentArrowUpIcon,
  TrashIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SparklesIcon,
  XMarkIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

/**
 * Client Management view for admins.
 */
const AdminClients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientProfile, setClientProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('cases');
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await adminService.getClients();
      setClients(res.data);
    } catch (error) {
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = async (client) => {
    setSelectedClient(client);
    setIsDrawerOpen(true);
    setLoading(true);
    try {
      const res = await adminService.getClientProfile(client.id);
      setClientProfile(res.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6 text-black">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-800">Client Portfolio</h1>
            <p className="text-gray-500">Manage registered clients and their case history</p>
          </div>
          <div className="relative group">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-bold">
          {filteredClients.map((client) => (
            <div 
              key={client.id}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gold-500/30 transition-all group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-gold-50 group-hover:text-gold-600 transition-colors">
                  <UserCircleIcon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{client.name}</h3>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">{client.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-50">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Cases</p>
                  <p className="text-lg font-bold text-gray-900">{client.caseCount}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Upcoming</p>
                  <p className="text-lg font-bold text-gold-600">{client.upcomingConsultations}</p>
                </div>
              </div>

              <button 
                onClick={() => handleViewProfile(client)}
                className="w-full py-2 bg-gray-50 text-gray-700 font-bold text-sm rounded-lg hover:bg-dark-900 hover:text-white transition-all flex items-center justify-center group/btn"
              >
                View Profile
                <ChevronRightIcon className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-white z-[70] shadow-2xl flex flex-col text-black font-bold"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedClient?.name}</h2>
                  <p className="text-sm text-gray-500 tracking-tight font-bold">{selectedClient?.email}</p>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <XMarkIcon className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 italic">
                {['cases', 'documents', 'consultations'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all
                      ${activeTab === tab ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-400 hover:text-gray-600'}
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="spinner h-8 w-8 border-2 border-gold-500 border-t-transparent animate-spin rounded-full"></div>
                  </div>
                ) : (
                  <TabContent tab={activeTab} data={clientProfile} onUpdate={() => handleViewProfile(selectedClient)} />
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

const TabContent = ({ tab, data, onUpdate }) => {
  const [showAddCase, setShowAddCase] = useState(false);

  if (tab === 'cases') return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800">Case Records</h3>
        <button 
          onClick={() => setShowAddCase(true)}
          className="flex items-center text-xs font-bold text-gold-600 hover:text-gold-700 bg-gold-50 px-3 py-1.5 rounded-lg border border-gold-200"
        >
          <FolderPlusIcon className="h-4 w-4 mr-2" />
          Add Case
        </button>
      </div>
      
      {data?.cases?.map(caseItem => (
        <CaseCard key={caseItem.id} caseItem={caseItem} onUpdate={onUpdate} />
      ))}

      {showAddCase && (
        <CaseFormModal 
          clientId={data.profile.id} 
          onClose={() => setShowAddCase(false)} 
          onSuccess={() => { setShowAddCase(false); onUpdate(); }} 
        />
      )}
    </div>
  );

  if (tab === 'documents') return (
    <div className="space-y-8">
      {data?.cases?.map(caseItem => (
        <div key={caseItem.id} className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h4 className="text-sm font-bold text-gray-700">{caseItem.title}</h4>
            <span className="text-[10px] text-gray-400 font-bold">{caseItem.caseNumber}</span>
          </div>
          
          <div className="space-y-3">
            {caseItem.documents?.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                <div className="flex items-center">
                  <DocumentArrowUpIcon className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-bold text-gray-800">{doc.fileName}</p>
                    <p className="text-[10px] text-gray-400 font-bold">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-1 px-2 text-[10px] bg-white border rounded hover:bg-gray-100 font-bold">View</a>
                  <button 
                    onClick={async () => {
                      if (window.confirm('Delete document?')) {
                        await adminService.deleteDocument(doc.id);
                        toast.success('Document deleted');
                        onUpdate();
                      }
                    }}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <DocumentUploadSection caseId={caseItem.id} clientId={data.profile.id} onUpload={onUpdate} />
        </div>
      ))}
    </div>
  );

  if (tab === 'consultations') return (
    <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
      {data?.consultations?.map(con => (
        <div key={con.id} className="relative">
          <div className={`absolute -left-[25px] top-1.5 w-4 h-4 rounded-full border-2 border-white 
            ${con.status === 'CONFIRMED' ? 'bg-green-500' : 
              con.status === 'CANCELLED' ? 'bg-red-500' : 'bg-amber-400'}`} 
          />
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-gray-500">{con.preferredDate}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white shadow-sm">
                {con.status}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-800">{con.preferredTime}</p>
            <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">"{con.legalMatter}"</p>
            
            {con.status === 'pending' && (
              <div className="mt-4 flex space-x-2">
                <button 
                  onClick={async () => { 
                    await adminService.updateConsultationStatus(con.id, 'CONFIRMED'); 
                    toast.success('Confirmed'); 
                    onUpdate(); 
                  }}
                  className="flex-1 py-1.5 text-[10px] font-bold uppercase bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Confirm
                </button>
                <button 
                  onClick={async () => { 
                    await adminService.updateConsultationStatus(con.id, 'CANCELLED'); 
                    toast.success('Cancelled'); 
                    onUpdate(); 
                  }}
                  className="flex-1 py-1.5 text-[10px] font-bold uppercase bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return null;
};

const CaseCard = ({ caseItem, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    status: caseItem.status, 
    nextHearingDate: caseItem.nextHearingDate ? caseItem.nextHearingDate.split('T')[0] : '',
    advocateNotes: caseItem.advocateNotes || ''
  });

  const handleUpdate = async () => {
    try {
      if (!caseItem.client) {
        toast.error('Client data missing for this case');
        return;
      }
      await adminService.updateCase(caseItem.client.id, caseItem.id, formData);
      toast.success('Case updated');
      setIsEditing(false);
      onUpdate();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Soft delete this case?')) {
      await adminService.deleteCase(caseItem.client.id, caseItem.id);
      toast.success('Case archived');
      onUpdate();
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-4 hover:border-gold-500/20 transition-all font-bold">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] text-gold-600 font-bold uppercase tracking-widest">{caseItem.caseType}</span>
          <h4 className="font-bold text-gray-900">{caseItem.title}</h4>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
          caseItem.status === 'OPEN' ? 'border-amber-500 text-amber-600 bg-amber-50' : 
          caseItem.status === 'IN_PROGRESS' ? 'border-blue-500 text-blue-600 bg-blue-50' :
          'border-green-500 text-green-600 bg-green-50'
        }`}>
          {caseItem.status}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Status</label>
              <select 
                className="w-full text-xs p-2 border rounded outline-none font-bold"
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Next Hearing</label>
              <input 
                type="date" 
                className="w-full text-xs p-2 border rounded outline-none font-bold"
                value={formData.nextHearingDate}
                onChange={e => setFormData({...formData, nextHearingDate: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1 uppercase">Advocate Notes</label>
            <textarea 
              className="w-full text-xs p-2 border rounded outline-none font-bold min-h-[80px]"
              value={formData.advocateNotes}
              onChange={e => setFormData({...formData, advocateNotes: e.target.value})}
            />
          </div>
          <div className="flex space-x-2 pt-2">
            <button onClick={handleUpdate} className="flex-1 py-2 bg-dark-900 text-white rounded-lg text-xs font-bold font-display uppercase tracking-widest hover:bg-gold-600 transition-colors">Save Changes</button>
            <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold font-display uppercase tracking-widest hover:bg-gray-300 transition-colors">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 line-clamp-2 italic font-bold">"{caseItem.description}"</p>
          {caseItem.nextHearingDate && (
            <div className="flex items-center text-xs font-bold text-gray-700 bg-white p-2 rounded border border-gray-100">
              <ClockIcon className="h-4 w-4 mr-2 text-amber-500" />
              Hearing: {new Date(caseItem.nextHearingDate).toLocaleDateString()}
            </div>
          )}
          <div className="flex space-x-2 pt-2">
            <button 
              onClick={() => setIsEditing(true)} 
              className="flex-1 flex items-center justify-center py-1.5 text-[10px] font-bold uppercase tracking-widest border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <PencilSquareIcon className="h-3 w-3 mr-1" /> Edit
            </button>
            <button 
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center py-1.5 text-[10px] font-bold uppercase tracking-widest border border-red-100 text-red-500 rounded hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="h-3 w-3 mr-1" /> Delete
            </button>
          </div>
        </>
      )}

      {/* AI Insight Section */}
      <AIInsightSection caseItem={caseItem} />
    </div>
  );
};

const AIInsightSection = ({ caseItem }) => {
  const [insight, setInsight] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      fetchInsights();
    }
  }, [isExpanded]);

  const fetchInsights = async () => {
    try {
      const res = await adminService.getCaseInsights(caseItem.id);
      setHistory(res.data);
      if (res.data.length > 0) {
        setInsight(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch insights', err);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await adminService.generateCaseInsight(caseItem.id);
      setInsight(res.data);
      setHistory([res.data, ...history]);
      setIsExpanded(true);
      toast.success('AI Insight generated');
    } catch (err) {
      toast.error('Failed to generate AI insight');
    } finally {
      setLoading(false);
    }
  };

  const isDataLimited = !caseItem.advocateNotes || caseItem.status === 'CLOSED';

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200 transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full" />
          ) : (
            <SparklesIcon className="h-4 w-4" />
          )}
          {loading ? 'Analyzing case with AI...' : '✨ Generate AI Insight'}
        </button>
        
        {history.length > 0 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            {isExpanded ? 'Hide' : 'Show'} AI Insight
          </button>
        )}
      </div>

      {isDataLimited && (
        <p className="text-[10px] text-amber-600 mb-2 italic">
          ⚠️ Limited data available — insight accuracy may be reduced.
        </p>
      )}

      {isExpanded && insight && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-4 bg-[#d4af37]/5 border border-[#d4af37]/20 rounded-xl space-y-3">
            <div>
              <h5 className="text-[10px] uppercase text-[#d4af37] font-bold tracking-widest mb-1">AI Summary</h5>
              <p className="text-xs text-gray-700 leading-relaxed">{insight.summary}</p>
            </div>
            <div>
              <h5 className="text-[10px] uppercase text-[#d4af37] font-bold tracking-widest mb-1">Suggested Next Steps</h5>
              <ol className="list-decimal list-inside text-xs text-gray-700 space-y-1">
                {insight.suggestedNextSteps?.split('\n').map((step, i) => (
                  <li key={i}>{step.replace(/^\d+\.\s*/, '')}</li>
                ))}
              </ol>
            </div>
            <div className="flex justify-between items-center pt-2 text-[9px] text-gray-400">
              <span>Generated via {insight.modelUsed}</span>
              <span>{new Date(insight.generatedAt).toLocaleString()}</span>
            </div>
            <button 
              onClick={handleGenerate}
              className="w-full text-[10px] py-1 border border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 rounded font-bold transition-colors"
            >
              Regenerate Insight
            </button>
          </div>

          <div className="border border-gray-100 rounded-lg overflow-hidden">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="w-full p-2 bg-gray-50 flex items-center justify-between text-[10px] uppercase font-bold text-gray-500"
            >
              <span>Insight History ({history.length})</span>
              <ChevronDownIcon className={`h-3 w-3 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </button>
            {showHistory && (
              <div className="p-3 space-y-3 bg-white max-h-40 overflow-y-auto">
                {history.map((h, i) => (
                  <div key={h.id} className="text-[10px] border-l-2 border-gray-100 pl-3 py-1">
                    <p className="text-gray-400 mb-1">{new Date(h.generatedAt).toLocaleString()}</p>
                    <p className="text-gray-600 line-clamp-2 italic">"{h.summary.substring(0, 80)}..."</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
}
    </div>
  );
};

const DocumentUploadSection = ({ caseId, clientId, onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Max 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await adminService.uploadDocument(clientId, caseId, formData);
      toast.success('Uploaded successfully');
      onUpload();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="pt-2">
      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="spinner h-6 w-6 border-2 border-gold-500 border-t-transparent animate-spin rounded-full mb-2"></div>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-2">
            <DocumentArrowUpIcon className="w-8 h-8 mb-2 text-gray-400" />
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest tracking-tight font-display">Click or Drag PDF</p>
          </div>
        )}
        <input type="file" className="hidden" accept=".pdf" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
};

const CaseFormModal = ({ clientId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    caseTitle: '',
    caseType: 'Civil',
    status: 'OPEN',
    description: '',
    nextHearingDate: '',
    advocateNotes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.createCase(clientId, formData);
      toast.success('Case created');
      onSuccess();
    } catch {
      toast.error('Creation failed');
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-black font-bold"
      >
        <div className="p-6 bg-dark-900 border-b border-dark-700">
           <h3 className="text-xl font-bold font-display text-white italic tracking-tighter">Initiate New Case Record</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Case Title</label>
              <input required className="w-full text-sm p-3 border rounded-xl outline-none focus:border-gold-500 transition-colors font-bold" value={formData.caseTitle} onChange={e => setFormData({...formData, caseTitle: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Type</label>
              <input required className="w-full text-sm p-3 border rounded-xl outline-none focus:border-gold-500 transition-colors font-bold" value={formData.caseType} onChange={e => setFormData({...formData, caseType: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Initial Status</label>
              <select className="w-full text-sm p-3 border rounded-xl outline-none focus:border-gold-500 transition-colors font-bold" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">Description</label>
            <textarea className="w-full text-sm p-3 border rounded-xl outline-none focus:border-gold-500 transition-colors font-bold min-h-[80px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold uppercase tracking-widest text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Discard</button>
            <button type="submit" className="flex-1 py-3 text-sm font-bold uppercase tracking-widest text-dark-900 bg-gold-500 rounded-xl hover:bg-gold-600 transition-colors">Create Case</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminClients;
