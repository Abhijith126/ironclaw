import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, ExternalLink, Dumbbell } from 'lucide-react';
import { PageHeader, SearchInput, Card, Badge, EmptyState } from '../../components/ui';

const MUSCLE_GROUPS = [
  { id: 'chest', name: 'Chest' },
  { id: 'back', name: 'Back' },
  { id: 'shoulders', name: 'Shoulders' },
  { id: 'biceps', name: 'Biceps' },
  { id: 'triceps', name: 'Triceps' },
  { id: 'abs', name: 'Abs' },
  { id: 'quads', name: 'Quads' },
  { id: 'hamstrings', name: 'Hamstrings' },
  { id: 'glutes', name: 'Glutes' },
  { id: 'calves', name: 'Calves' },
];

const EQUIPMENT_FILTERS = [
  { id: '', name: 'All' },
  { id: 'dumbbell', name: 'Dumbbell' },
  { id: 'barbell', name: 'Barbell' },
  { id: 'bodyweight', name: 'Bodyweight' },
  { id: 'cable', name: 'Cable' },
  { id: 'machine', name: 'Machine' },
  { id: 'kettlebell', name: 'Kettlebell' },
];

const EXERCISES = {
  chest: [
    { name: 'Dumbbell Bench Press', equipment: 'dumbbell', difficulty: 'Beginner', views: '7.2M', url: 'https://www.muscleandstrength.com/exercises/dumbbell-bench-press.html' },
    { name: 'Incline Dumbbell Press', equipment: 'dumbbell', difficulty: 'Beginner', views: '6.1M', url: 'https://www.muscleandstrength.com/exercises/incline-dumbbell-bench-press.html' },
    { name: 'Dumbbell Fly', equipment: 'dumbbell', difficulty: 'Beginner', views: '5.4M', url: 'https://www.muscleandstrength.com/exercises/dumbbell-flys.html' },
    { name: 'Barbell Bench Press', equipment: 'barbell', difficulty: 'Intermediate', views: '5.2M', url: 'https://www.muscleandstrength.com/exercises/barbell-bench-press.html' },
    { name: 'Incline Barbell Press', equipment: 'barbell', difficulty: 'Beginner', views: '3.9M', url: 'https://www.muscleandstrength.com/exercises/incline-bench-press.html' },
    { name: 'Decline Bench Press', equipment: 'barbell', difficulty: 'Beginner', views: '828K', url: 'https://www.muscleandstrength.com/exercises/decline-bench-press.html' },
    { name: 'Pec Deck', equipment: 'machine', difficulty: 'Beginner', views: '3.2M', url: 'https://www.muscleandstrength.com/exercises/pec-dec.html' },
    { name: 'Cable Crossover', equipment: 'cable', difficulty: 'Beginner', views: '1.9M', url: 'https://www.muscleandstrength.com/exercises/cable-crossovers-%28mid-chest%29.html' },
    { name: 'Chest Dip', equipment: 'bodyweight', difficulty: 'Intermediate', views: '2.1M', url: 'https://www.muscleandstrength.com/exercises/chest-dip.html' },
    { name: 'Push Up', equipment: 'bodyweight', difficulty: 'Beginner', views: '1M', url: 'https://www.muscleandstrength.com/exercises/push-up.html' },
    { name: 'Dumbbell Pullover', equipment: 'dumbbell', difficulty: 'Intermediate', views: '6.2M', url: 'https://www.muscleandstrength.com/exercises/dumbbell-pullover.html' },
    { name: 'Hammer Strength Press', equipment: 'machine', difficulty: 'Beginner', views: '2.1M', url: 'https://www.muscleandstrength.com/exercises/hammer-strength-bench-press.html' },
  ],
  back: [
    { name: 'Lat Pulldown', equipment: 'cable', difficulty: 'Beginner', views: '5M', url: 'https://www.muscleandstrength.com/exercises/lat-pull-down.html' },
    { name: 'Pull Up', equipment: 'bodyweight', difficulty: 'Intermediate', views: '514K', url: 'https://www.muscleandstrength.com/exercises/pull-up' },
    { name: 'Chin Up', equipment: 'bodyweight', difficulty: 'Beginner', views: '1.9M', url: 'https://www.muscleandstrength.com/exercises/chin-up.html' },
    { name: 'Wide Grip Pull Up', equipment: 'bodyweight', difficulty: 'Beginner', views: '3.5M', url: 'https://www.muscleandstrength.com/exercises/wide-grip-pull-up.html' },
    { name: 'Seated Cable Row', equipment: 'cable', difficulty: 'Beginner', views: '2.2M', url: 'https://www.muscleandstrength.com/exercises/seated-cable-row.html' },
    { name: 'Bent Over Barbell Row', equipment: 'barbell', difficulty: 'Intermediate', views: '8.6M', url: 'https://www.muscleandstrength.com/exercises/bent-over-barbell-row.html' },
    { name: 'One Arm Dumbbell Row', equipment: 'dumbbell', difficulty: 'Beginner', views: '9.2M', url: 'https://www.muscleandstrength.com/exercises/one-arm-dumbbell-row.html' },
    { name: 'T-Bar Row', equipment: 'barbell', difficulty: 'Intermediate', views: '3.1M', url: 'https://www.muscleandstrength.com/exercises/t-bar-row-with-handle.html' },
    { name: 'Straight Arm Pulldown', equipment: 'cable', difficulty: 'Beginner', views: '1.3M', url: 'https://www.muscleandstrength.com/exercises/straight-arm-lat-pull-down.html' },
    { name: 'Face Pull', equipment: 'cable', difficulty: 'Beginner', views: '2.8M', url: 'https://www.muscleandstrength.com/exercises/face-pull.html' },
    { name: 'Deadlift', equipment: 'barbell', difficulty: 'Advanced', views: '4.5M', url: 'https://www.muscleandstrength.com/exercises/deadlift.html' },
  ],
  shoulders: [
    { name: 'Dumbbell Lateral Raise', equipment: 'dumbbell', difficulty: 'Beginner', views: '10.8M', url: 'https://www.muscleandstrength.com/exercises/dumbbell-lateral-raise.html' },
    { name: 'Military Press', equipment: 'barbell', difficulty: 'Intermediate', views: '6.5M', url: 'https://www.muscleandstrength.com/exercises/military-press.html' },
    { name: 'Arnold Press', equipment: 'dumbbell', difficulty: 'Intermediate', views: '4.2M', url: 'https://www.muscleandstrength.com/exercises/seated-arnold-press.html' },
    { name: 'Dumbbell Shoulder Press', equipment: 'dumbbell', difficulty: 'Beginner', views: '3.8M', url: 'https://www.muscleandstrength.com/exercises/dumbbell-shoulder-press.html' },
    { name: 'Front Raise', equipment: 'dumbbell', difficulty: 'Beginner', views: '2.1M', url: 'https://www.muscleandstrength.com/exercises/front-dumbbell-raise.html' },
    { name: 'Rear Delt Fly', equipment: 'dumbbell', difficulty: 'Beginner', views: '1.9M', url: 'https://www.muscleandstrength.com/exercises/reverse-dumbbell-fly.html' },
    { name: 'Upright Row', equipment: 'barbell', difficulty: 'Intermediate', views: '2.5M', url: 'https://www.muscleandstrength.com/exercises/upright-barbell-row.html' },
    { name: 'Shrug', equipment: 'dumbbell', difficulty: 'Beginner', views: '3.4M', url: 'https://www.muscleandstrength.com/exercises/dumbbell-shrug.html' },
    { name: 'Machine Shoulder Press', equipment: 'machine', difficulty: 'Beginner', views: '1.2M', url: 'https://www.muscleandstrength.com/exercises/machine-shoulder-press.html' },
  ],
  biceps: [
    { name: 'Dumbbell Curl', equipment: 'dumbbell', difficulty: 'Beginner', views: '8.2M', url: 'https://www.muscleandstrength.com/exercises/dumbbell-curl.html' },
    { name: 'Hammer Curl', equipment: 'dumbbell', difficulty: 'Beginner', views: '5.6M', url: 'https://www.muscleandstrength.com/exercises/hammer-curl.html' },
    { name: 'Preacher Curl', equipment: 'barbell', difficulty: 'Intermediate', views: '3.2M', url: 'https://www.muscleandstrength.com/exercises/barbell-preacher-curl.html' },
    { name: 'Incline Dumbbell Curl', equipment: 'dumbbell', difficulty: 'Beginner', views: '2.8M', url: 'https://www.muscleandstrength.com/exercises/incline-dumbbell-curl.html' },
    { name: 'Cable Curl', equipment: 'cable', difficulty: 'Beginner', views: '2.1M', url: 'https://www.muscleandstrength.com/exercises/cable-curl.html' },
    { name: 'Concentration Curl', equipment: 'dumbbell', difficulty: 'Beginner', views: '1.5M', url: 'https://www.muscleandstrength.com/exercises/concentration-curl.html' },
    { name: 'EZ Bar Curl', equipment: 'barbell', difficulty: 'Beginner', views: '1.8M', url: 'https://www.muscleandstrength.com/exercises/ez-bar-curl.html' },
    { name: 'Cross Body Curl', equipment: 'dumbbell', difficulty: 'Beginner', views: '1.2M', url: 'https://www.muscleandstrength.com/exercises/cross-body-hammer-curl.html' },
  ],
  triceps: [
    { name: 'Tricep Pushdown', equipment: 'cable', difficulty: 'Beginner', views: '4.5M', url: 'https://www.muscleandstrength.com/exercises/tricep-pushdown.html' },
    { name: 'Overhead Tricep Extension', equipment: 'dumbbell', difficulty: 'Beginner', views: '3.2M', url: 'https://www.muscleandstrength.com/exercises/overhead-tricep-extension.html' },
    { name: 'Skull Crusher', equipment: 'barbell', difficulty: 'Intermediate', views: '2.8M', url: 'https://www.muscleandstrength.com/exercises/skull-crusher.html' },
    { name: 'Tricep Dip', equipment: 'bodyweight', difficulty: 'Intermediate', views: '2.1M', url: 'https://www.muscleandstrength.com/exercises/tricep-dip.html' },
    { name: 'Close Grip Bench Press', equipment: 'barbell', difficulty: 'Intermediate', views: '1.9M', url: 'https://www.muscleandstrength.com/exercises/close-grip-bench-press.html' },
    { name: 'Tricep Kickback', equipment: 'dumbbell', difficulty: 'Beginner', views: '1.5M', url: 'https://www.muscleandstrength.com/exercises/tricep-kickback.html' },
    { name: 'Rope Pushdown', equipment: 'cable', difficulty: 'Beginner', views: '2.3M', url: 'https://www.muscleandstrength.com/exercises/rope-pushdown.html' },
  ],
  abs: [
    { name: 'Crunch', equipment: 'bodyweight', difficulty: 'Beginner', views: '3.2M', url: 'https://www.muscleandstrength.com/exercises/crunch.html' },
    { name: 'Plank', equipment: 'bodyweight', difficulty: 'Beginner', views: '4.1M', url: 'https://www.muscleandstrength.com/exercises/plank.html' },
    { name: 'Leg Raise', equipment: 'bodyweight', difficulty: 'Intermediate', views: '2.5M', url: 'https://www.muscleandstrength.com/exercises/leg-raise.html' },
    { name: 'Russian Twist', equipment: 'bodyweight', difficulty: 'Beginner', views: '1.8M', url: 'https://www.muscleandstrength.com/exercises/russian-twist.html' },
    { name: 'Cable Crunch', equipment: 'cable', difficulty: 'Beginner', views: '1.2M', url: 'https://www.muscleandstrength.com/exercises/cable-crunch.html' },
    { name: 'Ab Wheel Rollout', equipment: 'other', difficulty: 'Advanced', views: '890K', url: 'https://www.muscleandstrength.com/exercises/ab-wheel-rollout.html' },
    { name: 'Hanging Leg Raise', equipment: 'bodyweight', difficulty: 'Advanced', views: '1.1M', url: 'https://www.muscleandstrength.com/exercises/hanging-leg-raise.html' },
    { name: 'Dead Bug', equipment: 'bodyweight', difficulty: 'Beginner', views: '780K', url: 'https://www.muscleandstrength.com/exercises/dead-bug.html' },
  ],
  quads: [
    { name: 'Squat', equipment: 'barbell', difficulty: 'Intermediate', views: '12M', url: 'https://www.muscleandstrength.com/exercises/barbell-squat.html' },
    { name: 'Leg Press', equipment: 'machine', difficulty: 'Beginner', views: '5.2M', url: 'https://www.muscleandstrength.com/exercises/leg-press.html' },
    { name: 'Front Squat', equipment: 'barbell', difficulty: 'Intermediate', views: '3.8M', url: 'https://www.muscleandstrength.com/exercises/front-squat.html' },
    { name: 'Leg Extension', equipment: 'machine', difficulty: 'Beginner', views: '2.1M', url: 'https://www.muscleandstrength.com/exercises/leg-extension.html' },
    { name: 'Lunge', equipment: 'dumbbells', difficulty: 'Beginner', views: '4.5M', url: 'https://www.muscleandstrength.com/exercises/lunge.html' },
    { name: 'Goblet Squat', equipment: 'dumbbell', difficulty: 'Beginner', views: '2.8M', url: 'https://www.muscleandstrength.com/exercises/goblet-squat.html' },
    { name: 'Bulgarian Split Squat', equipment: 'dumbbells', difficulty: 'Intermediate', views: '2.2M', url: 'https://www.muscleandstrength.com/exercises/bulgarian-split-squat.html' },
    { name: 'Hack Squat', equipment: 'machine', difficulty: 'Intermediate', views: '1.9M', url: 'https://www.muscleandstrength.com/exercises/hack-squat.html' },
    { name: 'Step Up', equipment: 'dumbbells', difficulty: 'Beginner', views: '1.5M', url: 'https://www.muscleandstrength.com/exercises/dumbbell-step-up.html' },
  ],
  hamstrings: [
    { name: 'Romanian Deadlift', equipment: 'barbell', difficulty: 'Intermediate', views: '5.7M', url: 'https://www.muscleandstrength.com/exercises/stiff-leg-deadlift-aka-romanian-deadlift.html' },
    { name: 'Leg Curl', equipment: 'machine', difficulty: 'Beginner', views: '2.3M', url: 'https://www.muscleandstrength.com/exercises/leg-curl.html' },
    { name: 'Stiff Leg Deadlift', equipment: 'barbell', difficulty: 'Intermediate', views: '2.1M', url: 'https://www.muscleandstrength.com/exercises/stiff-leg-deadlift.html' },
    { name: 'Dumbbell Deadlift', equipment: 'dumbbell', difficulty: 'Beginner', views: '6.4M', url: 'https://www.muscleandstrength.com/exercises/dumbbell-deadlift.html' },
    { name: 'Glute Ham Raise', equipment: 'machine', difficulty: 'Intermediate', views: '890K', url: 'https://www.muscleandstrength.com/exercises/glute-ham-raise.html' },
  ],
  glutes: [
    { name: 'Hip Thrust', equipment: 'barbell', difficulty: 'Intermediate', views: '4.2M', url: 'https://www.muscleandstrength.com/exercises/barbell-hip-thrust.html' },
    { name: 'Glute Bridge', equipment: 'bodyweight', difficulty: 'Beginner', views: '2.1M', url: 'https://www.muscleandstrength.com/exercises/glute-bridge.html' },
    { name: 'Cable Pull Through', equipment: 'cable', difficulty: 'Beginner', views: '780K', url: 'https://www.muscleandstrength.com/exercises/cable-pull-through.html' },
    { name: 'Sumo Deadlift', equipment: 'barbell', difficulty: 'Intermediate', views: '3.5M', url: 'https://www.muscleandstrength.com/exercises/sumo-deadlift.html' },
    { name: 'Bulgarian Split Squat', equipment: 'dumbbells', difficulty: 'Intermediate', views: '2.2M', url: 'https://www.muscleandstrength.com/exercises/bulgarian-split-squat.html' },
  ],
  calves: [
    { name: 'Standing Calf Raise', equipment: 'machine', difficulty: 'Beginner', views: '1.8M', url: 'https://www.muscleandstrength.com/exercises/standing-calf-raise.html' },
    { name: 'Seated Calf Raise', equipment: 'machine', difficulty: 'Beginner', views: '1.2M', url: 'https://www.muscleandstrength.com/exercises/seated-calf-raise.html' },
    { name: 'Donkey Calf Raise', equipment: 'machine', difficulty: 'Beginner', views: '650K', url: 'https://www.muscleandstrength.com/exercises/donkey-calf-raise.html' },
  ],
};

