import { ChevronRight } from 'lucide-react';

interface SettingsMenuItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
  trailing?: React.ReactNode;
}

export default function SettingsMenuItem({
  icon: Icon,
  label,
  onClick,
  trailing,
}: SettingsMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-3.5 bg-transparent border-none rounded-xl text-chalk text-sm hover:bg-steel/30 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-silver" />
        <span>{label}</span>
      </div>
      {trailing ?? <ChevronRight size={18} className="text-iron" />}
    </button>
  );
}
