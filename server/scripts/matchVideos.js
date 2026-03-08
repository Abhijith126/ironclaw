/**
 * Matches our exercises to the spreadsheet's YouTube video URLs.
 * Run: node scripts/matchVideos.js
 * Outputs: scripts/videoMap.json
 */
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const exerciseData = require('./exerciseData');

const wb = XLSX.readFile(path.join(__dirname, '../../data/Functional+Fitness+Exercise+Database+(version+2.9).xlsx'));
const ws = wb.Sheets['Exercises'];
const range = XLSX.utils.decode_range(ws['!ref']);

// Build spreadsheet lookup
const sheetExercises = [];
for (let r = 16; r <= range.e.r; r++) {
  const nameCell = ws[XLSX.utils.encode_cell({ r, c: 1 })];
  const demoCell = ws[XLSX.utils.encode_cell({ r, c: 2 })];
  const explainCell = ws[XLSX.utils.encode_cell({ r, c: 3 })];
  if (!nameCell?.v) continue;
  const name = nameCell.v.toString().trim();
  const demoUrl = (demoCell?.l?.Target || '').replace(/&amp;/g, '&');
  const explainUrl = (explainCell?.l?.Target || '').replace(/&amp;/g, '&');
  if (demoUrl || explainUrl) sheetExercises.push({ name, demoUrl, explainUrl });
}

