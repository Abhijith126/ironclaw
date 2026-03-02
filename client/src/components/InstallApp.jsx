import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Heart, Shield, Zap, Smartphone, ExternalLink } from 'lucide-react';
import { userAPI } from '../services/api';

const InstallApp = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleDownload = () => {
    window.open('/app-release.apk', '_blank');
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(user ? '/dashboard' : '/')}
            className="text-silver hover:text-chalk transition-colors text-sm mb-4 flex items-center gap-1"
          >
            ← Back
          </button>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-chalk">
            Get Iron Log
          </h1>
          <p className="text-silver mt-2">The best workout tracker, now on your device</p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-lime/10 via-carbon to-carbon border border-steel rounded-2xl p-6 mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-lime/5 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-lime to-lime-dim rounded-2xl flex items-center justify-center">
              <span className="font-display text-2xl font-bold text-obsidian">IL</span>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-chalk">Iron Log</h2>
              <p className="text-sm text-silver">Version 1.0.0</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <Shield className="w-6 h-6 text-lime mx-auto mb-2" />
              <p className="text-xs text-silver">Secure</p>
            </div>
            <div className="text-center">
              <Zap className="w-6 h-6 text-lime mx-auto mb-2" />
              <p className="text-xs text-silver">Fast</p>
            </div>
            <div className="text-center">
              <Smartphone className="w-6 h-6 text-lime mx-auto mb-2" />
              <p className="text-xs text-silver">Offline</p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-4 bg-lime text-obsidian font-display font-bold rounded-xl hover:bg-lime-dim transition-all active:scale-[0.98]"
          >
            <Download size={20} />
            <span>Download for Android</span>
          </button>
          
          <p className="text-xs text-silver text-center mt-3">
            Requires Android 7.0 or later
          </p>
        </div>

        <div className="bg-carbon border border-steel rounded-2xl p-6 mb-6">
          <h3 className="font-display font-bold text-chalk mb-4">What's New</h3>
          <ul className="space-y-2 text-sm text-silver">
            <li className="flex items-start gap-2">
              <span className="text-lime">•</span>
              Track your daily workouts with ease
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime">•</span>
              Monitor weight progress over time
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime">•</span>
              Learn gym equipment with guides
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime">•</span>
              Dark mode support
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-lime/10 to-transparent border border-lime/20 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-lime" />
            <h3 className="font-display font-bold text-chalk">Support Development</h3>
          </div>
          <p className="text-sm text-silver mb-4">
            Help us keep Iron Log free and continuously improving. Your support makes a difference!
          </p>
          <a
            href="https://buymeacoffee.com/yourlink"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-steel text-chalk font-semibold rounded-xl hover:bg-iron transition-colors"
          >
            <Heart size={18} />
            <span>Buy me a coffee</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default InstallApp;
