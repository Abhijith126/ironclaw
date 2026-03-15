import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { DownloadAPK } from '../../components/DownloadAPK';

const AuthForm = ({ onAuthSuccess }) => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    height: '',
    weight: '',
  });
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && formData.password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const credentials = { email: formData.email, password: formData.password };

      if (isLogin) {
        const response = await authAPI.login(credentials);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onAuthSuccess(response.data.user);
        navigate('/dashboard');
      } else {
        const registerData = {
          ...credentials,
          name: formData.name,
          age: parseInt(formData.age),
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
        };
        const response = await authAPI.register(registerData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onAuthSuccess(response.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || t('auth.authFailed');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(198,241,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,241,53,0.03)_1px,transparent_1px)] bg-size-[40px_40px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(198,241,53,0.08)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full max-w-100 flex flex-col gap-6">
        <div className="text-center">
          <div className="w-18 h-18 mx-auto mb-4 rounded-[20px] bg-lime flex items-center justify-center text-obsidian shadow-[0_8px_32px_rgba(198,241,53,0.3)]">
            <Dumbbell size={32} strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-[0.2em] text-lime">
            {t('app.name')}
          </h1>
          <p className="text-sm text-silver mt-2">
            {isLogin ? t('auth.welcomeBack') : t('auth.startJourney')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="px-4 py-3.5 bg-danger/10 border border-danger/30 rounded-xl text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-silver">
                <User size={14} /> <span>{t('auth.fullName')}</span>
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('auth.enterName')}
                required={!isLogin}
                disabled={isLoading}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-silver">
              <Mail size={14} /> <span>{t('auth.email')}</span>
            </label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('auth.emailPlaceholder')}
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-silver">
              <Lock size={14} /> <span>{t('auth.password')}</span>
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('auth.passwordPlaceholder')}
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>

          {!isLogin && (
            <div className="grid grid-cols-3 gap-3">
              {['age', 'height', 'weight'].map((field) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-silver">
                    {field === 'height'
                      ? t('settings.heightCm')
                      : field === 'weight'
                        ? t('settings.weightKg')
                        : t('settings.age')}
                  </label>
                  <Input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field === 'age' ? '25' : field === 'height' ? '175' : '70'}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          )}

          <Button type="submit" loading={isLoading} className="w-full mt-2">
            <span>{isLogin ? t('auth.signIn') : t('auth.createAccount')}</span>
            <ArrowRight size={18} />
          </Button>
        </form>



        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-silver">
            {isLogin ? t('auth.dontHaveAccount') : t('auth.alreadyHaveAccount')}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            disabled={isLoading}
            className="text-lime font-semibold bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
          >
            {isLogin ? t('auth.signUp') : t('auth.signIn')}
          </button>
        </div>

        <DownloadAPK />
        <div className="text-center pt-4 border-t border-steel">
          <p className="text-[10px] text-silver/70">{t('app.tagline')}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
