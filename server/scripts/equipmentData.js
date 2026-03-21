const exercises = require('./exerciseData');

// Build muscle group associations from exercise data
function getMusclesForEquipment(equipmentType) {
  const primary = new Set();
  const secondary = new Set();
  exercises
    .filter((ex) => ex.equipment === equipmentType)
    .forEach((ex) => {
      primary.add(ex.muscleGroup);
      if (ex.category === 'upper body') secondary.add('Core');
      if (ex.category === 'lower body') secondary.add('Core');
      if (ex.category === 'full body') secondary.add('Core');
    });
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    primaryMuscles: [...primary].map(capitalize),
    secondaryMuscles: [...secondary].filter((m) => !primary.has(m.toLowerCase())).map(capitalize),
  };
}

const barbell = getMusclesForEquipment('barbell');
const dumbbells = getMusclesForEquipment('dumbbells');
const cable = getMusclesForEquipment('cable');
const kettlebell = getMusclesForEquipment('kettlebell');

const equipmentList = [
  // Cardio Machines
  { id: 'treadmill', machineName: 'Treadmill', category: 'Cardio Machine', zone: 'Cardio Zone', resistanceType: 'Bodyweight', movementPattern: 'Leg Drive', primaryMuscles: ['Quadriceps', 'Hamstrings', 'Glutes'], secondaryMuscles: ['Calves'], difficultyLevel: 'Beginner', notes: 'Indoor walking or running, suitable for all fitness levels.' },
  { id: 'elliptical_trainer', machineName: 'Elliptical Trainer', category: 'Cardio Machine', zone: 'Cardio Zone', resistanceType: 'Bodyweight', movementPattern: 'Push/Pull Motion', primaryMuscles: ['Quadriceps', 'Hamstrings', 'Glutes'], secondaryMuscles: ['Calves', 'Shoulders', 'Back'], difficultyLevel: 'Beginner', notes: 'Low-impact full-body cardio simulating cross-country skiing.' },
  { id: 'stationary_bike', machineName: 'Stationary Bike', category: 'Cardio Machine', zone: 'Cardio Zone', resistanceType: 'Bodyweight', movementPattern: 'Cyclic Leg Pedaling', primaryMuscles: ['Quadriceps', 'Hamstrings', 'Glutes'], secondaryMuscles: ['Calves'], difficultyLevel: 'Beginner', notes: 'Indoor cycling for low-impact cardiovascular fitness.' },
  { id: 'rowing_machine', machineName: 'Rowing Machine', category: 'Cardio Machine', zone: 'Cardio Zone', resistanceType: 'Bodyweight', movementPattern: 'Cyclic Pull', primaryMuscles: ['Back', 'Legs', 'Shoulders'], secondaryMuscles: ['Biceps', 'Core'], difficultyLevel: 'Beginner', notes: 'Full-body cardio working both lower and upper body together.' },
  { id: 'stair_stepper', machineName: 'Stair Stepper', category: 'Cardio Machine', zone: 'Cardio Zone', resistanceType: 'Bodyweight', movementPattern: 'Vertical Stepping', primaryMuscles: ['Quadriceps', 'Hamstrings', 'Glutes'], secondaryMuscles: ['Calves', 'Core'], difficultyLevel: 'Intermediate', notes: 'Stair climbing motion for intensive lower-body cardio.' },

  // Strength Machines
  { id: 'chest_press_machine', machineName: 'Chest Press Machine', category: 'Strength Machine', zone: 'Strength Zone', resistanceType: 'Weight Stack', movementPattern: 'Push', primaryMuscles: ['Chest'], secondaryMuscles: ['Shoulders', 'Arms'], difficultyLevel: 'Beginner', notes: 'Seated press isolating chest muscles with guided motion.' },
  { id: 'shoulder_press_machine', machineName: 'Shoulder Press Machine', category: 'Strength Machine', zone: 'Strength Zone', resistanceType: 'Weight Stack', movementPattern: 'Push', primaryMuscles: ['Shoulders'], secondaryMuscles: ['Arms'], difficultyLevel: 'Beginner', notes: 'Seated overhead press targeting deltoids with triceps assistance.' },
  { id: 'lat_pulldown_machine', machineName: 'Lat Pulldown Machine', category: 'Strength Machine', zone: 'Strength Zone', resistanceType: 'Weight Stack', movementPattern: 'Pull', primaryMuscles: ['Back'], secondaryMuscles: ['Arms'], difficultyLevel: 'Beginner', notes: 'Downward pull targeting the lats.' },
  { id: 'seated_row_machine', machineName: 'Seated Row Machine', category: 'Strength Machine', zone: 'Strength Zone', resistanceType: 'Weight Stack', movementPattern: 'Pull', primaryMuscles: ['Back'], secondaryMuscles: ['Arms'], difficultyLevel: 'Beginner', notes: 'Horizontal pull working the middle back and arms.' },
  { id: 'leg_press_machine', machineName: 'Leg Press Machine', category: 'Strength Machine', zone: 'Strength Zone', resistanceType: 'Weight Stack', movementPattern: 'Leg Push', primaryMuscles: ['Legs'], secondaryMuscles: ['Core'], difficultyLevel: 'Beginner', notes: 'Compound leg press targeting quads, glutes, and hamstrings.' },
  { id: 'hack_squat_machine', machineName: 'Hack Squat Machine', category: 'Strength Machine', zone: 'Strength Zone', resistanceType: 'Plate Loaded', movementPattern: 'Squat', primaryMuscles: ['Legs'], secondaryMuscles: ['Core'], difficultyLevel: 'Intermediate', notes: 'Inclined squat machine focusing on quadriceps and glutes.' },
  { id: 'leg_extension_machine', machineName: 'Leg Extension Machine', category: 'Strength Machine', zone: 'Strength Zone', resistanceType: 'Weight Stack', movementPattern: 'Knee Extension', primaryMuscles: ['Legs'], secondaryMuscles: [], difficultyLevel: 'Beginner', notes: 'Seated exercise isolating the quadriceps.' },
  { id: 'leg_curl_machine', machineName: 'Leg Curl Machine', category: 'Strength Machine', zone: 'Strength Zone', resistanceType: 'Weight Stack', movementPattern: 'Knee Flexion', primaryMuscles: ['Legs'], secondaryMuscles: [], difficultyLevel: 'Beginner', notes: 'Seated or prone curl targeting the hamstrings.' },
  { id: 'pec_deck_machine', machineName: 'Pec Deck Machine', category: 'Strength Machine', zone: 'Strength Zone', resistanceType: 'Weight Stack', movementPattern: 'Horizontal Adduction', primaryMuscles: ['Chest'], secondaryMuscles: ['Shoulders'], difficultyLevel: 'Beginner', notes: 'Machine chest flyes emphasizing the pectorals.' },
  { id: 'cable_station', machineName: 'Cable Station', category: 'Strength Machine', zone: 'Strength Zone', resistanceType: 'Weight Stack', movementPattern: 'Various', primaryMuscles: cable.primaryMuscles, secondaryMuscles: cable.secondaryMuscles, difficultyLevel: 'Beginner', notes: `Versatile cable machine used for ${exercises.filter((e) => e.equipment === 'cable').length}+ exercises across all muscle groups.` },

  // Core Machines
  { id: 'abdominal_crunch_machine', machineName: 'Abdominal Crunch Machine', category: 'Core Machine', zone: 'Core Zone', resistanceType: 'Weight Stack', movementPattern: 'Crunch', primaryMuscles: ['Core'], secondaryMuscles: [], difficultyLevel: 'Beginner', notes: 'Seated machine for weighted ab crunches.' },
  { id: 'back_extension_bench', machineName: 'Back Extension Bench', category: 'Core Machine', zone: 'Core Zone', resistanceType: 'Bodyweight', movementPattern: 'Back Extension', primaryMuscles: ['Back', 'Core'], secondaryMuscles: ['Legs'], difficultyLevel: 'Beginner', notes: 'Hyperextension bench to strengthen the lower back and glutes.' },
  { id: 'captains_chair', machineName: "Captain's Chair", category: 'Core Machine', zone: 'Core Zone', resistanceType: 'Bodyweight', movementPattern: 'Leg Raise', primaryMuscles: ['Core'], secondaryMuscles: [], difficultyLevel: 'Intermediate', notes: 'Vertical knee/leg raises to work the abdominals.' },

  // Free Weights
  { id: 'barbells', machineName: 'Barbells', category: 'Free Weights', zone: 'Free Weight Zone', resistanceType: 'Plate Loaded', movementPattern: 'Various', primaryMuscles: barbell.primaryMuscles, secondaryMuscles: barbell.secondaryMuscles, difficultyLevel: 'Beginner to Advanced', notes: `Long bars with weight plates for compound lifts. Used in ${exercises.filter((e) => e.equipment === 'barbell').length}+ exercises.` },
  { id: 'dumbbells', machineName: 'Dumbbells', category: 'Free Weights', zone: 'Free Weight Zone', resistanceType: 'Fixed Weight', movementPattern: 'Various', primaryMuscles: dumbbells.primaryMuscles, secondaryMuscles: dumbbells.secondaryMuscles, difficultyLevel: 'Beginner to Advanced', notes: `Handheld weights for versatile training. Used in ${exercises.filter((e) => e.equipment === 'dumbbells').length}+ exercises.` },
  { id: 'kettlebells', machineName: 'Kettlebells', category: 'Free Weights', zone: 'Free Weight Zone', resistanceType: 'Fixed Weight', movementPattern: 'Swing/Snatch', primaryMuscles: kettlebell.primaryMuscles, secondaryMuscles: kettlebell.secondaryMuscles, difficultyLevel: 'Intermediate', notes: `Cast-iron weights for swings, snatches, and functional movements. Used in ${exercises.filter((e) => e.equipment === 'kettlebell').length}+ exercises.` },
  { id: 'squat_rack', machineName: 'Squat Rack', category: 'Free Weights', zone: 'Free Weight Zone', resistanceType: 'Plate Loaded', movementPattern: 'Squat/Press', primaryMuscles: ['Legs', 'Shoulders', 'Chest'], secondaryMuscles: ['Core', 'Back'], difficultyLevel: 'Intermediate', notes: 'Adjustable rack for squats, overhead presses, and bench press.' },

  // Functional Training
  { id: 'battle_ropes', machineName: 'Battle Ropes', category: 'Functional Training', zone: 'Functional Zone', resistanceType: 'Bodyweight', movementPattern: 'Wave Motion', primaryMuscles: ['Shoulders', 'Arms'], secondaryMuscles: ['Core'], difficultyLevel: 'Intermediate', notes: 'Heavy ropes for upper-body and core conditioning.' },
  { id: 'plyo_box', machineName: 'Plyo Box', category: 'Functional Training', zone: 'Functional Zone', resistanceType: 'Bodyweight', movementPattern: 'Jump/Step', primaryMuscles: ['Legs'], secondaryMuscles: ['Core'], difficultyLevel: 'Beginner', notes: 'Platform for box jumps and step-ups to build explosive power.' },

  // Stretching/Mobility
  { id: 'foam_roller', machineName: 'Foam Roller', category: 'Stretching/Mobility', zone: 'Mobility Zone', primaryMuscles: [], secondaryMuscles: [], difficultyLevel: 'Beginner', notes: 'Cylinder for self-myofascial release and muscle recovery.' },
  { id: 'exercise_ball', machineName: 'Exercise Ball', category: 'Stretching/Mobility', zone: 'Mobility Zone', primaryMuscles: ['Core'], secondaryMuscles: ['Legs', 'Back'], difficultyLevel: 'Beginner', notes: 'Inflatable ball for core stability and stretching.' },
  { id: 'resistance_bands', machineName: 'Resistance Bands', category: 'Stretching/Mobility', zone: 'Mobility Zone', resistanceType: 'Elastic', movementPattern: 'Various', primaryMuscles: [], secondaryMuscles: [], difficultyLevel: 'Beginner', notes: 'Elastic bands for assisted stretching and light resistance work.' },
];

module.exports = equipmentList;
