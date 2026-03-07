import { useState, useEffect, useRef } from 'react';
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
import { userAPI, getExerciseMap } from '../../services/api';
import { Button, Card, Badge } from '../../components/ui';
import { DAYS_OF_WEEK } from '../../constants';

function SortableExerciseRow({ exercise, index, day, onRemove, onUpdate, exerciseMap }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${day}-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const exerciseData = exerciseMap[exercise.id] || {};
  const imageUrl = exerciseData.imageUrl;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-4 bg-graphite/50 rounded-2xl border border-steel/50 min-h-[7rem] ${
        isDragging ? 'border-lime shadow-lg shadow-lime/10 z-10' : ''
      }`}
    >
      <div className="w-14 h-14 rounded-xl bg-steel/50 overflow-hidden flex-shrink-0 flex items-center justify-center">
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
            <span className="text-silver text-xs">sets</span>
          </div>
          <div className="flex items-center gap-1.5 flex-1">
            <input
              type="number"
              value={exercise.reps}
              onChange={(e) => onUpdate(day, index, 'reps', parseInt(e.target.value) || 0)}
              className="w-full h-9 px-2 bg-graphite border border-steel rounded-lg text-white text-center text-sm font-semibold"
              min="1"
            />
            <span className="text-silver text-xs">reps</span>
          </div>
        </div>

        <button
          onClick={() => onRemove(day, index)}
          className="w-full py-2 border border-danger/50 text-danger hover:bg-danger/10 rounded-lg transition-colors text-xs font-medium"
        >
          Remove
        </button>
      </div>

      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-2 text-silver hover:text-lime transition-colors"
      >
        <GripVertical size={20} />
      </button>
    </div>
  );
}

function ManageWorkouts({ onSave }) {
  const [schedule, setSchedule] = useState({});
  const [exerciseMap, setExerciseMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [showPicker, setShowPicker] = useState(false);
  const scrollRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const selectedBtn = container.querySelector('[data-selected="true"]');
      if (selectedBtn) {
        const containerWidth = container.offsetWidth;
        const btnLeft = selectedBtn.offsetLeft;
        const btnWidth = selectedBtn.offsetWidth;
        const scrollPos = btnLeft - (containerWidth / 2) + (btnWidth / 2);
        container.scrollTo({ left: scrollPos, behavior: 'smooth' });
      }
    }
  }, [selectedDay]);

  const fetchData = async () => {
    try {
      const [scheduleRes, exerciseMapData] = await Promise.all([
        userAPI.getWeeklySchedule(),
        getExerciseMap(),
      ]);

      const rawSchedule = scheduleRes.data.weeklySchedule || {};
      const normalized = {};

      DAYS_OF_WEEK.forEach(day => {
        normalized[day] = rawSchedule[day] || [];
      });

      setSchedule(normalized);
      setExerciseMap(exerciseMapData);
    } catch (err) {
      console.error('Failed to fetch schedule:', err);
      const empty = {};
      DAYS_OF_WEEK.forEach(day => empty[day] = []);
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

  const addExercise = (exercise) => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), {
        id: exercise._id,
        sets: 3,
        reps: 10,
        name: exercise.name
      }],
    }));
    setShowPicker(false);
  };

  const removeExercise = (index) => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((_, i) => i !== index),
    }));
  };

  const updateExercise = (index, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((ex, i) =>
        i === index ? { ...ex, [field]: value } : ex
      ),
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSchedule(prev => {
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

  const getVisibleDays = () => {
    const selectedIndex = DAYS_OF_WEEK.indexOf(selectedDay);
    const days = [];
    for (let i = -3; i <= 3; i++) {
      const idx = (selectedIndex + i + 7) % 7;
      days.push({ day: DAYS_OF_WEEK[idx], offset: i });
    }
    return days;
  };

  const visibleDays = getVisibleDays();
  const exercises = schedule[selectedDay] || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-xl font-bold text-white">Edit Schedule</h2>
        <Button onClick={handleSave} loading={saving}>
          <Save size={16} />
          <span>Save</span>
        </Button>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {visibleDays.map(({ day, offset }) => {
          const distance = Math.abs(offset);
          const isSelected = selectedDay === day;
          const scale = isSelected ? 1.1 : 1 - distance * 0.05;
          const opacity = isSelected ? 1 : 0.5 - distance * 0.15;
          
          return (
            <button
              key={`${day}-${offset}`}
              data-selected={isSelected}
              onClick={() => setSelectedDay(day)}
              style={{ 
                scrollSnapAlign: 'center',
                transform: `scale(${scale})`,
                opacity,
              }}
              className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                isSelected
                  ? 'bg-lime text-obsidian shadow-lg shadow-lime/30'
                  : 'bg-graphite text-silver border border-steel hover:border-lime/50'
              }`}
            >
              {day.slice(0, 3)}
            </button>
          );
        })}
      </div>

      <Card variant="secondary" className="overflow-hidden">
        <div className="flex items-center justify-center mb-4 gap-3">
          <span className="font-display font-bold text-white text-lg">{selectedDay}</span>
          <Badge variant={exercises.length > 0 ? 'primary' : 'default'}>
            {exercises.length} exercises
          </Badge>
        </div>

        {exercises.length === 0 ? (
          <p className="text-center text-silver text-sm py-6">Rest day - tap below to add exercises</p>
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
          + Add Exercise
        </button>

        {showPicker && (
          <ExercisePicker
            onSelect={addExercise}
            onClose={() => setShowPicker(false)}
            selectedIds={exercises.map(e => e.id)}
          />
        )}
      </Card>
    </div>
  );
}

export default ManageWorkouts;
