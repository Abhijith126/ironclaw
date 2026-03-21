import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  User,
  Lock,
  Save,
  Check,
  AlertCircle,
  Sun,
  Moon,
  Download,
  Upload,
  Info,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { userAPI } from '../../services/api';
import { Card, Button, Input, LanguageSwitcher, SettingsMenuItem } from '../../components/ui';
import { getInitials } from '../../utils';
import { useAuth } from '../../contexts';

interface SettingsProps {
  theme: string;
  toggleTheme: () => void;
  onLogout: () => void;
  onExport: () => void;
  onImportClick: () => void;
}

const Settings = ({
  theme,
  toggleTheme,
  onLogout,
  onExport,
  onImportClick,
}: SettingsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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

  const messageTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

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

  const showTimedMessage = (type: string, text: string) => {
    setMessage({ type, text });
    if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    messageTimerRef.current = setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
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

      showTimedMessage('success', t('settings.profileUpdated'));
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (err: unknown) {
      console.error('Profile update error:', err);
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      showTimedMessage('error', axiosErr.response?.data?.message || axiosErr.message || t('settings.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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
      showTimedMessage('success', t('settings.passwordChanged'));
      setPasswords({ current: '', new: '', confirm: '' });
      setShowPasswordForm(false);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      showTimedMessage('error', axiosErr.response?.data?.message || t('settings.passwordFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24">
      {/* Profile Header */}
      <div className="flex flex-col items-center pt-2 pb-6">
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-lime to-lime-dim flex items-center justify-center font-display font-bold text-2xl text-obsidian mb-3">
          {getInitials(String(user?.name || ''))}
        </div>
        <h2 className="font-display font-bold text-xl text-chalk">
          {String(user?.name || t('settings.defaultName'))}
        </h2>
        <span className="text-sm text-silver mt-0.5">{String(user?.email || '')}</span>
      </div>

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

      <div className="space-y-4">
        {/* Profile Form */}
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
              placeholder={t('settings.enterName')}
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
                  onClick={() => setProfile((prev) => ({ ...prev, weightUnit: 'kg' }))}
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
                  onClick={() => setProfile((prev) => ({ ...prev, weightUnit: 'lbs' }))}
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

        {/* Quick Actions */}
        <Card>
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="font-semibold text-chalk text-sm uppercase tracking-wider">
              {t('settings.preferences')}
            </h2>
          </div>

          <div className="space-y-0.5">
            <SettingsMenuItem
              icon={theme === 'light' ? Moon : Sun}
              label={theme === 'light' ? t('common.darkMode') : t('common.lightMode')}
              onClick={toggleTheme}
              trailing={
                <div
                  className="w-10 h-6 rounded-full relative transition-colors"
                  style={{ backgroundColor: theme === 'dark' ? '#c6f135' : '#2a2a2a' }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform"
                    style={{ left: theme === 'dark' ? '18px' : '2px' }}
                  />
                </div>
              }
            />

            <div className="p-3.5 rounded-xl">
              <LanguageSwitcher />
            </div>
          </div>
        </Card>

        {/* Data Management */}
        <Card>
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="font-semibold text-chalk text-sm uppercase tracking-wider">
              {t('settings.data')}
            </h2>
          </div>

          <div className="space-y-0.5">
            <SettingsMenuItem
              icon={Download}
              label={t('importExport.exportSchedule')}
              onClick={onExport}
            />
            <SettingsMenuItem
              icon={Upload}
              label={t('importExport.importSchedule')}
              onClick={onImportClick}
            />
          </div>
        </Card>

        {/* Security */}
        <Card>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center justify-between w-full bg-transparent border-none text-chalk text-sm"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center bg-lime/10 rounded-lg">
                <Lock size={18} className="text-lime" />
              </div>
              <h2 className="font-semibold">{t('settings.changePassword')}</h2>
            </div>
            <ChevronRight
              size={18}
              className={`text-iron transition-transform ${showPasswordForm ? 'rotate-90' : ''}`}
            />
          </button>

          {showPasswordForm && (
            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-4 mt-5 pt-4 border-t border-steel"
            >
              <Input
                label={t('settings.currentPassword')}
                name="current"
                type="password"
                value={passwords.current}
                onChange={handlePasswordChange}
                placeholder={t('settings.enterCurrentPassword')}
                required
              />

              <Input
                label={t('settings.newPassword')}
                name="new"
                type="password"
                value={passwords.new}
                onChange={handlePasswordChange}
                placeholder={t('settings.enterNewPassword')}
                required
                minLength={6}
              />

              <Input
                label={t('settings.confirmPassword')}
                name="confirm"
                type="password"
                value={passwords.confirm}
                onChange={handlePasswordChange}
                placeholder={t('settings.confirmNewPassword')}
                required
                minLength={6}
              />

              <Button type="submit" loading={loading} className="w-full">
                <Lock size={18} />
                <span>{t('settings.changePassword')}</span>
              </Button>
            </form>
          )}
        </Card>

        {/* About & Sign Out */}
        <Card>
          <div className="space-y-0.5">
            <SettingsMenuItem
              icon={Info}
              label={t('nav.about')}
              onClick={() => navigate('/about')}
            />
          </div>
        </Card>

        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full p-4 bg-transparent border border-danger/40 rounded-xl text-danger text-sm font-semibold hover:bg-danger hover:text-white hover:border-danger transition-all"
        >
          <LogOut size={18} />
          <span>{t('settings.signOut')}</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
