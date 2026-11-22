import { useCallback, useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const INSTALLED_STORAGE_KEY = 'srayna_pwa_installed_v1';

function checkStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: window-controls-overlay)').matches ||
    nav.standalone === true
  );
}

function readPersistedInstalled(): boolean {
  try {
    return localStorage.getItem(INSTALLED_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function persistInstalled(value: boolean) {
  try {
    if (value) {
      localStorage.setItem(INSTALLED_STORAGE_KEY, '1');
    } else {
      localStorage.removeItem(INSTALLED_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota / privacy errors
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(
    () => checkStandalone() || readPersistedInstalled()
  );
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    if (checkStandalone()) {
      persistInstalled(true);
      setIsInstalled(true);
    }

    const ua = window.navigator.userAgent;
    const iosDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIOS(iosDevice);

    // Check browser's getInstalledRelatedApps if available
    const navWithApps = window.navigator as Navigator & {
      getInstalledRelatedApps?: () => Promise<Array<unknown>>;
    };
    if (typeof navWithApps.getInstalledRelatedApps === 'function') {
      navWithApps
        .getInstalledRelatedApps()
        .then((apps) => {
          if (Array.isArray(apps) && apps.length > 0) {
            persistInstalled(true);
            setIsInstalled(true);
          }
        })
        .catch(() => {
          // Ignore unsupported browser errors
        });
    }

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayChange = () => {
      if (checkStandalone()) {
        persistInstalled(true);
        setIsInstalled(true);
      }
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Browser only fires beforeinstallprompt when app is not installed
      persistInstalled(false);
      setIsInstalled(false);
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      persistInstalled(true);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    mediaQuery.addEventListener('change', handleDisplayChange);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      mediaQuery.removeEventListener('change', handleDisplayChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const markAsInstalled = useCallback(() => {
    persistInstalled(true);
    setIsInstalled(true);
    setDeferredPrompt(null);
  }, []);

  const install = useCallback(async (): Promise<'accepted' | 'dismissed' | 'unavailable'> => {
    if (!deferredPrompt) return 'unavailable';
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      persistInstalled(true);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    return outcome;
  }, [deferredPrompt]);

  return {
    canNativeInstall: Boolean(deferredPrompt),
    isInstalled,
    isIOS,
    install,
    markAsInstalled,
  };
}
