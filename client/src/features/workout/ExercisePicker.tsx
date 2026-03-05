import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { getExerciseMap } from '../../services/api';
import { SearchInput, Badge } from '../../components/ui';

interface ExercisePickerProps {
  onSelect: (exercise: { id: string; name: string; category?: string }) => void;
  onClose: () => void;
  selectedIds?: string[];
}

interface ExerciseMapEntry {
  id: string;
  name: string;
  equipment?: string;
  category?: string;
}

function ExercisePicker({ onSelect, onClose, selectedIds = [] }: ExercisePickerProps) {
  const [exercises, setExercises] = useState<{ _id: string; name: string; category?: string }[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const map = await getExerciseMap() as Record<string, ExerciseMapEntry>;
      const exerciseList = Object.values(map).map((ex: ExerciseMapEntry) => ({
        _id: ex.id,
        name: ex.name,
        category: ex.category,
      }));
      setExercises(exerciseList);
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = !search || 
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      ex.category?.toLowerCase().includes(search.toLowerCase());
    const notSelected = !selectedIds.includes(ex._id);
    return matchesSearch && notSelected;
  });

  return (
    <div className="mt-4 p-4 bg-carbon border border-lime/30 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-white">Select Exercise</h4>
        <button onClick={onClose} className="text-silver hover:text-white">
          <X size={18} />
        </button>
      </div>
      
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search exercises..."
        className="mb-3"
      />

      {loading ? (
        <div className="text-center py-4 text-silver">Loading...</div>
      ) : filteredExercises.length === 0 ? (
        <div className="text-center py-4 text-silver">No exercises found</div>
      ) : (
        <div className="max-h-64 overflow-y-auto space-y-2">
          {filteredExercises.map((ex) => (
            <button
              key={ex._id}
              onClick={() => onSelect({ id: ex._id, name: ex.name, category: ex.category })}
              className="w-full flex items-center justify-between p-3 bg-steel/30 rounded-xl hover:bg-lime/10 transition-colors text-left"
            >
              <span className="text-white text-sm">{ex.name}</span>
              {ex.category && (
                <Badge size="sm" variant="outline">{ex.category}</Badge>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExercisePicker;
