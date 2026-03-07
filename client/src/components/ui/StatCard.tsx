import { LucideProps } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type StatCardVariant = 'default' | 'success' | 'danger' | 'warning' | 'muted';

interface StatCardProps {
  icon: React.FC<LucideProps>;
  label: string;
  value: number;
  unit?: string;
  trend?: number;
  variant?: StatCardVariant;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  variant = 'default',
  className = '',
}) => {
  const iconBgClasses: Record<StatCardVariant, string> = {
    default: 'bg-lime/15 text-lime',
    success: 'bg-success/15 text-success',
    danger: 'bg-danger/15 text-danger',
    warning: 'bg-warning/15 text-warning',
    muted: 'bg-steel/50 text-iron',
  };

  return (
    <div
      className={`bg-graphite border border-steel rounded-xl p-4 flex flex-col gap-2 ${className}`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBgClasses[variant]}`}
      >
        <Icon size={18} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-silver">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold text-white leading-none">{value}</span>
        {unit && <span className="text-[10px] text-silver">{unit}</span>}
      </div>
      {trend !== undefined && (
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${
            trend <= 0 ? 'text-success' : 'text-danger'
          }`}
        >
          {trend <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          {Math.abs(trend).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StatCard;
