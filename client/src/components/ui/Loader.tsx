import { Loader2 } from 'lucide-react';

type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  size?: LoaderSize;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses: Record<LoaderSize, string> = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-lime border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

const PageLoader = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 size={32} className="text-lime animate-spin" />
  </div>
);

export { Loader, PageLoader };
export default Loader;
