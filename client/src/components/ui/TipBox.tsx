import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type TipBoxVariant = 'primary' | 'success' | 'warning' | 'danger';

interface TipBoxProps {
  children: ReactNode;
  variant?: TipBoxVariant;
  className?: string;
}

const TipBox: React.FC<TipBoxProps> = ({ children, variant = 'primary', className = '' }) => {
  const { t } = useTranslation();

  const variantClasses: Record<TipBoxVariant, string> = {
    primary: 'bg-lime/10 border border-lime/20 text-lime',
    success: 'bg-success/10 border border-success/20 text-success',
    warning: 'bg-warning/10 border border-warning/20 text-warning',
    danger: 'bg-danger/10 border border-danger/20 text-danger',
  };

  return (
    <div className={`rounded-xl p-4 ${variantClasses[variant]} ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1">{t('workout.proTip')}</p>
      <p className="text-xs text-silver leading-relaxed">{children}</p>
    </div>
  );
};

export default TipBox;
