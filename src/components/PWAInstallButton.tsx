import React, { useState } from 'react';
import { CheckCircle2, Download, Monitor, Share, Smartphone, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { FrameBlossom } from './FrameBlossom';
import { RoseEmblem } from './RoseEmblem';

export const PWAInstallButton: React.FC = () => {
  const { canNativeInstall, isInstalled, isIOS, install, markAsInstalled } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);
  const [dismissedForSession, setDismissedForSession] = useState(false);

  const showFloatingWindow = !isInstalled && !dismissedForSession;

  const handleInstallClick = async () => {
    if (canNativeInstall) {
      const outcome = await install();
      if (outcome === 'accepted') {
        setShowInstructions(false);
      }
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showFloatingWindow && (
          <motion.aside
            key="pwa-floating-window"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            aria-label="نافذة تثبيت تطبيق سريّنة"
            style={
              {
                '--frame-bg': 'rgba(255, 255, 255, 0.97)',
                '--rim-from': '#EAA8C5',
                '--rim-mid': '#D4BFF2',
                '--rim-to': '#F3D79B',
              } as React.CSSProperties
            }
            className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-5 sm:bottom-5 sm:w-[348px] z-40 srayna-top-frame rounded-2xl p-4 shadow-xl shadow-[#2D1B2E]/12 backdrop-blur-md"
          >
            <FrameBlossom size="sm" />

            <div className="flex items-start justify-between gap-2.5 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FDF2F8] to-[#F5F3FF] border border-[#F2D7E5] flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-[#DB2777]" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold text-[#2D1B2E] leading-tight">
                    ثبّتي تطبيق سريّنة
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#432F46] mt-0.5 leading-snug">
                    افتحيه من شاشتكِ وتصفّحي دون إنترنت
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDismissedForSession(true)}
                className="p-1.5 rounded-lg text-[#5C475E] hover:bg-[#FDF2F8] hover:text-[#DB2777] transition-colors shrink-0 cursor-pointer"
                aria-label="إغلاق نافذة التثبيت"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-l from-[#EC4899] via-[#DB2777] to-[#9333EA] text-white text-sm sm:text-base font-extrabold shadow-sm shadow-[#DB2777]/25 hover:brightness-105 transition-all whitespace-nowrap cursor-pointer"
            >
              <RoseEmblem variant="light" size={20} />
              <Download className="w-4 h-4 shrink-0" />
              <span>تثبيت التطبيق الآن</span>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {showInstructions && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1B2E]/45 backdrop-blur-xs"
          onClick={() => setShowInstructions(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-guide-title"
        >
          <div
            style={
              {
                '--rim-from': '#EAA8C5',
                '--rim-mid': '#D4BFF2',
                '--rim-to': '#F3D79B',
              } as React.CSSProperties
            }
            className="relative w-full max-w-md srayna-top-frame rounded-3xl p-6 shadow-xl text-right space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <FrameBlossom size="md" />

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

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowInstructions(false);
                  markAsInstalled();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#059669] text-white text-sm sm:text-base font-extrabold hover:bg-[#047857] transition-colors whitespace-nowrap cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>تمّ التثبيت</span>
              </button>
              <button
                type="button"
                onClick={() => setShowInstructions(false)}
                className="px-4 py-3 rounded-xl bg-[#FDF2F8] border border-[#F2D7E5] text-[#2D1B2E] text-sm sm:text-base font-bold hover:bg-[#FCE7F3] transition-colors whitespace-nowrap cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
