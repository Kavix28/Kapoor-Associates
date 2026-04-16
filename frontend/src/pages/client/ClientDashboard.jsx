import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clientService } from '../../services/api';
import toast from 'react-hot-toast';
import { 
  UserCircleIcon, 
  FolderIcon, 
  DocumentTextIcon, 
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import OfflineBanner from '../../components/OfflineBanner';
import InstallPrompt from '../../components/InstallPrompt';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('cases'); // 'cases', 'documents', 'consultations', 'profile'
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const email = localStorage.getItem('clientEmail');

  useEffect(() => {
    if (!email) {
      navigate('/client/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await clientService.getProfile(email);
        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Session expired. Please login again.');
        navigate('/client/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [email, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('clientEmail');
    toast.success('Logged out successfully');
    navigate('/client/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="spinner h-10 w-10 border-2 border-gold-500 border-t-transparent animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 pt-20 pb-20 md:pb-12 px-4 md:px-8">
      <OfflineBanner />
      <InstallPrompt />
      
      <div className="max-w-7xl mx-auto">
        {/* Header - Hidden on mobile if not profile tab */}
        <div className={`md:flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6 ${activeTab !== 'profile' ? 'hidden md:flex' : 'flex'}`}>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Welcome, {profile?.name}</h1>
            <p className="text-gray-400 text-sm">Managing your legal interests with care and precision</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-dark-800 border border-dark-700 text-gray-300 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-all duration-300"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            Logout Securely
          </button>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden md:grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <ProfileSection profile={profile} />
            <AccountSecurityNote />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <CasesSection cases={profile?.cases} />
          </div>
        </div>

        {/* Mobile Layout - Tab Based */}
        <div className="md:hidden space-y-6">
          {activeTab === 'cases' && <CasesSection cases={profile?.cases} />}
          {activeTab === 'documents' && <DocumentsSection cases={profile?.cases} />}
          {activeTab === 'consultations' && <ConsultationsSection email={profile?.email} />}
          {activeTab === 'profile' && <ProfileSection profile={profile} />}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 px-2 py-3 flex justify-around items-center z-50">
        <NavButton active={activeTab === 'cases'} onClick={() => setActiveTab('cases')} icon={<BriefcaseIcon className="h-6 w-6" />} label="Cases" />
        <NavButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} icon={<DocumentDuplicateIcon className="h-6 w-6" />} label="Docs" />
        <NavButton active={activeTab === 'consultations'} onClick={() => setActiveTab('consultations')} icon={<CalendarIcon className="h-6 w-6" />} label="Bookings" />
        <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserCircleIcon className="h-6 w-6" />} label="Profile" />
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-gold-500' : 'text-gray-400'}`}>
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
  </button>
);

const ProfileSection = ({ profile }) => (
  <div className="card-dark p-6 border-gold-500/10 h-fit bg-dark-800 rounded-2xl border">
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center">
        <UserCircleIcon className="h-10 w-10 text-dark-900" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{profile?.name}</h3>
        <p className="text-gold-400 text-sm font-medium">{profile?.companyName || 'Individual'}</p>
      </div>
    </div>
    <div className="space-y-4 pt-4 border-t border-dark-700">
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold block mb-1">Email</label>
        <p className="text-gray-300 text-sm">{profile?.email}</p>
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold block mb-1">Phone</label>
        <p className="text-gray-300 text-sm">{profile?.phone}</p>
      </div>
      <div>
        <label className="text-xs text-gray-500 uppercase tracking-widest font-semibold block mb-1">Registered On</label>
        <p className="text-gray-300 text-sm">{new Date(profile?.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  </div>
);

const AccountSecurityNote = () => (
  <div className="bg-gradient-to-br from-dark-800 to-primary-950 p-6 rounded-2xl border border-gold-500/20">
    <ShieldCheckIcon className="h-10 w-10 text-gold-500 mb-4" />
    <h3 className="text-lg font-bold text-white mb-2">Legal Security</h3>
    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
      Your documents are protected by AES-256 encryption. We never share your data without explicit legal consent.
    </p>
    <div className="text-xs font-semibold text-gold-500 uppercase tracking-wider">
      System Status: Protected & Online
    </div>
  </div>
);

const CasesSection = ({ cases }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-display font-bold text-white flex items-center">
      <FolderIcon className="h-6 w-6 text-gold-500 mr-3" />
      Active Legal Matters
    </h2>
    {cases?.length > 0 ? (
      cases.map((caseItem) => (
        <motion.div 
          key={caseItem.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="card-dark overflow-hidden border-dark-600 hover:border-gold-500/30 transition-all duration-300 border bg-dark-800 rounded-2xl"
        >
          <div className="p-6 bg-dark-700/50 flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-1 block">
                Case # {caseItem.caseNumber}
              </span>
              <h3 className="text-xl font-bold text-white">{caseItem.title}</h3>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
              caseItem.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              {caseItem.status}
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-400 text-sm italic">"{caseItem.description}"</p>
            {caseItem.nextHearingDate && (
              <div className="mt-4 flex items-center text-xs font-bold text-amber-500">
                <ClockIcon className="h-4 w-4 mr-2" /> Expecting Hearing: {new Date(caseItem.nextHearingDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </motion.div>
      ))
    ) : <EmptyMatters /> }
  </div>
);

const DocumentsSection = ({ cases }) => (
  <div className="space-y-6">
     <h2 className="text-2xl font-display font-bold text-white">📄 Case Documents</h2>
     {cases?.map(caseItem => (
       <div key={caseItem.id} className="space-y-3">
         <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest">{caseItem.title}</h4>
         <div className="grid gap-3">
           {caseItem.documents?.map(doc => (
             <a key={doc.id} href={doc.fileUrl} target="_blank" className="p-4 bg-dark-800 border border-dark-700 rounded-xl flex justify-between items-center">
               <span className="text-sm font-medium text-white">{doc.fileName}</span>
               <DocumentDuplicateIcon className="h-4 w-4 text-gold-500" />
             </a>
           ))}
         </div>
       </div>
     ))}
  </div>
);

const ConsultationsSection = ({ email }) => (
  <div className="space-y-6">
     <h2 className="text-2xl font-display font-bold text-white">📅 Your Consultations</h2>
     <div className="p-6 bg-dark-800 rounded-2xl border border-dark-700 text-center">
        <p className="text-gray-400 text-sm">Please visit the web portal for detailed consultation history or to schedule new sessions.</p>
     </div>
  </div>
);

const EmptyMatters = () => (
  <div className="card-dark p-12 text-center border-dashed border-dark-600 bg-dark-800 rounded-2xl border">
    <FolderIcon className="h-16 w-16 text-dark-600 mx-auto mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">No Active Matters Found</h3>
    <p className="text-gray-400 max-w-sm mx-auto">
      There are currently no active legal cases registered to this profile.
    </p>
  </div>
);

export default ClientDashboard;
