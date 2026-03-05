import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Lock, Save, Check, AlertCircle } from 'lucide-react';
import { userAPI } from '../../services/api';
import { PageHeader, Card, Button, Input } from '../../components/ui';

const Settings = ({ user, setUser }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profile, setProfile] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    weightUnit: 'kg',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
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
          weightUnit: userData.weightUnit || 'kg',
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
        weightUnit: profile.weightUnit,
      });

      setMessage({ type: 'success', text: t('settings.profileUpdated') });
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
      setMessage({ type: 'error', text: t('settings.passwordsNotMatch') });
      return;
    }

    if (passwords.new.length < 6) {
      setMessage({ type: 'error', text: t('settings.passwordTooShort') });
      return;
    }

    setLoading(true);

    try {
      await userAPI.changePassword(passwords.current, passwords.new);
      setMessage({ type: 'success', text: t('settings.passwordChanged') });
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
        <PageHeader 
          title={t('settings.title')} 
          subtitle={t('settings.manageAccount')} 
        />

        {message.text && message.type === 'success' && (
          <div className="flex items-center gap-2 px-4 py-3 mb-4 bg-success/10 border border-success/30 rounded-xl text-success text-sm">
            <Check size={18} />
            <span>{message.text}</span>
          </div>
        )}

        {message.text && message.type === 'error' && (
          <div className="flex items-center gap-2 px-4 py-3 mb-4 bg-danger/10 border border-danger/30 rounded-xl text-danger text-sm">
            <AlertCircle size={18} />
            <span>{message.text}</span>
          </div>
        )}

        <div className="space-y-6">
          <Card>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 flex items-center justify-center bg-lime/10 rounded-lg">
                <User size={18} className="text-lime" />
              </div>
              <h2 className="font-semibold text-chalk">{t('settings.profile')}</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label={t('settings.fullName')}
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Enter your name"
              />

              <div className="grid grid-cols-3 gap-3">
                <Input
                  label={t('settings.age')}
                  name="age"
                  type="number"
                  value={profile.age}
                  onChange={handleProfileChange}
                  placeholder="25"
                  min="13"
                  max="120"
                />
                <Input
                  label={t('settings.heightCm')}
                  name="height"
                  type="number"
                  value={profile.height}
                  onChange={handleProfileChange}
                  placeholder="175"
                  min="50"
                  max="300"
                />
                <Input
                  label={`${t('settings.weightKg').replace('(kg)', '').trim()} (${profile.weightUnit})`}
                  name="weight"
                  type="number"
                  value={profile.weight}
                  onChange={handleProfileChange}
                  placeholder="70"
                  min="20"
                  max="500"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-silver mb-2">
                  {t('settings.weightUnit')}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setProfile(prev => ({ ...prev, weightUnit: 'kg' }))}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                      profile.weightUnit === 'kg'
                        ? 'bg-lime text-obsidian'
                        : 'bg-graphite border border-steel text-silver hover:text-chalk'
                    }`}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile(prev => ({ ...prev, weightUnit: 'lbs' }))}
                    className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
                      profile.weightUnit === 'lbs'
                        ? 'bg-lime text-obsidian'
                        : 'bg-graphite border border-steel text-silver hover:text-chalk'
                    }`}
                  >
                    lbs
                  </button>
                </div>
              </div>

              <Button type="submit" loading={loading} className="w-full">
                <Save size={18} />
                <span>{t('settings.saveChanges')}</span>
              </Button>
            </form>
          </Card>

          <Card>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 flex items-center justify-center bg-lime/10 rounded-lg">
                <Lock size={18} className="text-lime" />
              </div>
              <h2 className="font-semibold text-chalk">{t('settings.changePassword')}</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label={t('settings.currentPassword')}
                name="current"
                type="password"
                value={passwords.current}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
              />

              <Input
                label={t('settings.newPassword')}
                name="new"
                type="password"
                value={passwords.new}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                required
                minLength={6}
              />

              <Input
                label={t('settings.confirmPassword')}
                name="confirm"
                type="password"
                value={passwords.confirm}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
                minLength={6}
              />

              <Button type="submit" loading={loading} className="w-full">
                <Lock size={18} />
                <span>{t('settings.changePassword')}</span>
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
