import { ReactNode } from 'react';
import { CheckCircle, Circle, Edit } from 'lucide-react';
import { Exercise } from '../../types';

interface ExerciseItemProps {
  exercise: Exercise;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  onEditPR: (exercise: Exercise) => void;
  editingPR: string | null;
  prValues: { weight: string; reps: string };
  onPRChange: (id: string, field: 'weight' | 'reps', value: string) => void;
  onSavePR: (id: string) => void;
  showPR?: boolean;
  doneLabel?: string;
  setPRLabel?: string;
  updatePRLabel?: string;
  className?: string;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({
  exercise,
  isCompleted,
  onToggle,
  onEditPR,
  editingPR,
  prValues,
  onPRChange,
  onSavePR,
  showPR = false,
  doneLabel = 'Done',
  setPRLabel = '+ Set Your PR',
  updatePRLabel = 'Update Your PR',
  className = ''
}) => {
  const { id, name, sets, reps, pr } = exercise;
  
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isCompleted
          ? 'bg-gradient-to-br from-success/15 to-success/5 border-success/30'
          : 'bg-muted border-steel hover:border-iron'
      } ${className}`}
    >
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isCompleted 
            ? 'bg-success text-white' 
            : 'bg-steel/50 text-iron'
        }`}>
          {isCompleted ? (
            <CheckCircle size={24} strokeWidth={2.5} />
          ) : (
            <Circle size={24} strokeWidth={1.5} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`font-display font-bold text-lg ${
            isCompleted ? 'text-white/60 line-through' : 'text-white'
          }`}>
            {name}
          </p>
          <p className={`text-sm ${isCompleted ? 'text-white/40' : 'text-silver'}`}>
            {sets} sets × {reps}
          </p>
        </div>

        {isCompleted && (
          <span className="flex-shrink-0 px-3 py-1.5 bg-success rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
            {doneLabel}
          </span>
        )}
      </button>

      {(showPR || editingPR === id) && (
        <div 
          className="px-4 pb-4 pt-0"
          onClick={(e) => e.stopPropagation()}
        >
          {editingPR === id ? (
            <div className="mt-3 p-4 bg-carbon/80 rounded-xl border border-lime/30">
              <p className="text-[10px] font-bold uppercase tracking-wider text-lime mb-3">
                {updatePRLabel}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={prValues.weight}
                    onChange={(e) => onPRChange(id, 'weight', e.target.value)}
                    className="w-full px-4 py-3 bg-graphite border border-lime/50 rounded-xl text-white text-center font-display font-bold text-lg focus:border-lime outline-none"
                    placeholder="0"
                    autoFocus
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-silver">kg</span>
                </div>
                <span className="text-lime text-xl font-bold">×</span>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    value={prValues.reps}
                    onChange={(e) => onPRChange(id, 'reps', e.target.value)}
                    className="w-full px-4 py-3 bg-graphite border border-lime/50 rounded-xl text-white text-center font-display font-bold text-lg focus:border-lime outline-none"
                    placeholder="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-silver">reps</span>
                </div>
                <button
                  onClick={() => onSavePR(id)}
                  className="px-4 py-3 bg-lime text-obsidian rounded-xl font-display font-bold hover:bg-lime-dim transition-colors"
                >
                  ✓
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-between p-3 bg-carbon/60 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-lime">PR</span>
                <span className="text-white font-display font-bold">
                  {pr?.weight} kg <span className="text-silver">×</span> {pr?.reps} reps
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onEditPR(exercise); }}
                className="p-2 text-lime/60 hover:text-lime transition-colors"
              >
                <Edit size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {!showPR && !isCompleted && (
        <div className="px-4 pb-4 pt-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEditPR(exercise); }}
            className="mt-3 w-full py-2.5 border border-dashed border-lime/30 rounded-xl text-lime text-xs font-semibold hover:bg-lime/5 transition-colors"
          >
            + {setPRLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
