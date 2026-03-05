import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  subtitle, 
  action,
  className = '' 
}) => {
  return (
    <div className={`mb-2 ${action ? 'flex justify-between items-start' : ''} ${className}`}>
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-chalk">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-silver mt-1">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

interface SectionHeadingProps {
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({ 
  children, 
  action,
  className = '' 
}) => {
  return (
    <div className={`flex justify-between items-center mb-4 ${className}`}>
      <h3 className="font-display text-xs font-bold uppercase tracking-wider text-silver">
        {children}
      </h3>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
