import { LucideProps } from 'lucide-react';
import { Dumbbell } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: React.FC<LucideProps>;
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon = Dumbbell,
  title, 
  message,
  action,
  className = '' 
}) => {
  return (
    <div className={`bg-graphite border border-steel rounded-2xl p-8 text-center ${className}`}>
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center text-iron">
        <Icon size={28} />
      </div>
      <h3 className="font-display text-lg font-bold text-chalk mb-2">{title}</h3>
      <p className="text-sm text-silver max-w-[240px] mx-auto">
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
