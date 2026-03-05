import { useState, useEffect } from 'react';

export function useDeviceInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    bottom: 0,
    hasNotch: false,
    hasBottomInset: false,
  });

  useEffect(() => {
    const updateInsets = () => {
      const isAndroid = /android/i.test(navigator.userAgent);
      
      // For Android, calculate insets based on window vs screen dimensions
      let topInset = 0;
      let bottomInset = 0;
      
      if (isAndroid) {
        // Status bar height (approximate for most Android devices)
        topInset = window.innerHeight < window.screen.height ? window.screen.height - window.innerHeight - 48 : 24;
        // Navigation bar height
        bottomInset = window.innerWidth < window.screen.width ? 48 : 0;
      } else {
        // iOS uses safe-area-inset
        topInset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0', 10);
        bottomInset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0', 10);
      }

      setInsets({
        top: topInset,
        bottom: bottomInset,
        hasNotch: topInset > 0,
        hasBottomInset: bottomInset > 0,
      });
    };

    updateInsets();
    window.addEventListener('resize', updateInsets);
    return () => window.removeEventListener('resize', updateInsets);
  }, []);

  return insets;
}