export default function ExercisesTracker() {
  const { t } = useTranslation();
  const [selectedMuscle, setSelectedMuscle] = useState('chest');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [search, setSearch] = useState('');

  const filteredExercises = EXERCISES[selectedMuscle]?.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesEquipment = !selectedEquipment || ex.equipment.toLowerCase().includes(selectedEquipment.toLowerCase());
    return matchesSearch && matchesEquipment;
  }) || [];

  const currentMuscleGroup = MUSCLE_GROUPS.find(m => m.id === selectedMuscle);

  const openExerciseUrl = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getDifficultyVariant = (difficulty) => {
    if (difficulty === 'Beginner') return 'success';
    if (difficulty === 'Intermediate') return 'primary';
    return 'danger';
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader 
        title={t('exercises.title')} 
        subtitle={t('exercises.areaWorkouts')} 
      />

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {MUSCLE_GROUPS.map((muscle) => (
          <button
            key={muscle.id}
            onClick={() => setSelectedMuscle(muscle.id)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              selectedMuscle === muscle.id
                ? 'bg-lime text-obsidian shadow-lg shadow-lime/20'
                : 'bg-steel/60 text-silver hover:text-white hover:bg-iron'
            }`}
          >
            {muscle.name}
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
              key={equip.id}
              onClick={() => setSelectedEquipment(equip.id)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                selectedEquipment === equip.id
                  ? 'bg-lime text-obsidian'
                  : 'bg-steel text-silver hover:text-white'
              }`}
            >
              {equip.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <span className="text-sm font-medium text-white">{currentMuscleGroup?.name}</span>
        <span className="text-xs text-silver">{filteredExercises.length} exercises</span>
      </div>

      <div className="flex flex-col gap-3">
        {filteredExercises.map((exercise, index) => (
          <Card key={exercise.name} variant="secondary" className="overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate pr-2">{exercise.name}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant={getDifficultyVariant(exercise.difficulty)} size="sm">
                    {exercise.difficulty}
                  </Badge>
                  <Badge variant="default" size="sm">
                    {exercise.equipment}
                  </Badge>
                </div>
              </div>
              
              <button
                onClick={() => openExerciseUrl(exercise.url)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-lime/10 text-lime rounded-lg text-xs font-semibold hover:bg-lime hover:text-obsidian transition-all duration-200"
              >
                <Play size={12} className="fill-current" />
                {t('exercises.watch')}
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] text-silver">{exercise.views} {t('exercises.views')}</span>
              <button
                onClick={() => openExerciseUrl(exercise.url)}
                className="flex items-center gap-1 text-[10px] text-silver hover:text-lime transition-colors"
              >
                <ExternalLink size={10} />
                {t('exercises.viewOnMS')}
              </button>
            </div>
          </Card>
        ))}

        {filteredExercises.length === 0 && (
          <EmptyState
            icon={Dumbbell}
            title={t('exercises.noExercises')}
            message={t('exercises.noExercisesMessage')}
          />
        )}
      </div>

      <div className="h-4" />
    </div>
  );
}
