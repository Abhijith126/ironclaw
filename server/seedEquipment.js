const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const equipmentSchema = new mongoose.Schema({
  machineName: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  zone: { type: String },
  resistanceType: { type: String },
  movementPattern: { type: String },
  primaryMuscles: [{ type: String }],
  secondaryMuscles: [{ type: String }],
  difficultyLevel: { type: String },
  notes: { type: String },
}, { timestamps: true });

const Equipment = mongoose.model('Equipment', equipmentSchema);

const equipmentList = [
  { machineName: "Treadmill", category: "Cardio Machine", zone: "Cardio Zone", resistanceType: "Bodyweight", movementPattern: "Leg Drive", primaryMuscles: ["Quadriceps", "Hamstrings", "Glutes"], secondaryMuscles: ["Calves"], difficultyLevel: "Beginner", notes: "Allows indoor walking or running year-round, suitable for all fitness levels." },
  { machineName: "Elliptical Trainer", category: "Cardio Machine", zone: "Cardio Zone", resistanceType: "Bodyweight", movementPattern: "Push/Pull Motion", primaryMuscles: ["Quadriceps", "Hamstrings", "Glutes"], secondaryMuscles: ["Calves", "Shoulders", "Back"], difficultyLevel: "Beginner/Intermediate", notes: "Low-impact full-body cardio, simulating cross-country skiing motion." },
  { machineName: "Stationary Bike", category: "Cardio Machine", zone: "Cardio Zone", resistanceType: "Bodyweight", movementPattern: "Cyclic Leg Pedaling", primaryMuscles: ["Quadriceps", "Hamstrings", "Glutes"], secondaryMuscles: ["Calves"], difficultyLevel: "Beginner/Intermediate", notes: "Indoor cycling for cardio, low-impact, improves cardiovascular fitness." },
  { machineName: "Recumbent Bike", category: "Cardio Machine", zone: "Cardio Zone", resistanceType: "Bodyweight", movementPattern: "Cyclic Leg Pedaling", primaryMuscles: ["Quadriceps", "Hamstrings", "Glutes"], secondaryMuscles: ["Calves"], difficultyLevel: "Beginner/Intermediate", notes: "Similar to stationary bike but with back support; low-impact cardio for legs." },
  { machineName: "Rowing Machine", category: "Cardio Machine", zone: "Cardio Zone", resistanceType: "Bodyweight", movementPattern: "Cyclic Leg and Arm Pull", primaryMuscles: ["Quadriceps", "Hamstrings", "Glutes", "Back", "Shoulders"], secondaryMuscles: ["Biceps", "Forearms", "Core"], difficultyLevel: "Beginner/Intermediate", notes: "Full-body cardio: works both lower and upper body together." },
  { machineName: "Stair Stepper", category: "Cardio Machine", zone: "Cardio Zone", resistanceType: "Bodyweight", movementPattern: "Vertical Stepping", primaryMuscles: ["Quadriceps", "Hamstrings", "Glutes"], secondaryMuscles: ["Calves", "Core"], difficultyLevel: "Intermediate/Advanced", notes: "Endless stair climbing motion for intensive lower-body cardio." },
  { machineName: "Chest Press Machine", category: "Strength Machine", zone: "Strength Zone", resistanceType: "Weight Stack", movementPattern: "Push", primaryMuscles: ["Chest (Pectoralis Major)"], secondaryMuscles: ["Shoulders (Deltoids)", "Triceps"], difficultyLevel: "Beginner/Intermediate", notes: "Seated press isolates chest muscles with guided motion." },
  { machineName: "Shoulder Press Machine", category: "Strength Machine", zone: "Strength Zone", resistanceType: "Weight Stack", movementPattern: "Push", primaryMuscles: ["Shoulders (Deltoids)"], secondaryMuscles: ["Triceps", "Upper Trapezius"], difficultyLevel: "Beginner/Intermediate", notes: "Seated press targets shoulder deltoids (front/side) with triceps assistance." },
  { machineName: "Lat Pulldown Machine", category: "Strength Machine", zone: "Strength Zone", resistanceType: "Weight Stack", movementPattern: "Pull", primaryMuscles: ["Back (Latissimus Dorsi)"], secondaryMuscles: ["Biceps"], difficultyLevel: "Beginner/Intermediate", notes: "Downward pull exercise targeting the lat muscles of the back." },
  { machineName: "Seated Row Machine", category: "Strength Machine", zone: "Strength Zone", resistanceType: "Weight Stack", movementPattern: "Pull", primaryMuscles: ["Back (Latissimus Dorsi, Rhomboids)"], secondaryMuscles: ["Trapezius", "Biceps"], difficultyLevel: "Beginner/Intermediate", notes: "Horizontal pull exercise working the middle back and arms." },
  { machineName: "Leg Press Machine", category: "Strength Machine", zone: "Strength Zone", resistanceType: "Weight Stack", movementPattern: "Leg Push", primaryMuscles: ["Glutes", "Hamstrings"], secondaryMuscles: ["Calves"], difficultyLevel: "Beginner/Intermediate", notes: "Pushes platform to work glutes and hamstrings (seated leg press)." },
  { machineName: "Hack Squat Machine", category: "Strength Machine", zone: "Strength Zone", resistanceType: "Plate Loaded", movementPattern: "Squat", primaryMuscles: ["Quadriceps", "Glutes"], secondaryMuscles: ["Hamstrings", "Calves"], difficultyLevel: "Intermediate/Advanced", notes: "Inclined squat machine focusing on quadriceps and glutes." },
  { machineName: "Leg Extension Machine", category: "Strength Machine", zone: "Strength Zone", resistanceType: "Weight Stack", movementPattern: "Knee Extension", primaryMuscles: ["Quadriceps"], secondaryMuscles: [], difficultyLevel: "Beginner", notes: "Seated knee extension exercise isolating the quadriceps." },
  { machineName: "Leg Curl Machine", category: "Strength Machine", zone: "Strength Zone", resistanceType: "Weight Stack", movementPattern: "Knee Flexion", primaryMuscles: ["Hamstrings"], secondaryMuscles: ["Glutes"], difficultyLevel: "Beginner/Intermediate", notes: "Seated or prone curl targeting the hamstrings, the back of the thigh." },
  { machineName: "Cable Biceps Curl", category: "Strength Machine", zone: "Strength Zone", resistanceType: "Weight Stack", movementPattern: "Curl", primaryMuscles: ["Biceps"], secondaryMuscles: ["Forearms"], difficultyLevel: "Beginner", notes: "Cable attachment used for curling motion, isolating the biceps." },
  { machineName: "Cable Triceps Pushdown", category: "Strength Machine", zone: "Strength Zone", resistanceType: "Weight Stack", movementPattern: "Push", primaryMuscles: ["Triceps"], secondaryMuscles: [], difficultyLevel: "Beginner", notes: "Cable bar for triceps extension, targets the triceps muscles." },
  { machineName: "Pec Deck Machine", category: "Strength Machine", zone: "Strength Zone", resistanceType: "Weight Stack", movementPattern: "Horizontal Adduction", primaryMuscles: ["Chest (Pectoralis Major)"], secondaryMuscles: ["Shoulders (Anterior Deltoids)"], difficultyLevel: "Beginner", notes: "Machine for bilateral chest flyes, emphasizing the pectorals and anterior deltoids." },
  { machineName: "Abdominal Crunch Machine", category: "Core Machine", zone: "Core Training Zone", resistanceType: "Weight Stack", movementPattern: "Crunch", primaryMuscles: ["Abdominals"], secondaryMuscles: ["Obliques"], difficultyLevel: "Beginner", notes: "Seated machine for crunch movement targeting abs, often weighted." },
  { machineName: "Back Extension Bench", category: "Core Machine", zone: "Core Training Zone", resistanceType: "Bodyweight", movementPattern: "Back Extension", primaryMuscles: ["Lower Back (Erector Spinae)"], secondaryMuscles: ["Glutes"], difficultyLevel: "Beginner", notes: "Hyperextension bench to strengthen the lower back (erector spinae) and glutes." },
  { machineName: "Captain's Chair", category: "Core Machine", zone: "Core Training Zone", resistanceType: "Bodyweight", movementPattern: "Hip/Knee Flexion", primaryMuscles: ["Abdominals"], secondaryMuscles: ["Hip Flexors"], difficultyLevel: "Beginner", notes: "Platform for vertical leg or knee raises to work the abdominal muscles." },
  { machineName: "Dumbbells", category: "Free Weights", zone: "Free Weight Zone", resistanceType: "Fixed Weight", movementPattern: "Various", primaryMuscles: ["Various (e.g. arms, chest, shoulders, legs)"], secondaryMuscles: ["Various"], difficultyLevel: "Beginner to Advanced", notes: "Handheld weights used for a wide range of exercises (curls, presses, etc.)." },
  { machineName: "Barbells", category: "Free Weights", zone: "Free Weight Zone", resistanceType: "Plate Loaded", movementPattern: "Various", primaryMuscles: ["Various (compound lifts)"], secondaryMuscles: ["Various"], difficultyLevel: "Beginner to Advanced", notes: "Long bars used with weight plates for squats, deadlifts, presses, etc." },
  { machineName: "Kettlebells", category: "Free Weights", zone: "Free Weight Zone", resistanceType: "Fixed Weight", movementPattern: "Swing/Snatch", primaryMuscles: ["Legs", "Back", "Shoulders"], secondaryMuscles: ["Core", "Arms"], difficultyLevel: "Intermediate", notes: "Cast-iron weights with handles for swings, lifts, and ballistic movements (functional exercises)." },
  { machineName: "Adjustable Bench", category: "Free Weights", zone: "Free Weight Zone", resistanceType: null, movementPattern: "Various (support)", primaryMuscles: [], secondaryMuscles: [], difficultyLevel: "Beginner", notes: "Incline/decline bench for various dumbbell/barbell exercises (presses, curls, flyes, etc.)." },
  { machineName: "Flat Weight Bench", category: "Free Weights", zone: "Free Weight Zone", resistanceType: null, movementPattern: "Various (support)", primaryMuscles: [], secondaryMuscles: [], difficultyLevel: "Beginner", notes: "Flat bench used primarily for barbell and dumbbell presses, and bench workouts." },
  { machineName: "Squat Rack", category: "Free Weights", zone: "Free Weight Zone", resistanceType: "Bodyweight", movementPattern: "Squat/Press", primaryMuscles: ["Quadriceps", "Glutes"], secondaryMuscles: ["Hamstrings"], difficultyLevel: "Intermediate", notes: "Adjustable rack for performing squats, overhead presses, and bench press with a barbell safely." },
  { machineName: "Weight Plates", category: "Free Weights", zone: "Free Weight Zone", resistanceType: "Fixed Weight", movementPattern: "N/A", primaryMuscles: [], secondaryMuscles: [], difficultyLevel: "N/A", notes: "Removable plates (usually Olympic) for loading barbells or plate machines." },
  { machineName: "Battle Ropes", category: "Functional Training", zone: "Functional Training Zone", resistanceType: "Bodyweight", movementPattern: "Wave Motion", primaryMuscles: ["Shoulders", "Arms"], secondaryMuscles: ["Core"], difficultyLevel: "Intermediate/Advanced", notes: "Heavy ropes for upper-body and core workouts via whipping/waving motions (high-intensity functional training)." },
  { machineName: "Slam Ball", category: "Functional Training", zone: "Functional Training Zone", resistanceType: "Fixed Weight", movementPattern: "Slamming", primaryMuscles: ["Core", "Shoulders"], secondaryMuscles: ["Back"], difficultyLevel: "Beginner/Intermediate", notes: "Heavy rubber ball thrown to the ground to train explosive power and core strength." },
  { machineName: "Plyo Box", category: "Functional Training", zone: "Functional Training Zone", resistanceType: "Bodyweight", movementPattern: "Jump/Step", primaryMuscles: ["Quadriceps", "Glutes"], secondaryMuscles: ["Calves"], difficultyLevel: "Beginner/Intermediate", notes: "Platform used for jump training (box jumps, step-ups) to develop explosive leg power." },
  { machineName: "Bumper Plates", category: "Functional Training", zone: "Functional Training Zone", resistanceType: "Fixed Weight", movementPattern: "N/A", primaryMuscles: [], secondaryMuscles: [], difficultyLevel: "N/A", notes: "Rubber-coated Olympic weight plates for lifting/dropping safely (often used in functional training)." },
  { machineName: "Olympic Barbell", category: "Functional Training", zone: "Functional Training Zone", resistanceType: "Fixed Weight", movementPattern: "Various", primaryMuscles: ["Various"], secondaryMuscles: [], difficultyLevel: "Beginner/Intermediate", notes: "Long bar used for Olympic lifts and loaded lifts (cleans, snatches, thrusts) in functional training." },
  { machineName: "Foam Roller", category: "Stretching/Mobility", zone: "Stretching & Mobility Zone", resistanceType: null, movementPattern: "Self-Myofascial Release", primaryMuscles: [], secondaryMuscles: [], difficultyLevel: "Beginner", notes: "Foam cylinder for massaging and stretching muscles (self-myofascial release)." },
  { machineName: "Exercise Ball", category: "Stretching/Mobility", zone: "Stretching & Mobility Zone", resistanceType: null, movementPattern: "Balance/Stretch", primaryMuscles: ["Core"], secondaryMuscles: ["Legs", "Back"], difficultyLevel: "Beginner", notes: "Large inflatable ball used for core stability exercises and stretching." },
  { machineName: "Exercise Mat", category: "Stretching/Mobility", zone: "Stretching & Mobility Zone", resistanceType: null, movementPattern: "N/A", primaryMuscles: [], secondaryMuscles: [], difficultyLevel: "Beginner", notes: "Cushioned mat for floor stretching, yoga, and mobility exercises." },
  { machineName: "Stretch Rack", category: "Stretching/Mobility", zone: "Stretching & Mobility Zone", resistanceType: null, movementPattern: "N/A", primaryMuscles: [], secondaryMuscles: [], difficultyLevel: "Beginner", notes: "Wall-mounted bars or frame to support various stretching exercises (hamstrings, back, etc.)." },
  { machineName: "Resistance Bands", category: "Stretching/Mobility", zone: "Stretching & Mobility Zone", resistanceType: "Elastic", movementPattern: "Various", primaryMuscles: [], secondaryMuscles: [], difficultyLevel: "Beginner", notes: "Elastic bands for assisted stretching and light resistance exercises." },
  { machineName: "Spin Bike", category: "Virtual Training Station", zone: "Virtual Training Zone", resistanceType: "Bodyweight", movementPattern: "Cycling", primaryMuscles: ["Quadriceps", "Hamstrings", "Glutes"], secondaryMuscles: ["Calves"], difficultyLevel: "Intermediate", notes: "Stationary bike for virtual cycling classes on big screens." },
  { machineName: "Virtual Coach Kiosk", category: "Virtual Training Station", zone: "Virtual Training Zone", resistanceType: null, movementPattern: null, primaryMuscles: [], secondaryMuscles: [], difficultyLevel: "Beginner", notes: "Interactive touchscreen providing guided workout plans and schedules." },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Equipment.deleteMany({});
    console.log('Cleared existing equipment');
    
    await Equipment.insertMany(equipmentList);
    console.log(`Seeded ${equipmentList.length} equipment items`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
