import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dumbbell, ChevronRight } from 'lucide-react';
import { PageHeader, SearchInput, Badge, EmptyState } from '../../components/ui';
import { getExercises } from '../../services/api';
import ExerciseDetail from './components/ExerciseDetail';
import { MUSCLE_GROUPS, EQUIPMENT_FILTERS } from './constants';
import { getDifficultyVariant } from './utils';
import type { ExerciseDetail as ExerciseDetailType } from './types';

export default function ExercisesTracker() {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState<ExerciseDetailType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [search, setSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseDetailType | null>(null);

  useEffect(() => {
    getExercises()
      .then((data) => setExercises(data as ExerciseDetailType[]))
      .catch((err) => console.error('Failed to load exercises:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredExercises = useMemo(() => {
    return exercises
      .filter((ex) => {
        const muscleValue = ex.muscleGroup?.toLowerCase() || ex.category?.toLowerCase() || '';
        const equipmentValue = ex.equipment?.toLowerCase() || '';

        const matchesMuscle = selectedMuscle === 'all' ||
          muscleValue === selectedMuscle.toLowerCase();
        const matchesEquipment = !selectedEquipment ||
          equipmentValue.includes(selectedEquipment.toLowerCase()) ||
          (selectedEquipment === 'bodyweight' && equipmentValue === 'none');
        const matchesSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase());
        return matchesMuscle && matchesEquipment && matchesSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [exercises, selectedMuscle, selectedEquipment, search]);

  if (selectedExercise) {
    return <ExerciseDetail exercise={selectedExercise} onBack={() => setSelectedExercise(null)} />;
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t('exercises.title')} subtitle={t('exercises.browseLibrary')} />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {MUSCLE_GROUPS.map((muscle) => (
          <button
            key={muscle}
            onClick={() => setSelectedMuscle(muscle)}
            className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              selectedMuscle === muscle
                ? 'bg-lime text-obsidian shadow-lg shadow-lime/20'
                : 'bg-steel/60 text-silver hover:text-white hover:bg-iron'
            }`}
          >
            {t(`exercises.muscles.${muscle}`)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder={t('exercises.searchExercises')} />

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {EQUIPMENT_FILTERS.map((equip) => (
            <button
              key={equip || 'all'}
              onClick={() => setSelectedEquipment(equip)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                selectedEquipment === equip
                  ? 'bg-lime text-obsidian'
                  : 'bg-steel text-silver hover:text-white'
              }`}
            >
              {t(`exercises.equipmentFilter.${equip || 'all'}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-white">
          {selectedMuscle === 'all' ? t('exercises.allExercises') : t(`exercises.muscles.${selectedMuscle}`)}
        </span>
        <span className="text-xs text-silver">{t('exercises.exerciseCount', { count: filteredExercises.length })}</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-lime/30 border-t-lime rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="flex items-center gap-3 p-3 bg-muted rounded-xl border border-steel hover:border-iron transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-steel/50 shrink-0 flex items-center justify-center">
                {exercise.imageUrl ? (
                  <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-full object-cover" />
                ) : (
                  <Dumbbell size={20} className="text-silver" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-chalk text-sm font-semibold truncate">{exercise.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getDifficultyVariant(exercise.difficulty)} size="sm">
                    <span className="capitalize">{exercise.difficulty}</span>
                  </Badge>
                  <span className="text-[10px] text-silver capitalize">{exercise.equipment}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-steel group-hover:text-lime transition-colors shrink-0" />
            </button>
          ))}

          {filteredExercises.length === 0 && !loading && (
            <EmptyState
              icon={Dumbbell}
              title={t('exercises.noExercises')}
              message={t('exercises.noExercisesMessage')}
            />
          )}
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}
