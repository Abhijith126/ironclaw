import { useState, useRef, useMemo } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

const CATEGORY_NAMES = {
  chest: 'Chest',
  back: 'Back',
  shoulders: 'Shoulders',
  legs: 'Legs',
  arms: 'Arms',
  core: 'Core',
  cardio: 'Cardio',
};

export default function ExercisePicker({ value, onChange, exercises = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const selectedExercise = useMemo(() => {
    for (const category of Object.values(exercises)) {
      const found = category.exercises.find((ex) => ex.id === value);
      if (found) return found;
    }
    return null;
  }, [value, exercises]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return exercises;

    const searchLower = search.toLowerCase();
    const filtered = {};

    Object.entries(exercises).forEach(([key, category]) => {
      const matchingExercises = category.exercises.filter(
        (ex) =>
          ex.name.toLowerCase().includes(searchLower) ||
          ex.equipment.toLowerCase().includes(searchLower)
      );

      if (matchingExercises.length > 0) {
        filtered[key] = {
          ...category,
          exercises: matchingExercises,
        };
      }
    });

    return filtered;
  }, [search, exercises]);

  const totalResults = useMemo(() => {
    return Object.values(filteredCategories).reduce((sum, cat) => sum + cat.exercises.length, 0);
  }, [filteredCategories]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-3 bg-graphite border border-steel rounded-lg text-white font-medium flex items-center justify-between hover:border-iron transition-colors"
      >
        <span className={selectedExercise ? 'text-white' : 'text-silver/50'}>
          {selectedExercise ? selectedExercise.name : 'Select exercise'}
        </span>
        <ChevronDown
          size={18}
          className={`text-silver transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-carbon border border-steel rounded-xl shadow-2xl overflow-hidden max-h-[60vh] flex flex-col">
          <div className="p-3 border-b border-steel">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exercises..."
                className="w-full pl-9 pr-3 py-2.5 bg-muted border border-steel rounded-lg text-white placeholder-silver/50 text-sm focus:border-lime focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {search && (
              <p className="text-[10px] text-silver mt-2">
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {Object.keys(filteredCategories).length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-silver text-sm">No exercises found</p>
                <p className="text-silver/60 text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              Object.entries(filteredCategories).map(([categoryKey, category]) => (
                <div key={categoryKey}>
                  <div className="px-4 py-2 bg-muted/50 sticky top-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-silver">
                      {CATEGORY_NAMES[categoryKey] || category.name}
                    </p>
                  </div>
                  <div>
                    {category.exercises.map((exercise) => (
                      <button
                        key={exercise.id}
                        type="button"
                        onClick={() => handleSelect(exercise.id)}
                        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-steel/50 transition-colors ${
                          value === exercise.id ? 'bg-lime/10' : ''
                        }`}
                      >
                        <span
                          className={`text-sm ${
                            value === exercise.id ? 'text-lime' : 'text-white'
                          }`}
                        >
                          {exercise.name}
                        </span>
                        <span className="text-[10px] text-silver capitalize">
                          {exercise.equipment}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  function handleSelect(exerciseId) {
    onChange(exerciseId);
    setIsOpen(false);
    setSearch('');
  }
}
