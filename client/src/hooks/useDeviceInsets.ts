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
      const isCapacitor = typeof window.Android !== 'undefined';

      let topInset = 0;
      let bottomInset = 0;

      if (isAndroid || isCapacitor) {
        const screenHeight = window.screen.height;
        const screenWidth = window.screen.width;
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        // Status bar height (difference between screen and window height)
        topInset = screenHeight > windowHeight ? screenHeight - windowHeight - 48 : 24;
        topInset = Math.max(0, topInset);

        // Navigation bar height (difference between screen and window width, in height)
        bottomInset = screenHeight - windowHeight > 48 ? screenHeight - windowHeight : 0;
        bottomInset = Math.max(0, bottomInset);
      } else {
        // iOS uses safe-area-inset
        topInset = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0',
          10
        );
        bottomInset = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0',
          10
        );
      }

      setInsets({
        top: topInset,
        bottom: bottomInset,
        hasNotch: topInset > 20,
        hasBottomInset: bottomInset > 0,
      });
    };

    updateInsets();
    window.addEventListener('resize', updateInsets);
    return () => window.removeEventListener('resize', updateInsets);
  }, []);

  return insets;
}
