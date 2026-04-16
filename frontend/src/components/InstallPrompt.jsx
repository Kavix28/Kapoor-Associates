/**
 * Kapoor & Associates Legal Platform
 * PWA Install Prompt
 */
import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show for mobile
      if (window.innerWidth < 768) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User installed the PWA');
    }
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white border border-gray-100 p-4 rounded-xl shadow-2xl z-[50] flex flex-col gap-3 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center text-[#d4af37] font-bold">
          K&A
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900">Install the K&A App</h4>
          <p className="text-xs text-gray-500">Access your cases quickly from your home screen.</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={handleInstall}
          className="flex-1 bg-[#d4af37] text-white py-2 rounded-lg text-xs font-bold"
        >
          Install App
        </button>
        <button 
          onClick={() => setShowPrompt(false)}
          className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-lg text-xs font-bold"
        >
          Not Now
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
