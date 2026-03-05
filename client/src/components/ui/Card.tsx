import { ReactNode, HTMLAttributes } from 'react';

type CardVariant = 'default' | 'secondary' | 'elevated' | 'gradient' | 'ghost';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
}

const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default', ...props }) => {
  const variantClasses: Record<CardVariant, string> = {
    default: 'bg-graphite border border-steel rounded-2xl p-5',
    secondary: 'bg-muted border border-steel rounded-xl p-4',
    elevated: 'bg-carbon border border-steel rounded-2xl p-5',
    gradient: 'bg-gradient-to-br from-lime/10 via-carbon to-carbon border border-lime/20 rounded-2xl p-5',
    ghost: 'bg-transparent border-none rounded-xl p-0',
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`flex justify-between items-start mb-4 ${className}`}>{children}</div>
);

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h2 className={`font-display text-xl font-bold text-white ${className}`}>{children}</h2>
);

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

export default Card;
