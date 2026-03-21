import { useTranslation } from 'react-i18next';
import { GripVertical, Dumbbell } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ScheduleExercise } from '../types';
import type { ExerciseMap } from '../../../hooks/useExerciseMap';

interface SortableExerciseRowProps {
  exercise: ScheduleExercise;
  index: number;
  day: string;
  onRemove: (day: string, index: number) => void;
  onUpdate: (day: string, index: number, field: string, value: number) => void;
  exerciseMap: ExerciseMap;
}

export default function SortableExerciseRow({
  exercise,
  index,
  day,
  onRemove,
  onUpdate,
  exerciseMap,
}: SortableExerciseRowProps) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${day}-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const exerciseData = exerciseMap[exercise.id];
  const imageUrl = exerciseData?.imageUrl;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-graphite/50 rounded-2xl border border-steel/50 min-h-28 ${
        isDragging ? 'border-lime shadow-lg shadow-lime/10 z-10' : ''
      }`}
    >
      <div className="w-14 h-14 rounded-xl bg-steel/50 overflow-hidden shrink-0 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={exercise.name} className="w-full h-full object-cover" />
        ) : (
          <Dumbbell size={24} className="text-silver" />
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
        <div>
          <span className="text-chalk text-base font-semibold truncate block">{exercise.name}</span>
        </div>

        <div className="flex w-full gap-2">
          <div className="flex items-center gap-1.5 flex-1">
            <input
              type="number"
              value={exercise.sets}
              onChange={(e) => onUpdate(day, index, 'sets', parseInt(e.target.value) || 0)}
              className="w-full h-9 px-2 bg-graphite border border-steel rounded-lg text-white text-center text-sm font-semibold"
              min="1"
            />
            <span className="text-silver text-xs">{t('workout.sets')}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-1">
            <input
              type="number"
              value={exercise.reps}
              onChange={(e) => onUpdate(day, index, 'reps', parseInt(e.target.value) || 0)}
              className="w-full h-9 px-2 bg-graphite border border-steel rounded-lg text-white text-center text-sm font-semibold"
              min="1"
            />
            <span className="text-silver text-xs">{t('workout.reps')}</span>
          </div>
        </div>

        <button
          onClick={() => onRemove(day, index)}
          className="w-full py-2 border border-danger/50 text-danger hover:bg-danger/10 rounded-lg transition-colors text-xs font-medium"
        >
          {t('workout.remove')}
        </button>
      </div>

      <button
        {...attributes}
        {...listeners}
        aria-label="Reorder exercise"
        className="cursor-grab active:cursor-grabbing p-2 text-silver hover:text-lime transition-colors"
      >
        <GripVertical size={20} />
      </button>
    </div>
  );
}
