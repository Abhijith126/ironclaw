import { Download } from 'lucide-react';
import { isRunningInApp } from '../utils/platform';

const APK_URL = import.meta.env.VITE_APK_URL || '/iron-log-release.apk';

export function DownloadAPK() {
  if (isRunningInApp()) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = APK_URL;
    link.download = 'iron-log-release.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 bg-steel hover:bg-lime/20 text-silver hover:text-lime border border-steel hover:border-lime rounded-xl transition-all duration-200"
    >
      <Download size={18} />
      <span>Download Android APK</span>
    </button>
  );
}
