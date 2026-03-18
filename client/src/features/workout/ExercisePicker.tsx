import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { getExerciseMap } from '../../services/api';
import { SearchInput, Badge } from '../../components/ui';

interface ExercisePickerProps {
  onSelect: (exercise: { id: string; name: string; imageUrl?: string; category?: string }) => void;
  onClose: () => void;
  selectedIds?: string[];
}

interface ExerciseMapEntry {
  id: string;
  name: string;
  equipment?: string;
  category?: string;
  imageUrl?: string;
}

function ExercisePicker({ onSelect, onClose, selectedIds = [] }: ExercisePickerProps) {
  const [exercises, setExercises] = useState<{ id: string; name: string; category?: string }[]>(
    []
  );
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchExercises();
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      handleClose();
    }
  };

  const fetchExercises = async () => {
    try {
      const map = (await getExerciseMap()) as Record<string, ExerciseMapEntry>;
      const exerciseList = Object.entries(map).map(([id, ex]) => ({
        id,
        name: ex.name,
        imageUrl: ex.imageUrl,
        category: ex.equipment
          ? ex.equipment.charAt(0).toUpperCase() + ex.equipment.slice(1)
          : undefined,
      }));
      setExercises(exerciseList);
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (ex: { id: string; name: string; imageUrl?: string; category?: string }) => {
    onSelect({ id: ex.id, name: ex.name, imageUrl: ex.imageUrl, category: ex.category });
    handleClose();
  };

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch =
      !search ||
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.category?.toLowerCase().includes(search.toLowerCase());
    const notSelected = !selectedIds.includes(ex.id);
    return matchesSearch && notSelected;
  });

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-end transition-colors duration-300 ${
        isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div
        className={`w-full bg-carbon border-t border-steel rounded-t-3xl transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85vh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-steel" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <h3 className="font-display text-lg font-bold text-chalk">{t('manageWorkout.selectExercise')}</h3>
          <button
            onClick={handleClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-steel/50 text-silver hover:text-chalk transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pb-3">
          <SearchInput value={search} onChange={setSearch} placeholder={t('manageWorkout.searchExercises')} />
        </div>

        {/* Exercise list */}
        <div
          className="overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]"
          style={{ maxHeight: 'calc(85vh - 160px)' }}
        >
          {loading ? (
            <div className="text-center py-8 text-silver">{t('common.loading')}</div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center py-8 text-silver">{t('common.noResults')}</div>
          ) : (
            <div className="space-y-2">
              {filteredExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleSelect(ex)}
                  className="w-full flex items-center justify-between p-4 bg-graphite/50 border border-steel/50 rounded-xl hover:bg-lime/10 hover:border-lime/30 active:scale-[0.98] transition-all text-left"
                >
                  <span className="text-chalk text-sm font-medium">{ex.name}</span>
                  {ex.category && (
                    <Badge size="sm" variant="outline">
                      {ex.category}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExercisePicker;
