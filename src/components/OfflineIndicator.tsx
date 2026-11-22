import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-[#FFFBEB] border-b border-[#FDE68A] px-4 py-2 text-center">
      <div className="max-w-6xl mx-auto inline-flex items-center gap-2 text-sm font-bold text-[#92400E]">
        <WifiOff className="w-4 h-4 shrink-0" />
        <span>أنتِ تتصفّحين التطبيق الآن دون اتصال بالإنترنت · يمكنكِ مواصلة الدروس والتمارين المحفوظة</span>
      </div>
    </div>
  );
};
