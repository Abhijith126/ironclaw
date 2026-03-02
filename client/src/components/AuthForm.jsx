import { useState } from 'react';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, ArrowRight } from 'lucide-react';

const AuthForm = ({ onAuthSuccess }) => {
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
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(198,241,53,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,241,53,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(198,241,53,0.08)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full max-w-[400px] flex flex-col gap-6">
        <div className="text-center">
          <div className="w-[72px] h-[72px] mx-auto mb-4 rounded-[20px] bg-lime flex items-center justify-center text-obsidian shadow-[0_8px_32px_rgba(198,241,53,0.3)]">
            <Dumbbell size={32} strokeWidth={2.5} />
          </div>
          <h1 className="font-display text-4xl font-extrabold tracking-[0.2em] text-lime">
            IRON LOG
          </h1>
          <p className="text-sm text-silver mt-2">
            {isLogin ? 'Welcome back, athlete' : 'Start your fitness journey'}
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
                <User size={14} /> <span>Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="px-4 py-3.5 bg-graphite border border-steel rounded-xl text-white placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
                placeholder="Enter your name"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-silver">
              <Mail size={14} /> <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-4 py-3.5 bg-graphite border border-steel rounded-xl text-white placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
              placeholder="you@example.com"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-silver">
              <Lock size={14} /> <span>Password</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="px-4 py-3.5 bg-graphite border border-steel rounded-xl text-white placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {!isLogin && (
            <div className="grid grid-cols-3 gap-3">
              {['age', 'height', 'weight'].map((field) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-silver">
                    {field === 'height'
                      ? 'Height (cm)'
                      : field === 'weight'
                        ? 'Weight (kg)'
                        : 'Age'}
                  </label>
                  <input
                    type="number"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="px-3 py-3 bg-graphite border border-steel rounded-xl text-white text-center placeholder-silver/50 focus:border-lime focus:ring-2 focus:ring-lime/20 outline-none transition-all"
                    placeholder={field === 'age' ? '25' : field === 'height' ? '175' : '70'}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full py-4 mt-2 bg-lime border-none rounded-xl text-obsidian font-display font-bold tracking-wide hover:bg-lime-dim transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {!window.matchMedia('(display-mode: standalone)').matches && (
          <div className="text-center pb-4">
            <button
              type="button"
              onClick={() => navigate('/install')}
              className="text-sm text-lime bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
            >
              Get the Android App
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-silver">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
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
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <div className="text-center pt-4 border-t border-steel">
          <p className="text-[10px] text-silver/70">
            Track your workouts. Build strength. Achieve goals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
