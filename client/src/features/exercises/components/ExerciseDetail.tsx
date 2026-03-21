import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dumbbell, ArrowLeft, Play, BookOpen } from 'lucide-react';
import { Badge } from '../../../components/ui';
import { getDifficultyVariant } from '../utils';
import type { ExerciseDetail as ExerciseDetailType } from '../types';

interface ExerciseDetailProps {
  exercise: ExerciseDetailType;
  onBack: () => void;
}

export default function ExerciseDetail({ exercise, onBack }: ExerciseDetailProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'howto' | 'muscles'>('howto');
  const howTo = exercise.howTo || { steps: ['Perform the exercise with proper form'], tips: ['Focus on controlled movement'] };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-silver hover:text-lime transition-colors self-start"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">{t('exercises.backToList')}</span>
      </button>

      <div className="relative rounded-2xl overflow-hidden border border-steel bg-muted">
        <div className="flex items-center gap-4 p-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-steel/50 shrink-0 flex items-center justify-center">
            {exercise.imageUrl ? (
              <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-full object-cover" />
            ) : (
              <Dumbbell size={32} className="text-silver" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display text-xl font-bold text-white">{exercise.name}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant={getDifficultyVariant(exercise.difficulty)} size="sm">
                <span className="capitalize">{exercise.difficulty}</span>
              </Badge>
              {(exercise.equipmentList || []).slice(0, 2).map(eq => (
                <Badge key={eq} variant="default" size="sm"><span className="capitalize">{eq}</span></Badge>
              ))}
              {(exercise.muscles || []).slice(0, 2).map(m => (
                <Badge key={m} variant="default" size="sm"><span className="capitalize">{m}</span></Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-graphite rounded-xl border border-steel">
        <button
          onClick={() => setActiveTab('howto')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'howto' ? 'bg-lime text-obsidian' : 'text-silver hover:text-white'
          }`}
        >
          {t('exercises.howTo')}
        </button>
        <button
          onClick={() => setActiveTab('muscles')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'muscles' ? 'bg-lime text-obsidian' : 'text-silver hover:text-white'
          }`}
        >
          {t('exercises.musclesTab')}
        </button>
      </div>

      {activeTab === 'howto' ? (
        <div className="flex flex-col gap-4">
          {(exercise.demoUrl || exercise.explainUrl) && (
            <div className="flex gap-2">
              {exercise.demoUrl && (
                <a href={exercise.demoUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600/15 border border-red-600/30 rounded-xl text-red-400 hover:bg-red-600/25 transition-colors">
                  <Play size={16} />
                  <span className="text-sm font-semibold">{t('exercises.watchDemo')}</span>
                </a>
              )}
              {exercise.explainUrl && (
                <a href={exercise.explainUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600/15 border border-blue-600/30 rounded-xl text-blue-400 hover:bg-blue-600/25 transition-colors">
                  <BookOpen size={16} />
                  <span className="text-sm font-semibold">{t('exercises.watchExplain')}</span>
                </a>
              )}
            </div>
          )}

          <div className="p-4 bg-muted rounded-2xl border border-steel">
            <h3 className="text-xs font-bold uppercase tracking-wider text-lime mb-3">{t('exercises.steps')}</h3>
            <div className="flex flex-col gap-3">
              {howTo.steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-lime/15 text-lime text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <p className="text-chalk text-sm leading-relaxed pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-muted rounded-2xl border border-steel">
            <h3 className="text-xs font-bold uppercase tracking-wider text-lime mb-3">{t('exercises.tips')}</h3>
            <div className="flex flex-col gap-2">
              {howTo.tips.map((tip, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-lime mt-1.5" />
                  <p className="text-silver text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {(exercise.muscles || []).length > 0 && (
            <div className="p-4 bg-muted rounded-2xl border border-steel">
              <h3 className="text-xs font-bold uppercase tracking-wider text-lime mb-3">{t('exercises.primaryMuscles')}</h3>
              <div className="flex flex-wrap gap-2">
                {(exercise.muscles || []).map(m => (
                  <Badge key={m} variant="default" size="sm">{m}</Badge>
                ))}
              </div>
            </div>
          )}
          {(exercise.musclesSecondary || []).length > 0 && (
            <div className="p-4 bg-muted rounded-2xl border border-steel">
              <h3 className="text-xs font-bold uppercase tracking-wider text-silver mb-3">{t('exercises.secondaryMuscles')}</h3>
              <div className="flex flex-wrap gap-2">
                {(exercise.musclesSecondary || []).map(m => (
                  <Badge key={m} variant="default" size="sm">{m}</Badge>
                ))}
              </div>
            </div>
          )}
          {(exercise.equipmentList || []).length > 0 && (
            <div className="p-4 bg-muted rounded-2xl border border-steel">
              <h3 className="text-xs font-bold uppercase tracking-wider text-silver mb-3">{t('exercises.equipmentNeeded')}</h3>
              <div className="flex flex-wrap gap-2">
                {(exercise.equipmentList || []).map(eq => (
                  <Badge key={eq} variant="default" size="sm">{eq}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
