/**
 * Kapoor & Associates Legal Platform
 * Offline Status Banner
 */
import React, { useState, useEffect } from 'react';

const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#d4af37] text-[#1a1a2e] py-2 px-4 text-center text-sm font-bold z-[9999] shadow-md animate-in slide-in-from-top duration-300">
      ⚠️ You are offline. Showing cached data.
    </div>
  );
};

export default OfflineBanner;
