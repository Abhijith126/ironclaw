import { useState, useEffect } from 'react';
import { User, Lock, Save, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { userAPI } from '../services/api';

const Settings = ({ user, setUser }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile();
        const userData = response.data.user;
        setProfile({
          name: userData.name || '',
          age: userData.age || '',
          height: userData.height || '',
          weight: userData.weight || '',
        });
        if (setUser) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await userAPI.updateProfile({
        name: profile.name,
        age: profile.age ? parseInt(profile.age) : null,
        height: profile.height ? parseInt(profile.height) : null,
        weight: profile.weight ? parseFloat(profile.weight) : null,
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      if (setUser && response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update profile';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.new.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      await userAPI.changePassword(passwords.current, passwords.new);
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-chalk">
            Settings
          </h1>
          <p className="text-sm text-silver mt-1">Manage your account and preferences</p>
        </div>

        {message.text && message.type === 'success' && (
          <div className="flex items-center gap-2 px-4 py-3 mb-4 bg-success/10 border border-success/30 rounded-xl text-success text-sm animate-fade-up">
            <Check size={18} />
            <span>{message.text}</span>
          </div>
        )}

        {message.text && message.type === 'error' && (
          <div className="flex items-center gap-2 px-4 py-3 mb-4 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm animate-fade-up">
            <AlertCircle size={18} />
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-6">
          <section className="p-5 bg-carbon border border-steel rounded-2xl">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 flex items-center justify-center bg-lime/10 rounded-lg">
                <User size={18} className="text-lime" />
              </div>
              <h2 className="font-semibold text-chalk">Profile Information</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-silver mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 bg-graphite border border-steel rounded-xl text-chalk placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-silver mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={profile.age}
                    onChange={handleProfileChange}
                    min="13"
                    max="120"
                    className="w-full px-3 py-3 bg-graphite border border-steel rounded-xl text-chalk text-center placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-silver mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={profile.height}
                    onChange={handleProfileChange}
                    min="50"
                    max="300"
                    className="w-full px-3 py-3 bg-graphite border border-steel rounded-xl text-chalk text-center placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
                    placeholder="175"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-silver mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={profile.weight}
                    onChange={handleProfileChange}
                    min="20"
                    max="500"
                    step="0.1"
                    className="w-full px-3 py-3 bg-graphite border border-steel rounded-xl text-chalk text-center placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
                    placeholder="70"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-lime border-none rounded-xl text-obsidian font-display font-bold tracking-wide hover:bg-lime-dim transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </form>
          </section>

          <section className="p-5 bg-carbon border border-steel rounded-2xl">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 flex items-center justify-center bg-lime/10 rounded-lg">
                <Lock size={18} className="text-lime" />
              </div>
              <h2 className="font-semibold text-chalk">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-silver mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="current"
                    value={passwords.current}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 bg-graphite border border-steel rounded-xl text-chalk placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-silver hover:text-chalk transition-colors"
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-silver mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="new"
                    value={passwords.new}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 bg-graphite border border-steel rounded-xl text-chalk placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-silver hover:text-chalk transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-silver mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirm"
                    value={passwords.confirm}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 bg-graphite border border-steel rounded-xl text-chalk placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-silver hover:text-chalk transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-lime border-none rounded-xl text-obsidian font-display font-bold tracking-wide hover:bg-lime-dim transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={18} />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
