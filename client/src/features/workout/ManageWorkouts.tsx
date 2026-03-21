import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ExercisePicker from './ExercisePicker';
import SortableExerciseRow from './components/SortableExerciseRow';
import DayCarousel from './components/DayCarousel';
import { useDayCarousel } from './hooks/useDayCarousel';
import { userAPI } from '../../services/api';
import { Button, Card, Badge } from '../../components/ui';
import { DAYS_OF_WEEK } from '../../constants';
import { useExerciseMap } from '../../hooks';
import { getTodayName } from '../../utils';
import type { ScheduleExercise } from './types';

function ManageWorkouts({ onSave }: { onSave?: () => void }) {
  const [schedule, setSchedule] = useState<Record<string, ScheduleExercise[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const { t } = useTranslation();
  const { exerciseMap } = useExerciseMap();
  const todayName = useMemo(() => getTodayName(), []);
  const { selectedDay, carouselPos, animated, selectDay, handleTouchStart, handleTouchEnd } =
    useDayCarousel(todayName);

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

  const addExercise = (exercise: { id: string; name: string; imageUrl?: string }) => {
    setSchedule((prev) => ({
      ...prev,
      [selectedDay]: [
        ...(prev[selectedDay] || []),
        {
          id: exercise.id,
          sets: 3,
          reps: 10,
          name: exercise.name,
          imageUrl: exercise.imageUrl,
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

  const handleDragEnd = (event: { active: { id: string | number }; over: { id: string | number } | null }) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setSchedule((prev) => {
      const exercises = [...prev[selectedDay]];
      const oldIndex = exercises.findIndex((_, i) => `${selectedDay}-${i}` === active.id);
      const newIndex = exercises.findIndex((_, i) => `${selectedDay}-${i}` === over.id);

      if (oldIndex === -1 || newIndex === -1) return prev;

      return {
        ...prev,
        [selectedDay]: arrayMove(exercises, oldIndex, newIndex),
      };
    });
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
