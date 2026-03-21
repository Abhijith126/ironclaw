import { ReactNode } from 'react';

export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Card } from './Card';
export { default as StatCard } from './StatCard';
export { default as Modal, ConfirmModal, AlertModal } from './Modal';
export { default as Badge } from './Badge';
export { default as SearchInput } from './SearchInput';
export { Loader } from './Loader';
export { default as PageHeader } from './PageHeader';
export { default as TipBox } from './TipBox';
export { default as EmptyState } from './EmptyState';
export { default as ChartTooltip } from './ChartTooltip';
export { default as LanguageSwitcher } from './LanguageSwitcher';
export { default as WeightChart } from './WeightChart';
export { default as SettingsMenuItem } from './SettingsMenuItem';

export const ListItem = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <li className={`flex items-start gap-2 text-sm text-silver ${className}`}>
    <span className="text-lime">•</span>
    {children}
  </li>
);
