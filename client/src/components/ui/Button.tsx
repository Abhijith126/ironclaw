import { forwardRef, ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    ...props
  },
  ref
) {
  const baseClasses = 'flex items-center justify-center gap-2 font-semibold rounded-xl transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-lime/20 disabled:opacity-70 disabled:cursor-not-allowed';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-lime text-obsidian hover:bg-lime-dim',
    secondary: 'bg-steel text-chalk hover:bg-iron',
    danger: 'border border-danger/30 text-danger hover:bg-danger/10',
    ghost: 'bg-transparent text-silver hover:bg-steel hover:text-chalk',
    success: 'bg-success text-white hover:bg-success/80',
    outline: 'border border-steel text-chalk hover:border-lime hover:text-lime',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'py-2 px-3 text-xs',
    md: 'py-3 px-4 text-sm',
    lg: 'py-3.5 px-5 text-base',
    xl: 'py-4 px-6 text-base',
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
});

export default Button;
