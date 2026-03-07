import { Dispatch, SetStateAction } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-3 bg-graphite border border-steel rounded-xl text-white placeholder-silver/50 text-sm focus:border-lime focus:outline-none"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            onClear?.();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-silver hover:text-white"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
