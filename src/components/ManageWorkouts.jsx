import React, { useState, useEffect, useRef, useCallback } from 'react';
import { workoutSchedules } from '../data/workoutTypes';
import { PlusCircle, Save, Trash2, Calendar } from 'lucide-react';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

function gatherExerciseOptions() {
  const map = {};
  Object.values(workoutSchedules).forEach(schedule => {
    schedule.weekly.forEach(day => {
      (day.exercises || []).forEach(ex => {
        map[ex.id] = ex.name;
      });
    });
  });
  return Object.entries(map).map(([id, name]) => ({ id, name }));
}

export default function ManageWorkouts({ scheduleKey = 'push-pull-legs', onSave }) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [userWeekly, setUserWeekly] = useState({});
  const options = gatherExerciseOptions();
  const lastExerciseRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('user-weekly');
    if (saved) {
      setUserWeekly(JSON.parse(saved));
    } else {
      const base = workoutSchedules[scheduleKey];
      const obj = {};
      if (base) {
        base.weekly.forEach(day => {
          obj[day.day] = (day.exercises || []).map(e => ({ id: e.id, sets: e.sets || 3, reps: e.reps || '' }));
        });
      }
      setUserWeekly(obj);
    }
  }, [scheduleKey]);

  const dayList = userWeekly[selectedDay] || [];

  function updateRow(idx, field, value) {
    const next = { ...userWeekly };
    next[selectedDay] = [...(next[selectedDay] || [])];
    next[selectedDay][idx] = { ...next[selectedDay][idx], [field]: value };
    setUserWeekly(next);
  }

  const scrollToNewExercise = useCallback(() => {
    // Use setTimeout to ensure DOM has updated after state change
    setTimeout(() => {
      if (lastExerciseRef.current) {
        lastExerciseRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  }, []);

  function addRow() {
    const next = { ...userWeekly };
    next[selectedDay] = [...(next[selectedDay] || []), { id: options[0]?.id || 'bench', sets: 3, reps: '8-12' }];
    setUserWeekly(next);
    scrollToNewExercise();
  }

  function removeRow(idx) {
    const next = { ...userWeekly };
    next[selectedDay] = [...(next[selectedDay] || [])];
    next[selectedDay].splice(idx, 1);
    setUserWeekly(next);
  }

  function save() {
    localStorage.setItem('user-weekly', JSON.stringify(userWeekly));
    if (onSave) onSave();
  }
  return (
    <div className="manage-card bg-gym-charcoal pop-in md:p-6 md:rounded-xl">
      {/* Mobile header */}
      <div className="md:hidden sticky top-0 bg-gym-charcoal/95 backdrop-blur z-10 -m-4 p-4 pb-3 border-b border-gym-steel">
        <h2 className="font-display text-2xl text-white mb-1">Edit Schedule</h2>
        <p className="text-xs text-gym-zinc">Select day and manage your exercises</p>
      </div>

      <div className="md:grid md:grid-cols-4 md:gap-6 md:p-4">
        {/* Days selector */}
        <aside className="mt-4 md:mt-0 md:col-span-1 md:mt-6 pt-6 md:pt-0">
          <div className="hidden md:block mb-6">
            <h3 className="font-display text-lg text-white mb-2 flex items-center gap-2"><Calendar size={20} /> Days</h3>
            <p className="text-xs text-gym-zinc">Pick a day to edit</p>
          </div>

          <div className="flex gap-2 overflow-x-auto overflow-y-hidden no-scrollbar pb-2 md:flex-col md:overflow-visible md:space-y-2 md:pb-0 day-scroll">
            {DAYS.map(d => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                aria-pressed={selectedDay === d}
                className={`day-pill flex-shrink-0 md:w-full flex items-center gap-3 md:justify-between transition-all ${
                  selectedDay === d 
                    ? 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/80 text-white shadow-lg shadow-[var(--accent)]/30' 
                    : 'bg-gym-muted text-gym-zinc hover:bg-gym-charcoal'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gym-charcoal/50 flex items-center justify-center text-sm font-bold">{d.slice(0,3)}</div>
                <div className="hidden md:block text-left leading-tight">
                  <div className="text-sm font-bold">{d}</div>
                  <div className="text-xs opacity-75">{(userWeekly[d] || []).length} ex</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Exercise editor */}
        <section className="md:col-span-3 mt-5 md:mt-0">
          <div className="mb-5 md:mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs text-gym-zinc uppercase tracking-widest font-bold">Editing</h4>
                <h3 className="font-display text-2xl text-white">{selectedDay}</h3>
              </div>
              <div className="flex gap-3">
                <button onClick={addRow} aria-label="Add exercise" className="icon-btn px-4 py-3 rounded-lg bg-[var(--accent)]/20 text-[var(--accent)] hover:bg-[var(--accent)]/30 transition-colors"><PlusCircle size={20} /> Add</button>
                <button onClick={save} aria-label="Save schedule" className="icon-btn px-4 py-3 rounded-lg bg-[var(--success)]/20 text-[var(--success)] hover:bg-[var(--success)]/30 transition-colors"><Save size={20} /> Save</button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pb-8 md:pb-0">
            {(dayList || []).length === 0 && (
              <div className="bg-gym-muted/40 rounded-xl p-5 text-center text-gym-zinc border border-gym-steel">
                <p className="font-semibold">No exercises yet</p>
                <p className="text-xs mt-1">Tap the + button to add your first one</p>
              </div>
            )}

            {(dayList || []).map((row, idx) => (
              <div 
                key={idx} 
                ref={idx === dayList.length - 1 ? lastExerciseRef : null}
                className="row-gradient p-4 rounded-xl flex flex-col gap-3 exercise-row"
              >
                <div>
                  <label className="text-xs text-gym-zinc font-bold uppercase tracking-wide">Exercise</label>
                  <select value={row.id} onChange={e => updateRow(idx, 'id', e.target.value)} className="w-full mt-2 bg-gym-charcoal border border-gym-steel text-white rounded-lg px-4 py-3 font-medium">
                    {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gym-zinc font-bold uppercase tracking-wide">Sets</label>
                    <input type="number" value={row.sets} onChange={e => updateRow(idx, 'sets', Number(e.target.value))} className="w-full mt-2 bg-gym-charcoal border border-gym-steel text-white rounded-lg px-4 py-3 font-medium" />
                  </div>
                  <div>
                    <label className="text-xs text-gym-zinc font-bold uppercase tracking-wide">Reps</label>
                    <input value={row.reps} onChange={e => updateRow(idx, 'reps', e.target.value)} className="w-full mt-2 bg-gym-charcoal border border-gym-steel text-white rounded-lg px-4 py-3 font-medium" />
                  </div>
                </div>

                <button onClick={() => removeRow(idx)} aria-label="Remove exercise" className="w-full py-3 rounded-lg bg-[var(--danger)]/20 text-[var(--danger)] font-bold active:scale-95 transition-transform flex items-center justify-center gap-2"><Trash2 size={18} /> Remove</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