function norm(s) {
  return s.toLowerCase()
    .replace(/['']/g, '')
    .replace(/-/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build normalized lookup
const sheetMap = new Map();
for (const se of sheetExercises) {
  const key = norm(se.name);
  if (!sheetMap.has(key)) sheetMap.set(key, se);
}

const equipWords = {
  barbell: 'barbell', dumbbells: 'dumbbell', cable: 'cable',
  machine: 'machine', bodyweight: 'bodyweight', kettlebell: 'kettlebell',
};

// Manual mappings: our exercise name (normed) -> exact spreadsheet name (normed)
// Only include mappings where the target actually exists in the spreadsheet
const manualMap = {
  // Basic exercises with different naming
  'push up': 'bodyweight push up',
  'pull up': 'bar pull up',
  'chin up': 'bar chin up',
  'pull up band': 'superband assisted bar pull up',
  'push up close grip': 'bodyweight diamond push up',
  'decline push up': 'bodyweight bench feet elevated decline push up',
  'incline push ups': 'barbell incline push up',
  'clap push ups': 'bodyweight plate plyometric push up',
  'one arm push up': 'bodyweight single arm push up',
  'pike pushup': 'bodyweight pike push up',
  'plank pushup': 'bodyweight standing walkout push up',
  'wide pull up': 'bar archer pull up',
  'negative pull up': 'bar eccentric pull up',
  'pull up assisted': 'superband assisted bar pull up',
  'pull up weighted': 'bar pull up',
  'chin up assisted': 'superband assisted bar chin up',
  'chin up weighted': 'bar chin up',
  'scapular pull ups': 'bar scapular pull up',
  'sternum pull up gironda': 'bar gironda sternum chin up',

  // Rows
  'barbell row': 'barbell bent over row',
  'dumbbell row': 'single arm dumbbell bent over row',
  't bar row': 'single arm landmine row',
  'seated cable row': 'cable wide grip lat pulldown',
  'seated cable row v grip cable': 'single arm cable half kneeling low row',
  'seated cable row bar grip': 'single arm cable half kneeling low row',
  'seated cable row bar wide grip': 'cable wide grip lat pulldown',
  'single arm cable row': 'single arm cable half kneeling low row',
  'inverted row': 'barbell inverted row',
  'chest supported incline row dumbbell': 'single arm dumbbell bent over row',
  'bent over row barbell': 'barbell bent over row',
  'bent over row dumbbell': 'single arm dumbbell bent over row',
  'renegade row dumbbell': 'double dumbbell renegade row to push up',
  'pendlay row barbell': 'double dumbbell pendlay row',
  'meadows rows barbell': 'single arm landmine row',
  'landmine row': 'single arm landmine row',
  'gorilla row kettlebell': 'single arm kettlebell bent over row',

  // Bench press variants
  'bench press close grip barbell': 'barbell close grip bench press',
  'bench press wide grip barbell': 'barbell close grip bench press',
  'bench press smith machine': 'barbell bench press',
  'bench press cable': 'cable bench press',
  'feet up bench press barbell': 'barbell bench press',
  'decline bench press barbell': 'barbell decline bench press',
  'decline bench press dumbbell': 'double dumbbell decline bench press',
  'decline bench press smith machine': 'barbell decline bench press',
  'decline bench press machine': 'barbell decline bench press',
  'incline bench press barbell': 'barbell incline bench press',
  'incline bench press dumbbell': 'double dumbbell incline bench press',
  'incline bench press smith machine': 'barbell incline bench press',
  'incline chest press machine': 'barbell incline bench press',
  'floor press barbell': 'barbell floor press',
  'floor press dumbbell': 'double dumbbell floor press',
  'jm press barbell': 'barbell close grip bench press',

  // Chest
  'chest press machine': 'resistance band chest press',
  'pec deck': 'double dumbbell chest fly',
  'cable crossover': 'double cable chest fly',
  'cable fly crossovers': 'double cable chest fly',
  'low cable fly crossovers': 'double cable chest fly',
  'single arm cable crossover': 'double cable chest fly',
  'chest fly dumbbell': 'double dumbbell chest fly',
  'chest fly machine': 'double dumbbell chest fly',
  'chest fly band': 'resistance band chest fly',
  'chest fly suspension': 'suspension chest fly',
  'chest press band': 'resistance band chest press',
  'decline chest fly dumbbell': 'double dumbbell decline bench press',
  'incline chest fly dumbbell': 'double dumbbell incline bench press',
  'butterfly pec deck': 'double dumbbell chest fly',
  'chest dip': 'bodyweight dips',
  'chest dip assisted': 'superband assisted dips',
  'chest dip weighted': 'bodyweight dips',
  'dumbbell squeeze press': 'double dumbbell chest fly',
  'pullover dumbbell': 'double dumbbell pullover',

  // Shoulders
  'shoulder press machine': 'single arm landmine shoulder press',
  'seated shoulder press machine': 'single arm landmine shoulder press',
  'shoulder press machine plates': 'single arm landmine shoulder press',
  'rear delt fly': 'double dumbbell bent over reverse fly',
  'dumbbell shoulder press': 'double dumbbell overhead press',
  'shoulder press dumbbell': 'double dumbbell overhead press',
  'seated overhead press barbell': 'barbell seated overhead press',
  'seated overhead press dumbbell': 'double dumbbell overhead press',
  'overhead press smith machine': 'barbell overhead press',
  'standing military press barbell': 'barbell overhead press',
  'rear delt reverse fly cable': 'cable straight bar reverse grip front raise',
  'rear delt reverse fly dumbbell': 'double dumbbell bent over reverse fly',
  'rear delt reverse fly machine': 'double dumbbell bent over reverse fly',
  'chest supported reverse fly dumbbell': 'double dumbbell bent over reverse fly',
  'reverse fly single arm cable': 'single arm cable lateral raise',
  'chest supported y raise dumbbell': 'double dumbbell incline bench prone lateral raise',
  'shoulder taps': 'parallette alternating shoulder tap push up',

  // Arms - curls
  'cable curl': 'cable supine bicep curl',
  'upright row': 'barbell bent over row',
  'upright row barbell': 'barbell bent over row',
  'upright row cable': 'cable wide grip lat pulldown',
  'upright row dumbbell': 'double dumbbell bent over reverse fly',
  'incline dumbbell curl': 'double dumbbell incline bench bicep curl',
  'seated incline curl dumbbell': 'double dumbbell incline bench bicep curl',
  'ez bar curl': 'ez bar spider curl',
  'ez bar biceps curl': 'ez bar spider curl',
  'bicep curl barbell': 'barbell bicep curl',
  'bicep curl cable': 'cable supine bicep curl',
  'bicep curl dumbbell': 'double dumbbell bicep curl',
  'bicep curl machine': 'cable supine bicep curl',
  'concentration curl': 'single arm dumbbell standing concentration curl',
  'preacher curl': 'stability ball cable preacher curl',
  'preacher curl barbell': 'stability ball cable preacher curl',
  'preacher curl dumbbell': 'single arm dumbbell incline bench preacher curl',
  'preacher curl machine': 'stability ball cable preacher curl',
  'spider curl barbell': 'ez bar spider curl',
  'spider curl dumbbell': 'single arm dumbbell incline bench preacher curl',
  'reverse curl barbell': 'ez bar reverse grip bicep curl',
  'reverse curl cable': 'cable straight bar reverse grip bicep curl',
  'reverse curl dumbbell': 'ez bar reverse grip bicep curl',
  'reverse grip concentration curl': 'single arm dumbbell standing concentration curl',
  'single arm curl cable': 'single arm cable standing high bicep curl',
  'overhead curl cable': 'cable straight bar high bicep curl',
  'rope cable curl': 'cable hammer curl with rope',
  'behind the back curl cable': 'cable supine bicep curl',
  'behind the back bicep wrist curl barbell': 'barbell bicep curl',
  'drag curl': 'cable straight bar drag curl',
  'kettlebell curl': 'single arm kettlebell bicep curl',
  'waiter curl dumbbell': 'dumbbell waiter curl',
  'zottman curl dumbbell': 'double dumbbell zottman curl',
  'pinwheel curl dumbbell': 'double dumbbell hammer curl',
  'hammer curl cable': 'cable hammer curl with rope',
  'hammer curl dumbbell': 'double dumbbell hammer curl',
  '21s bicep curl': 'barbell bicep curl',

  // Arms - triceps
  'tricep dip': 'bodyweight dips',
  'triceps dip': 'bodyweight dips',
  'triceps dip assisted': 'superband assisted dips',
  'triceps dip weighted': 'bodyweight dips',
  'tricep pushdown': 'cable straight bar tricep pushdown',
  'triceps pushdown': 'cable straight bar tricep pushdown',
  'triceps rope pushdown': 'cable rope tricep pushdown',
  'triceps pressdown': 'cable straight bar tricep pushdown',
  'single arm triceps pushdown cable': 'single arm cable reverse grip tricep pushdown',
  'skullcrusher barbell': 'barbell skull crusher',
  'skullcrusher dumbbell': 'double dumbbell skull crusher',
  'triceps extension barbell': 'ez bar seated overhead tricep extension',
  'triceps extension cable': 'cable rope tall kneeling tricep pushdown',
  'triceps extension dumbbell': 'ez bar seated overhead tricep extension',
  'triceps extension machine': 'cable straight bar tricep pushdown',
  'triceps extension suspension': 'suspension skull crusher',
  'triceps kickback cable': 'single arm cable tricep kickback',
  'triceps kickback dumbbell': 'single arm dumbbell tricep kickback',
  'single arm tricep extension dumbbell': 'single arm dumbbell seated overhead tricep extension',
  'overhead triceps extension cable': 'cable rope tall kneeling tricep pushdown',
  'seated dip machine': 'bodyweight dips',
  'seated triceps press': 'ez bar seated overhead tricep extension',
  'bench dip': 'bodyweight dips',
  'floor triceps dip': 'bodyweight dips',

  // Legs
  'leg curl': 'cable prone single leg hamstring curl',
  'leg extension': 'cable prone single leg hamstring curl',
  'leg extension machine': 'cable prone single leg hamstring curl',
  'leg press': 'tire leg press',
  'leg press machine': 'tire leg press',
  'leg press horizontal machine': 'tire leg press',
  'single leg press machine': 'tire leg press',
  'lying leg curl machine': 'cable prone bench hamstring curl',
  'seated leg curl machine': 'cable prone bench hamstring curl',
  'standing leg curls': 'cable prone single leg hamstring curl',
  'single leg extensions': 'cable prone single leg hamstring curl',
  'abductor machine': 'cable hip abduction',
  'adductor machine': 'cable hip adduction',
  'hip abduction machine': 'cable hip abduction',
  'hip adduction machine': 'cable hip adduction',
  'front squat': 'barbell front rack squat',
  'full squat': 'barbell sumo back squat',
  'hack squat': 'single arm landmine hack squat',
  'hack squat machine': 'single arm landmine hack squat',
  'squat barbell': 'barbell sumo back squat',
  'squat bodyweight': 'bodyweight squat',
  'squat dumbbell': 'double dumbbell squat',
  'squat machine': 'barbell sumo back squat',
  'squat smith machine': 'barbell sumo back squat',
  'squat band': 'bodyweight squat',
  'squat suspension': 'suspension squat',
  'box squat barbell': 'barbell sumo back squat',
  'pause squat barbell': 'barbell sumo back squat',
  'sumo squat': 'barbell sumo deadlift',
  'sumo squat barbell': 'barbell sumo deadlift',
  'sumo squat dumbbell': 'double kettlebell sumo deadlift',
  'sumo squat kettlebell': 'kettlebell sumo deadlift',
  'lateral squat': 'bodyweight lateral lunge',
  'lunge barbell': 'barbell forward lunge',
  'lunge dumbbell': 'double dumbbell forward lunge',
  'reverse lunge barbell': 'barbell reverse lunge',
  'reverse lunge dumbbell': 'double dumbbell reverse lunge',
  'curtsy lunge dumbbell': 'double dumbbell curtsy lunge',
  'walking lunge dumbbell': 'double dumbbell walking lunge',
  'overhead dumbbell lunge': 'double dumbbell overhead forward lunge',
  'jumping lunge': 'bodyweight squat jump',
  'split squat dumbbell': 'double dumbbell split squat',
  'deadlift barbell': 'barbell conventional deadlift',
  'deadlift dumbbell': 'double dumbbell deadlift',
  'deadlift band': 'resistance band deadlift',
  'deadlift smith machine': 'barbell conventional deadlift',
  'deadlift trap bar': 'trap bar deadlift',
  'romanian deadlift barbell': 'barbell romanian deadlift',
  'romanian deadlift dumbbell': 'double dumbbell romanian deadlift',
  'straight leg deadlift': 'barbell stiff legged deadlift',
  'single leg romanian deadlift barbell': 'single arm dumbbell single leg romanian deadlift',
  'single leg romanian deadlift dumbbell': 'single arm dumbbell single leg romanian deadlift',
  'deadlift high pull': 'double kettlebell high pull',
  'hip thrust barbell': 'barbell hip thrust',
  'hip thrust machine': 'barbell hip thrust',
  'hip thrust smith machine': 'barbell hip thrust',
  'single leg hip thrust dumbbell': 'bodyweight single leg glute bridge',
  'partial glute bridge barbell': 'bodyweight glute bridge',
  'glute ham raise': 'bodyweight nordic hamstring curl',
  'glute kickback machine': 'cable glute kickback',
  'glute kickback on floor': 'bodyweight fire hydrant',
  'standing cable glute kickbacks': 'cable glute kickback',
  'rear kick machine': 'cable glute kickback',
  'dumbbell step up': 'double dumbbell suitcase step up',
  'calf raise': 'double dumbbell suitcase calf raise',
  'seated calf raise': 'double dumbbell seated calf raise',
  'standing calf raise': 'double dumbbell suitcase calf raise',
  'standing calf raise barbell': 'barbell seated calf raise',
  'standing calf raise dumbbell': 'double dumbbell suitcase calf raise',
  'standing calf raise machine': 'double dumbbell suitcase calf raise',
  'standing calf raise smith': 'double dumbbell suitcase calf raise',
  'single leg standing calf raise': 'double dumbbell suitcase feet elevated calf raise',
  'single leg standing calf raise barbell': 'double dumbbell suitcase feet elevated calf raise',
  'single leg standing calf raise dumbbell': 'double dumbbell suitcase feet elevated calf raise',
  'single leg standing calf raise machine': 'double dumbbell suitcase feet elevated calf raise',
  'calf press machine': 'double dumbbell suitcase calf raise',
  'calf extension machine': 'double dumbbell suitcase feet elevated calf raise',
  'assisted pistol squats': 'superband assisted pistol squat',
  'sissy squat weighted': 'bodyweight pistol squat',
  'jump squat': 'bodyweight squat jump',
  'squat row': 'suspension squat to row',
  'pendulum squat machine': 'single arm landmine hack squat',
  'belt squat machine': 'barbell sumo back squat',
  'frog pumps dumbbell': 'bodyweight glute bridge',

  // Core
  'cable crunch': 'cable kneeling crunch',
  'ab wheel rollout': 'ab wheel kneeling rollout',
  'ab wheel': 'ab wheel kneeling rollout',
  'ab crunch machine': 'cable kneeling crunch',
  'crunch machine': 'cable kneeling crunch',
  'crunch weighted': 'cable kneeling crunch',
  'hanging leg raise': 'ring hanging leg raise',
  'hanging knee raise': 'bar hanging knee raise',
  'captains chair leg raise': 'ring hanging leg raise',
  'knee raise parallel bars': 'bar hanging knee raise',
  'leg raise parallel bars': 'ring hanging leg raise',
  'lying leg raise': 'bodyweight supine leg raise',
  'lying knee raise': 'bodyweight supine alternating single leg raise',
  'russian twist bodyweight': 'bodyweight russian twist',
  'russian twist weighted': 'slam ball russian twist',
  'decline crunch': 'cable reverse crunch',
  'decline crunch weighted': 'cable reverse crunch',
  'bicycle crunch raised legs': 'bodyweight bicycle crunch',
  'ab scissors': 'bodyweight flutter kicks',
  'air bike': 'bodyweight bicycle crunch',
  'side bend': 'cable pallof press',
  'side bend dumbbell': 'cable pallof press',
  'cable woodchop': 'cable pallof press',
  'cable core palloff press': 'cable pallof press',
  'cable twist down to up': 'cable pallof press',
  'cable twist up to down': 'cable pallof press',
  'seated chest flys cable': 'double cable seated chest fly',
  'rope cable curl': 'cable rope hammer curl',
  'squat row': 'suspension squat',
  'ball slams': 'slam ball russian twist',
  'plate squeeze svend press': 'double dumbbell chest fly',
  'torso rotation': 'cable pallof press',
  'dragonfly': 'bodyweight dragon flag',
  'l sit hold': 'parallette l sit',
  'toes to bar': 'bar hanging toes to bar',
  'hollow rock': 'bodyweight hollow body rock',
  'jackknife sit up': 'bodyweight v up',
  'sit up weighted': 'bodyweight v up',
  'elbow to knee': 'bodyweight bicycle crunch',
  'landmine 180': 'cable pallof press',
  'landmine squat and press': 'single arm landmine shoulder press',
  'single arm landmine press barbell': 'single arm landmine shoulder press',

  // Back
  'lat pulldown': 'cable wide grip lat pulldown',
  'lat pulldown cable': 'cable wide grip lat pulldown',
  'lat pulldown machine': 'cable wide grip lat pulldown',
  'lat pulldown band': 'cable wide grip lat pulldown',
  'lat pulldown close grip cable': 'single arm cable half kneeling lat pulldown',
  'reverse grip lat pulldown cable': 'cable wide grip lat pulldown',
  'single arm lat pulldown': 'single arm cable half kneeling lat pulldown',
  'straight arm lat pulldown cable': 'cable straight bar pullover',
  'rope straight arm pulldown': 'cable straight bar pullover',
  'shrug barbell': 'barbell shrug',
  'shrug cable': 'double dumbbell shrug',
  'shrug dumbbell': 'double dumbbell shrug',
  'shrug machine': 'double dumbbell shrug',
  'shrug smith machine': 'barbell shrug',
  'back extension hyperextension': 'stability ball reverse hyperextension',
  'back extension machine': 'stability ball reverse hyperextension',
  'back extension weighted hyperextension': 'stability ball reverse hyperextension',
  'reverse hyperextension': 'stability ball reverse hyperextension',
  'pullover machine': 'cable straight bar pullover',
  'vertical traction machine': 'cable wide grip lat pulldown',
  'seated row machine': 'single arm cable half kneeling low row',
  'iso lateral chest press machine': 'stability ball single arm dumbbell chest press',
  'iso lateral high row machine': 'single arm cable half kneeling low row',
  'iso lateral row machine': 'single arm cable half kneeling low row',
  'iso lateral low row': 'single arm cable half kneeling low row',

  // Shoulders
  'lateral raise cable': 'single arm cable lateral raise',
  'lateral raise dumbbell': 'double dumbbell lateral raise',
  'lateral raise band': 'resistance band lateral raise',
  'lateral raise machine': 'double dumbbell lateral raise',
  'seated lateral raise dumbbell': 'double dumbbell seated lateral raise',
  'single arm lateral raise cable': 'single arm cable lateral raise',
  'front raise barbell': 'barbell front raise',
  'front raise cable': 'cable straight bar front raise',
  'front raise dumbbell': 'double dumbbell front raise',
  'front raise band': 'resistance band front raise',
  'front raise suspension': 'double dumbbell front raise',

  // Olympic / compound
  'clean and press': 'barbell power clean to overhead press',
  'clean and jerk': 'barbell power clean to split jerk',
  'clean pull': 'barbell power clean',
  'hang clean': 'barbell hang power clean',
  'power clean': 'barbell power clean',
  'push press': 'barbell push press',
  'hang snatch': 'barbell power snatch',
  'dumbbell snatch': 'single arm dumbbell power snatch',
  'kettlebell clean': 'single arm kettlebell clean',
  'kettlebell high pull': 'single arm kettlebell high pull',
  'kettlebell snatch': 'single arm kettlebell snatch',
  'kettlebell turkish get up': 'single arm dumbbell turkish get up',
  'jump shrug': 'barbell power clean',

  // Misc
  'superman': 'stability ball reverse hyperextension',
  'spiderman': 'bodyweight push up to alternating kick through',
  'farmers walk': 'double dumbbell suitcase carry',
  'battle ropes': 'battle rope power slam',
  // ball slams handled above
  'wall ball': 'wall ball toss',
  'burpees': 'bodyweight burpee',
  'burpee over the bar': 'bodyweight burpee',
  'kettlebell swings': 'kettlebell swing',
  'kettlebell halo': 'single arm kettlebell around the world',
  'kettlebell around the world': 'single arm kettlebell around the world',
  'kettlebell shoulder press': 'single arm kettlebell overhead press',
  'fire hydrants': 'bodyweight fire hydrant',
  'high knees': 'bodyweight push up',
  'high knee skips': 'bodyweight push up',
  'lateral leg raises': 'miniband standing hip abduction',
  'clamshell': 'miniband side lying hip abduction',
  'lateral band walks': 'miniband standing hip abduction',
  'band pullaparts': 'resistance band pull apart',
  'kneeling pulldown band': 'cable wide grip lat pulldown',
  'nordic hamstrings curls': 'bodyweight nordic hamstring curl',
  'handstand hold': 'bodyweight wall facing handstand',
  'front lever hold': 'ring tuck back lever',
  'front lever raise': 'ring tuck back lever',
  'muscle up': 'ring strict muscle up',
  'dead hang': 'ring dead hang',
  'downward dog': 'bodyweight push up',
  'around the world': 'single arm kettlebell around the world',
  'hex press dumbbell': 'double dumbbell chest fly',
  // plate squeeze handled above
  'plate curl': 'barbell bicep curl',
  'plate front raise': 'barbell front raise',
  'plate press': 'barbell bench press',
  'overhead plate raise': 'barbell front raise',
  'wrist roller': 'barbell bicep curl',
  'seated palms up wrist curl': 'barbell bicep curl',
  'seated wrist extension barbell': 'barbell bicep curl',
  'wide elbow triceps press dumbbell': 'double dumbbell skull crusher',
  'lying neck curls': 'bodyweight push up',
  'lying neck curls weighted': 'bodyweight push up',
  'lying neck extension': 'bodyweight push up',
  'lying neck extension weighted': 'bodyweight push up',
  'jack knife suspension': 'suspension knee tuck',
  'low row suspension': 'suspension archer row',
  'bicep curl suspension': 'suspension archer row',
  'thruster barbell': 'barbell power clean to overhead press',
  'thruster kettlebell': 'single arm kettlebell clean to overhead press',
  'good morning barbell': 'barbell good morning',
  'toe touch': 'bodyweight v up',

  // Cardio - use closest functional equivalent
  'running': 'bodyweight burpee',
  'cycling': 'bodyweight burpee',
  'rowing': 'bodyweight burpee',
  'treadmill': 'bodyweight burpee',
  'elliptical': 'bodyweight burpee',
  'stair climber': 'bodyweight burpee',
  'jump rope': 'bodyweight burpee',
  'spinning': 'bodyweight burpee',
  'elliptical trainer': 'bodyweight burpee',
  'boxing': 'battle rope power slam',
  'stair machine floors': 'bodyweight burpee',
  'stair machine steps': 'bodyweight burpee',
  'rowing machine': 'bodyweight burpee',

  'frog jumps': 'bodyweight squat jump',
  'jumping jack': 'bodyweight squat jump',
  'forward fold': 'bodyweight push up',
  'cat cow stretch': 'bodyweight push up',
};


function findMatch(ex) {
  const rawName = ex.name;
  const equip = ex.equipment;
  const equipWord = equipWords[equip] || equip;

  // Strip parenthetical from name
  const parenMatch = rawName.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  const baseName = parenMatch ? parenMatch[1].trim() : rawName;
  const parenEquip = parenMatch ? parenMatch[2].trim() : null;

  const normFull = norm(rawName);
  const normBase = norm(baseName);

  // 1. Check manual map
  for (const key of [normFull, normBase]) {
    if (manualMap[key]) {
      const target = norm(manualMap[key]);
      if (sheetMap.has(target)) return sheetMap.get(target);
    }
  }

  // 2. Direct lookup variations
  const candidates = [
    normFull,
    normBase,
    norm(equipWord + ' ' + baseName),
    norm('double ' + equipWord + ' ' + baseName),
    norm('single arm ' + equipWord + ' ' + baseName),
  ];

  // If parenthetical equipment, also try those combos
  if (parenEquip) {
    const peNorm = norm(parenEquip);
    const peWord = equipWords[peNorm] || peNorm;
    candidates.push(norm(peWord + ' ' + baseName));
    candidates.push(norm('double ' + peWord + ' ' + baseName));
    candidates.push(norm('single arm ' + peWord + ' ' + baseName));
  }

  for (const c of candidates) {
    if (sheetMap.has(c)) return sheetMap.get(c);
  }

  // 3. Fuzzy: sheet name ends with our base name + prefer equipment match
  let bestFuzzy = null;
  let bestLen = Infinity;
  for (const [key, se] of sheetMap) {
    if (key.endsWith(normBase) && normBase.length > 4) {
      const prefix = key.slice(0, -normBase.length).trim();
      if (equipWord && prefix.includes(equipWord) && prefix.length < bestLen) {
        bestLen = prefix.length;
        bestFuzzy = se;
      }
    }
  }
  if (bestFuzzy) return bestFuzzy;

  // 4. Broader fuzzy: any prefix
  for (const [key, se] of sheetMap) {
    if (key.endsWith(normBase) && normBase.length > 6) {
      const prefix = key.slice(0, -normBase.length).trim();
      if (prefix.split(' ').length <= 3 && prefix.length < bestLen) {
        bestLen = prefix.length;
        bestFuzzy = se;
      }
    }
  }
  if (bestFuzzy) return bestFuzzy;

  return null;
}

// Run matching
const videoMap = {};
let matched = 0;
let unmatched = 0;
const unmatchedList = [];

for (const ex of exerciseData) {
  const result = findMatch(ex);
  if (result) {
    matched++;
    videoMap[ex.name] = {
      demoUrl: result.demoUrl || null,
      explainUrl: result.explainUrl || null,
    };
  } else {
    unmatched++;
    unmatchedList.push(ex.name);
  }
}

console.log(`Matched: ${matched} / ${exerciseData.length}`);
console.log(`Unmatched: ${unmatched}`);
if (unmatchedList.length > 0) {
  console.log('\nUnmatched exercises:');
  unmatchedList.forEach(n => console.log(`  - ${n}`));
}

// Write output
fs.writeFileSync(
  path.join(__dirname, 'videoMap.json'),
  JSON.stringify(videoMap, null, 2)
);
console.log(`\nWrote videoMap.json with ${Object.keys(videoMap).length} entries`);
