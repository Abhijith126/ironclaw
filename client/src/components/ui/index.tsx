export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Card, CardHeader, CardTitle, CardContent } from './Card';
export { default as StatCard } from './StatCard';
export { default as Modal, ConfirmModal, AlertModal, VideoModal } from './Modal';
export { default as Badge } from './Badge';
export { default as SearchInput } from './SearchInput';
export { Loader, PageLoader } from './Loader';
export { default as PageHeader, SectionHeading } from './PageHeader';
export { default as ExerciseItem } from './ExerciseItem';
export { default as TipBox } from './TipBox';
export { default as EmptyState } from './EmptyState';
export { default as ChartTooltip } from './ChartTooltip';
export { default as LanguageSwitcher } from './LanguageSwitcher';

export const PageTitle = ({ title, subtitle }) => (
  <div className="mb-6">
    <h1 className="font-display text-3xl font-extrabold tracking-tight text-chalk">
      {title}
    </h1>
    {subtitle && <p className="text-silver mt-2">{subtitle}</p>}
  </div>
);

export const SectionTitle = ({ children }) => (
  <h3 className="font-display font-bold text-chalk mb-4">{children}</h3>
);

export const ListItem = ({ children, className = '' }) => (
  <li className={`flex items-start gap-2 text-sm text-silver ${className}`}>
    <span className="text-lime">•</span>
    {children}
  </li>
);

export const Grid = ({ children, cols = 3, gap = 'gap-3' }) => (
  <div className={`grid ${cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-1'} ${gap}`}>
    {children}
  </div>
);
