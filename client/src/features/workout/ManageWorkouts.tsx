import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';
import ExercisePicker from './ExercisePicker';
import { userAPI, getExerciseMap } from '../../services/api';
import { Button, Card, Badge, Input } from '../../components/ui';
import { DAYS_OF_WEEK } from '../../constants';

function ManageWorkouts({ onSave }) {
  const [schedule, setSchedule] = useState({});
  const [exerciseMap, setExerciseMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null);
  const [showPicker, setShowPicker] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

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

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const addExercise = (day, exercise) => {
    setSchedule(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { 
        id: exercise._id, 
        sets: 3, 
        reps: 10,
        name: exercise.name 
      }],
    }));
    setShowPicker(null);
  };

  const removeExercise = (day, index) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const updateExercise = (day, index, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: prev[day].map((ex, i) => 
        i === index ? { ...ex, [field]: value } : ex
      ),
    }));
  };

  const addEmptyExercise = (day) => {
    setShowPicker(day);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-display text-xl font-bold text-white">Edit Schedule</h2>
        <Button onClick={handleSave} loading={saving}>
          <Save size={16} />
          <span>Save</span>
        </Button>
      </div>

      {DAYS_OF_WEEK.map((day) => {
        const exercises = schedule[day] || [];
        const isExpanded = expandedDay === day;
        
        return (
          <Card key={day} variant="secondary" className="overflow-hidden">
            <button
              onClick={() => toggleDay(day)}
              className="w-full flex items-center justify-between p-0 bg-transparent border-none"
            >
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-white">{day}</span>
                <Badge variant={exercises.length > 0 ? 'primary' : 'default'}>
                  {exercises.length} exercises
                </Badge>
              </div>
              {isExpanded ? (
                <ChevronUp size={20} className="text-silver" />
              ) : (
                <ChevronDown size={20} className="text-silver" />
              )}
            </button>

            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-steel">
                {exercises.length === 0 ? (
                  <p className="text-center text-silver text-sm py-4">Rest day</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {exercises.map((ex, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="flex-1 text-chalk text-sm truncate">{ex.name}</span>
                        <input
                          type="number"
                          value={ex.sets}
                          onChange={(e) => updateExercise(day, idx, 'sets', parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1.5 bg-graphite border border-steel rounded-lg text-white text-center text-sm"
                          min="1"
                        />
                        <span className="text-silver text-xs">sets</span>
                        <input
                          type="number"
                          value={ex.reps}
                          onChange={(e) => updateExercise(day, idx, 'reps', parseInt(e.target.value) || 0)}
                          className="w-14 px-2 py-1.5 bg-graphite border border-steel rounded-lg text-white text-center text-sm"
                          min="1"
                        />
                        <span className="text-silver text-xs">reps</span>
                        <button
                          onClick={() => removeExercise(day, idx)}
                          className="p-1.5 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => addEmptyExercise(day)}
                  className="mt-3 w-full py-2.5 border border-dashed border-lime/30 rounded-xl text-lime text-sm font-semibold hover:bg-lime/5 transition-colors"
                >
                  + Add Exercise
                </button>

                {showPicker === day && (
                  <ExercisePicker
                    onSelect={(ex) => addExercise(day, ex)}
                    onClose={() => setShowPicker(null)}
                    selectedIds={exercises.map(e => e.id)}
                  />
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

export default ManageWorkouts;
