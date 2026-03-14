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
      const topInset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0',
        10
      );
      const bottomInset = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0',
        10
      );

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
