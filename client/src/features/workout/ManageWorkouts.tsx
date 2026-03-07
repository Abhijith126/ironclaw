import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, GripVertical, Dumbbell } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ExercisePicker from './ExercisePicker';
import { userAPI } from '../../services/api';
import { Button, Card, Badge, DayCarousel } from '../../components/ui';
import { DAYS_OF_WEEK } from '../../constants';
import { useExerciseMap, useDayCarousel } from '../../hooks';
import type { ExerciseMap } from '../../hooks/useExerciseMap';

interface ScheduleExercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
}

function SortableExerciseRow({
  exercise,
  index,
  day,
  onRemove,
  onUpdate,
  exerciseMap,
}: {
  exercise: ScheduleExercise;
  index: number;
  day: string;
  onRemove: (day: string, index: number) => void;
  onUpdate: (day: string, index: number, field: string, value: number) => void;
  exerciseMap: ExerciseMap;
}) {
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

function ManageWorkouts({ onSave }: { onSave?: () => void }) {
  const [schedule, setSchedule] = useState<Record<string, ScheduleExercise[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const { t } = useTranslation();
  const { exerciseMap } = useExerciseMap();
  const { selectedDay, carouselPos, animated, selectDay, handleTouchStart, handleTouchEnd } =
    useDayCarousel('Monday');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const scheduleRes = await userAPI.getWeeklySchedule();
      const rawSchedule = scheduleRes.data.weeklySchedule || {};
      const normalized: Record<string, ScheduleExercise[]> = {};

      DAYS_OF_WEEK.forEach((day) => {
        normalized[day] = rawSchedule[day] || [];
      });

      setSchedule(normalized);
    } catch (err) {
      console.error('Failed to fetch schedule:', err);
      const empty: Record<string, ScheduleExercise[]> = {};
      DAYS_OF_WEEK.forEach((day) => (empty[day] = []));
      setSchedule(empty);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userAPI.updateWeeklySchedule({ weeklySchedule: schedule });
      onSave?.();
    } catch (err) {
      console.error('Failed to save schedule:', err);
    } finally {
      setSaving(false);
    }
  };

  const addExercise = (exercise: { id: string; name: string }) => {
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: [
        ...(prev[selectedDay] || []),
        {
          id: exercise.id,
          sets: 3,
          reps: 10,
          name: exercise.name,
        },
      ],
    }));
  };

  const removeExercise = (_day: string, index: number) => {
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((_, i) => i !== index),
    }));
  };

  const updateExercise = (_day: string, index: number, field: string, value: number) => {
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((ex, i) =>
        i === index ? { ...ex, [field]: value } : ex
      ),
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSchedule((prev) => {
        const exercises = [...prev[selectedDay]];
        const oldIndex = exercises.findIndex((_, i) => `${selectedDay}-${i}` === active.id);
        const newIndex = exercises.findIndex((_, i) => `${selectedDay}-${i}` === over.id);

        return {
          ...prev,
          [selectedDay]: arrayMove(exercises, oldIndex, newIndex),
        };
      });
    }
  };

  const exercises = schedule[selectedDay] || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl font-bold text-white">{t('manageWorkout.editSchedule')}</h2>
        <Button onClick={handleSave} loading={saving}>
          <Save size={16} />
          <span>{t('manageWorkout.save')}</span>
        </Button>
      </div>

      <DayCarousel
        carouselPos={carouselPos}
        animated={animated}
        onSelectDay={selectDay}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />

      <Card variant="secondary" className="overflow-hidden">
        <div className="flex items-center justify-center mb-4 gap-3">
          <span className="font-display font-bold text-white text-lg">{selectedDay}</span>
          <Badge variant={exercises.length > 0 ? 'primary' : 'default'}>
            {t('workout.exerciseCount', { count: exercises.length })}
          </Badge>
        </div>

        {exercises.length === 0 ? (
          <p className="text-center text-silver text-sm py-6">
            {t('workout.restDayAddHint')}
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={exercises.map((_, i) => `${selectedDay}-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-3">
                {exercises.map((ex, idx) => (
                  <SortableExerciseRow
                    key={`${selectedDay}-${idx}`}
                    exercise={ex}
                    index={idx}
                    day={selectedDay}
                    onRemove={removeExercise}
                    onUpdate={updateExercise}
                    exerciseMap={exerciseMap}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <button
          onClick={() => setShowPicker(true)}
          className="mt-4 w-full py-3 border border-dashed border-lime/30 rounded-xl text-lime text-sm font-semibold hover:bg-lime/5 transition-colors"
        >
          {t('workout.addExercise')}
        </button>
      </Card>

      {showPicker && (
        <ExercisePicker
          onSelect={addExercise}
          onClose={() => setShowPicker(false)}
          selectedIds={exercises.map((e) => e.id)}
        />
      )}
    </div>
  );
}

export default ManageWorkouts;
