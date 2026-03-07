import { useTranslation } from 'react-i18next';
import { CheckCircle, Circle, Edit, Dumbbell } from 'lucide-react';
import { Exercise } from '../../types';

interface ExerciseItemProps {
  exercise: Exercise;
  imageUrl?: string;
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
  imageUrl,
  isCompleted,
  onToggle,
  onEditPR,
  editingPR,
  prValues,
  onPRChange,
  onSavePR,
  showPR = false,
  doneLabel,
  setPRLabel,
  updatePRLabel,
  className = '',
}) => {
  const { t } = useTranslation();
  const { id, name, sets, reps, pr } = exercise;

  const resolvedDoneLabel = doneLabel ?? t('workout.done');
  const resolvedSetPRLabel = setPRLabel ?? t('workout.setYourPR');
  const resolvedUpdatePRLabel = updatePRLabel ?? t('workout.updateYourPR');

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isCompleted
          ? 'bg-linear-to-br from-success/15 to-success/5 border-success/30'
          : 'bg-muted border-steel hover:border-iron'
      } ${className}`}
    >
      <button onClick={() => onToggle(id)} className="w-full flex items-center gap-4 p-4 text-left">
        <div className="relative shrink-0">
          <div
            className={`w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center transition-all ${
              isCompleted ? 'ring-2 ring-success' : 'bg-steel/50'
            }`}
          >
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <Dumbbell size={20} className="text-silver" />
            )}
          </div>
          {isCompleted && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center">
              <CheckCircle size={14} strokeWidth={2.5} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`font-display font-bold text-lg ${
              isCompleted ? 'text-white/60 line-through' : 'text-white'
            }`}
          >
            {name}
          </p>
          <p className={`text-sm ${isCompleted ? 'text-white/40' : 'text-silver'}`}>
            {sets} {t('workout.sets')} × {reps}
          </p>
        </div>

        {isCompleted && (
          <span className="shrink-0 px-3 py-1.5 bg-success rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
            {resolvedDoneLabel}
          </span>
        )}
      </button>

      {(showPR || editingPR === id) && (
        <div className="px-4 pb-4 pt-0" onClick={(e) => e.stopPropagation()}>
          {editingPR === id ? (
            <div className="mt-3 p-4 bg-carbon/80 rounded-xl border border-lime/30">
              <p className="text-[10px] font-bold uppercase tracking-wider text-lime mb-3">
                {resolvedUpdatePRLabel}
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
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-silver">
                    {t('workout.kg')}
                  </span>
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
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-silver">
                    {t('workout.reps')}
                  </span>
                </div>
                <button
                  onClick={() => onSavePR(id)}
                  aria-label="Save personal record"
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
                  {pr?.weight} {t('workout.kg')} <span className="text-silver">×</span> {pr?.reps} {t('workout.reps')}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditPR(exercise);
                }}
                aria-label="Edit personal record"
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
            onClick={(e) => {
              e.stopPropagation();
              onEditPR(exercise);
            }}
            className="mt-3 w-full py-2.5 border border-dashed border-lime/30 rounded-xl text-lime text-xs font-semibold hover:bg-lime/5 transition-colors"
          >
            + {resolvedSetPRLabel}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseItem;
