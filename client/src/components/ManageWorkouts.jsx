import { useState, useEffect, useRef, useCallback } from 'react';
import { PlusCircle, Save, Trash2 } from 'lucide-react';
import { userAPI, transformExercisesForPicker } from '../services/api';
import ExercisePicker from './ExercisePicker';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ManageWorkouts({ onSave }) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [userWeekly, setUserWeekly] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [exercises, setExercises] = useState({});
  const lastExerciseRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, exercisesData] = await Promise.all([
          userAPI.getWeeklySchedule(),
          transformExercisesForPicker(),
        ]);
        
        const schedule = scheduleRes.data.weeklySchedule;
        if (schedule && Object.keys(schedule).length > 0) {
          const normalized = {};
          Object.entries(schedule).forEach(([key, value]) => {
            normalized[key] = value || [];
          });
          setUserWeekly(normalized);
        } else {
          const obj = {};
          DAYS.forEach((day) => (obj[day] = []));
          setUserWeekly(obj);
        }
        
        setExercises(exercisesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        const obj = {};
        DAYS.forEach((day) => (obj[day] = []));
        setUserWeekly(obj);
      }
    };
    fetchData();
  }, []);

  const dayList = userWeekly[selectedDay] || [];

  function updateRow(idx, field, value) {
    const next = { ...userWeekly };
    next[selectedDay] = [...(next[selectedDay] || [])];
    next[selectedDay][idx] = { ...next[selectedDay][idx], [field]: value };
    setUserWeekly(next);
  }

  const scrollToNewExercise = useCallback(() => {
    setTimeout(() => {
      if (lastExerciseRef.current) {
        lastExerciseRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 100);
  }, []);

  function addRow() {
    const next = { ...userWeekly };
    next[selectedDay] = [
      ...(next[selectedDay] || []),
      { id: 'bench-press', sets: 3, reps: '8-12' },
    ];
    setUserWeekly(next);
    scrollToNewExercise();
  }

  function removeRow(idx) {
    const next = { ...userWeekly };
    next[selectedDay] = [...(next[selectedDay] || [])];
    next[selectedDay].splice(idx, 1);
    setUserWeekly(next);
  }

  async function save() {
    setIsSaving(true);
    try {
      await userAPI.updateWeeklySchedule({ weeklySchedule: userWeekly });
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving weekly schedule:', error);
      localStorage.setItem('user-weekly', JSON.stringify(userWeekly));
      if (onSave) onSave();
    }
    setTimeout(() => setIsSaving(false), 300);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3.5 py-2.5 rounded-xl border transition-all min-w-[54px] ${
              selectedDay === d ? 'bg-lime border-lime' : 'bg-muted border-steel active:scale-95'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                selectedDay === d ? 'text-obsidian' : 'text-silver'
              }`}
            >
              {d.slice(0, 3)}
            </span>
            <span
              className={`text-xs font-bold ${selectedDay === d ? 'text-obsidian' : 'text-chalk'}`}
            >
              {(userWeekly[d] || []).length}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-graphite border border-steel rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-base font-bold text-white">{selectedDay}</h3>
          <span className="text-[10px] text-silver">{dayList.length} exercises</span>
        </div>

        <div className="flex flex-col gap-3">
          {dayList.length === 0 && (
            <div className="py-8 text-center">
              <p className="font-semibold text-silver">No exercises for this day</p>
              <p className="text-xs text-silver/70 mt-1">Tap the button below to add one</p>
            </div>
          )}

          {dayList.map((row, idx) => (
            <div
              key={idx}
              ref={idx === dayList.length - 1 ? lastExerciseRef : null}
              className="bg-muted border border-steel rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-silver">
                  Exercise
                </label>
                <ExercisePicker 
                  value={row.id} 
                  onChange={(val) => updateRow(idx, 'id', val)}
                  exercises={exercises}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-silver">
                    Sets
                  </label>
                  <input
                    type="number"
                    value={row.sets}
                    onChange={(e) => updateRow(idx, 'sets', Number(e.target.value))}
                    className="px-3 py-3 bg-graphite border border-steel rounded-lg text-white text-center font-medium focus:border-lime outline-none transition-colors"
                    min="1"
                    max="20"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-silver">
                    Reps
                  </label>
                  <input
                    value={row.reps}
                    onChange={(e) => updateRow(idx, 'reps', e.target.value)}
                    className="px-3 py-3 bg-graphite border border-steel rounded-lg text-white text-center font-medium focus:border-lime outline-none transition-colors"
                    placeholder="8-12"
                  />
                </div>
              </div>

              <button
                onClick={() => removeRow(idx)}
                className="flex items-center justify-center gap-2 py-2.5 border border-danger/30 rounded-lg text-danger text-sm font-semibold hover:bg-danger/10 transition-colors active:scale-[0.98]"
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={addRow}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-steel text-chalk font-semibold rounded-xl hover:bg-iron transition-colors active:scale-[0.98]"
        >
          <PlusCircle size={18} />
          <span>Add Exercise</span>
        </button>

        <button
          onClick={save}
          disabled={isSaving}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-lime text-obsidian font-semibold rounded-xl hover:bg-lime-dim transition-colors active:scale-[0.98] disabled:opacity-70"
        >
          <Save size={18} />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
}
