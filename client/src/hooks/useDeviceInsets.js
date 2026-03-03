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
      const top = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sat') || '0', 10) || 
                  (window.innerHeight > window.screen.height ? window.innerHeight - window.screen.height : 0);
      
      const bottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sab') || '0', 10) || 
                     (window.innerHeight < window.screen.height ? window.screen.height - window.innerHeight : 0);

      const computedStyle = getComputedStyle(document.documentElement);
      const cssTop = computedStyle.getPropertyValue('env(safe-area-inset-top, 0px)');
      const cssBottom = computedStyle.getPropertyValue('env(safe-area-inset-bottom, 0px)');

      const topInset = cssTop !== '0px' ? parseInt(cssTop, 10) : top;
      const bottomInset = cssBottom !== '0px' ? parseInt(cssBottom, 10) : bottom;

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
