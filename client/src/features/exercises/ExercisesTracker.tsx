import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dumbbell, ArrowLeft, ChevronRight } from 'lucide-react';
import { PageHeader, SearchInput, Badge, EmptyState } from '../../components/ui';
import { getExercises } from '../../services/api';

interface APIExercise {
  _id: string;
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  imageUrl?: string;
  description?: string;
}

const MUSCLE_GROUPS = [
  'all', 'chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardiovascular', 'full body',
];

const EQUIPMENT_FILTERS = [
  '', 'barbell', 'dumbbells', 'cable', 'machine', 'bodyweight', 'kettlebell',
];

const HOW_TO: Record<string, { steps: string[]; tips: string[] }> = {
  'chest': {
    steps: [
      'Set up the bench or position yourself correctly',
      'Grip the weight with proper hand placement',
      'Lower the weight with control to chest level',
      'Press upward, extending your arms fully',
      'Repeat for the desired number of reps',
    ],
    tips: [
      'Keep your shoulder blades retracted',
      'Maintain a slight arch in your lower back',
      'Control the eccentric (lowering) phase',
    ],
  },
  'back': {
    steps: [
      'Set up with proper grip width and stance',
      'Initiate the pull by engaging your lats',
      'Pull the weight toward your torso',
      'Squeeze your shoulder blades at peak contraction',
      'Lower with control back to start',
    ],
    tips: [
      'Focus on pulling with your elbows, not your hands',
      'Keep your core engaged throughout',
      'Avoid using momentum',
    ],
  },
  'shoulders': {
    steps: [
      'Start with the weight at shoulder height',
      'Engage your core and set your stance',
      'Press or raise the weight in a controlled motion',
      'Hold briefly at the top of the movement',
      'Lower slowly back to the starting position',
    ],
    tips: [
      'Avoid shrugging your shoulders up',
      'Keep a slight bend in your elbows for raises',
      'Use lighter weight with strict form',
    ],
  },
  'arms': {
    steps: [
      'Position your arms and grip the weight',
      'Keep your elbows fixed in position',
      'Curl or extend through the full range of motion',
      'Squeeze the muscle at peak contraction',
      'Lower with control, resisting gravity',
    ],
    tips: [
      'Avoid swinging or using body momentum',
      'Focus on the mind-muscle connection',
      'Full range of motion beats heavy weight',
    ],
  },
  'legs': {
    steps: [
      'Set up with proper foot placement and stance',
      'Brace your core before initiating the movement',
      'Lower yourself with control through the full range',
      'Drive through your feet to return to start',
      'Keep your knees tracking over your toes',
    ],
    tips: [
      'Warm up thoroughly before heavy leg work',
      'Focus on depth over weight',
      'Keep your core tight throughout',
    ],
  },
  'core': {
    steps: [
      'Position yourself on the floor or apparatus',
      'Engage your core by bracing your abdominals',
      'Perform the movement with control',
      'Hold the contraction briefly',
      'Return to start position slowly',
    ],
    tips: [
      'Breathe out during the contraction',
      'Avoid pulling on your neck',
      'Quality reps beat quantity',
    ],
  },
  'cardiovascular': {
    steps: [
      'Set your pace and intensity level',
      'Maintain proper form and posture',
      'Keep a steady breathing rhythm',
      'Monitor your heart rate',
      'Cool down gradually',
    ],
    tips: [
      'Start with a warm-up period',
      'Stay hydrated throughout',
      'Gradually increase intensity over time',
    ],
  },
  'full body': {
    steps: [
      'Set up with proper form and stance',
      'Engage multiple muscle groups simultaneously',
      'Move through the full range of motion',
      'Maintain coordination throughout',
      'Reset between reps if needed',
    ],
    tips: [
      'Master the movement pattern before adding weight',
      'Focus on form over speed',
      'These exercises burn more calories due to multi-joint engagement',
    ],
  },
};

