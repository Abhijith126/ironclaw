import { Dumbbell, Download, Smartphone } from 'lucide-react';
import { Card } from '../components/ui';

const InstallPage = () => {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-6">
      <div className="max-w-md w-full flex flex-col gap-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-lime flex items-center justify-center text-obsidian">
            <Dumbbell size={36} strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-[0.15em] text-lime mb-2">
            IRON LOG
          </h1>
          <p className="text-silver">Install the app for the best experience</p>
        </div>

        <Card>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-lime/15 flex items-center justify-center text-lime flex-shrink-0">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Native Experience</h3>
                <p className="text-sm text-silver">Install as a standalone app for full-screen experience</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-lime/15 flex items-center justify-center text-lime flex-shrink-0">
                <Download size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Download APK</h3>
                <p className="text-sm text-silver">Get the latest Android version directly</p>
              </div>
            </div>

            <a
              href="/app-release.apk"
              download
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-lime text-obsidian font-semibold rounded-xl hover:bg-lime-dim transition-colors"
            >
              <Download size={18} />
              <span>Download APK</span>
            </a>
          </div>
        </Card>

        <a href="/" className="text-center text-silver text-sm hover:text-lime transition-colors">
          Back to app
        </a>
      </div>
    </div>
  );
};

export default InstallPage;
