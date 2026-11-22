import React, { useState } from 'react';
import { Download, Monitor, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { RoseEmblem } from './RoseEmblem';

interface PWAInstallButtonProps {
  variant?: 'header' | 'hero';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { canNativeInstall, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (canNativeInstall) {
      const outcome = await install();
      if (outcome !== 'accepted') {
        return;
      }
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={
          variant === 'hero'
            ? 'inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-l from-[#EC4899] via-[#DB2777] to-[#9333EA] text-white text-sm sm:text-base font-extrabold shadow-md shadow-[#DB2777]/25 hover:brightness-105 transition-all whitespace-nowrap shrink-0 cursor-pointer'
            : 'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-l from-[#EC4899] via-[#DB2777] to-[#9333EA] text-white text-sm font-extrabold shadow-sm shadow-[#DB2777]/25 hover:brightness-105 transition-all whitespace-nowrap shrink-0 cursor-pointer'
        }
      >
        <RoseEmblem variant="light" size={variant === 'hero' ? 22 : 19} />
        <Download className="w-4 h-4 shrink-0" />
        <span>{variant === 'hero' ? 'ثبّتي التطبيق على جهازكِ' : 'ثبّتي التطبيق'}</span>
      </button>

      {showInstructions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1B2E]/45 backdrop-blur-xs"
          onClick={() => setShowInstructions(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
        >
          <div
            className="w-full max-w-md bg-white border border-[#FBCFE8] rounded-3xl p-6 shadow-xl text-right space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#9333EA] text-white flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </span>
                <div>
                  <h3 id="pwa-guide-title" className="text-lg font-extrabold text-[#2D1B2E]">
                    تثبيت تطبيق سريّنة Srayna
                  </h3>
                  <p className="text-sm font-semibold text-[#4A354C]">
                    افتحي المنصة مباشرة من شاشتكِ بدون متصفح
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className="p-2 rounded-xl text-[#4A354C] hover:bg-[#FDF2F8] cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isIOS ? (
              <div className="p-4 rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8] space-y-2.5 text-sm sm:text-base font-semibold text-[#2D1B2E]">
                <div className="font-extrabold text-[#9D174D] flex items-center gap-2">
                  <Share className="w-4 h-4 shrink-0" />
                  <span>على أجهزة iPhone و iPad (سفاري):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[#432F46]">
                  <li>اضغطي على أيقونة المشاركة (Share) في شريط المتصفح.</li>
                  <li>اختاري «إضافة إلى الشاشة الرئيسية» (Add to Home Screen).</li>
                  <li>اضغطي على «إضافة» ليظهر تطبيق سريّنة على شاشتكِ.</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#FDF2F8] border border-[#FBCFE8] space-y-1.5 text-sm sm:text-base font-semibold text-[#432F46]">
                  <div className="font-extrabold text-[#9D174D] flex items-center gap-2">
                    <Smartphone className="w-4 h-4 shrink-0" />
                    <span>على الهاتف واللوحة الرقمية (أندرويد):</span>
                  </div>
                  <p>اضغطي على قائمة المتصفح (⋮) بالأعلى ثم اختاري «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F5F3FF] border border-[#DDD6FE] space-y-1.5 text-sm sm:text-base font-semibold text-[#432F46]">
                  <div className="font-extrabold text-[#5B21B6] flex items-center gap-2">
                    <Monitor className="w-4 h-4 shrink-0" />
                    <span>على الحاسوب (Chrome / Edge):</span>
                  </div>
                  <p>اضغطي على أيقونة التثبيت الموجودة يمين شريط العنوان بالأعلى لتثبيت التطبيق فوراً.</p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="w-full py-3 rounded-xl bg-[#DB2777] text-white text-base font-extrabold hover:bg-[#BE185D] transition-colors cursor-pointer"
            >
              حسناً، فهمتِ
            </button>
          </div>
        </div>
      )}
    </>
  );
};