function ExerciseDetail({ exercise, onBack }: { exercise: APIExercise; onBack: () => void }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'howto' | 'history'>('howto');
  const howTo = HOW_TO[exercise.muscleGroup] || HOW_TO['chest'];

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
                {exercise.difficulty}
              </Badge>
              <Badge variant="default" size="sm">{exercise.equipment}</Badge>
              <Badge variant="default" size="sm">{exercise.muscleGroup}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 p-1 bg-graphite rounded-xl border border-steel">
        <button
          onClick={() => setActiveTab('howto')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'howto'
              ? 'bg-lime text-obsidian'
              : 'text-silver hover:text-white'
          }`}
        >
          {t('exercises.howTo')}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-lime text-obsidian'
              : 'text-silver hover:text-white'
          }`}
        >
          {t('exercises.history')}
        </button>
      </div>

      {activeTab === 'howto' ? (
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-muted rounded-2xl border border-steel">
            <h3 className="text-xs font-bold uppercase tracking-wider text-lime mb-3">{t('exercises.steps')}</h3>
            <div className="flex flex-col gap-3">
              {howTo.steps.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-lime/15 text-lime text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
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
        <div className="p-6 bg-muted rounded-2xl border border-steel">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Dumbbell size={40} className="text-steel mb-3" />
            <p className="text-silver text-sm">{t('exercises.noHistory')}</p>
            <p className="text-steel text-xs mt-1">{t('exercises.noHistoryHint')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function getDifficultyVariant(difficulty: string) {
  if (difficulty === 'beginner') return 'success' as const;
  if (difficulty === 'intermediate') return 'primary' as const;
  return 'danger' as const;
}

export default function ExercisesTracker() {
  const { t } = useTranslation();
  const [exercises, setExercises] = useState<APIExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [search, setSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<APIExercise | null>(null);

  useEffect(() => {
    getExercises()
      .then((data) => setExercises(data as APIExercise[]))
      .catch((err) => console.error('Failed to load exercises:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesMuscle = selectedMuscle === 'all' || ex.muscleGroup === selectedMuscle;
      const matchesEquipment = !selectedEquipment || ex.equipment === selectedEquipment;
      const matchesSearch = !search || ex.name.toLowerCase().includes(search.toLowerCase());
      return matchesMuscle && matchesEquipment && matchesSearch;
    });
  }, [exercises, selectedMuscle, selectedEquipment, search]);

  if (selectedExercise) {
    return (
      <ExerciseDetail
        exercise={selectedExercise}
        onBack={() => setSelectedExercise(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t('exercises.title')} subtitle={t('exercises.browseLibrary')} />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {MUSCLE_GROUPS.map((muscle) => (
          <button
            key={muscle}
            onClick={() => setSelectedMuscle(muscle)}
            className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              selectedMuscle === muscle
                ? 'bg-lime text-obsidian shadow-lg shadow-lime/20'
                : 'bg-steel/60 text-silver hover:text-white hover:bg-iron'
            }`}
          >
            {t(`exercises.muscles.${muscle}`)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t('exercises.searchExercises')}
        />

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {EQUIPMENT_FILTERS.map((equip) => (
            <button
              key={equip || 'all'}
              onClick={() => setSelectedEquipment(equip)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                selectedEquipment === equip
                  ? 'bg-lime text-obsidian'
                  : 'bg-steel text-silver hover:text-white'
              }`}
            >
              {t(`exercises.equipmentFilter.${equip || 'all'}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-white">
          {selectedMuscle === 'all' ? t('exercises.allExercises') : t(`exercises.muscles.${selectedMuscle}`)}
        </span>
        <span className="text-xs text-silver">{t('exercises.exerciseCount', { count: filteredExercises.length })}</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-lime/30 border-t-lime rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise._id}
              onClick={() => setSelectedExercise(exercise)}
              className="flex items-center gap-3 p-3 bg-muted rounded-xl border border-steel hover:border-iron transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-steel/50 shrink-0 flex items-center justify-center">
                {exercise.imageUrl ? (
                  <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-full object-cover" />
                ) : (
                  <Dumbbell size={20} className="text-silver" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-chalk text-sm font-semibold truncate">{exercise.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getDifficultyVariant(exercise.difficulty)} size="sm">
                    {exercise.difficulty}
                  </Badge>
                  <span className="text-[10px] text-silver">{exercise.equipment}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-steel group-hover:text-lime transition-colors shrink-0" />
            </button>
          ))}

          {filteredExercises.length === 0 && !loading && (
            <EmptyState
              icon={Dumbbell}
              title={t('exercises.noExercises')}
              message={t('exercises.noExercisesMessage')}
            />
          )}
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}
