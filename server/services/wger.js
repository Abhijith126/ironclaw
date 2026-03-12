const axios = require('axios');

const WGER_BASE_URL = 'https://wger.de/api/v2';
const WGER_API_KEY = process.env.WGER_API_KEY || '9574d38b0117a1ff7e6b9b0a0efe722b5999c170';

const cache = {
  exercises: null,
  equipment: null,
  muscles: null,
  categories: null,
  lastFetch: null
};

const CACHE_DURATION = 24 * 60 * 60 * 1000;

const getHeaders = () => {
  const headers = {
    'Accept': 'application/json'
  };
  if (WGER_API_KEY) {
    headers['Authorization'] = `Token ${WGER_API_KEY}`;
  }
  return headers;
};

async function fetchWithCache(key, fetcher, forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cache[key] && cache.lastFetch && (now - cache.lastFetch) < CACHE_DURATION) {
    return cache[key];
  }

  const data = await fetcher();
  cache[key] = data;
  cache.lastFetch = now;
  return data;
}

async function fetchAllPages(endpoint) {
  const results = [];
  let nextUrl = `${WGER_BASE_URL}${endpoint}`;

  while (nextUrl) {
    try {
      const response = await axios.get(nextUrl, { headers: getHeaders() });
      results.push(...response.data.results);
      nextUrl = response.data.next;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error.message);
      throw error;
    }
  }

  return results;
}

async function fetchExercises(forceRefresh = false) {
  return fetchWithCache('exercises', async () => {
    const exercises = await fetchAllPages('/exerciseinfo/?language=2&limit=100');
    
    return exercises.map(ex => {
      const nameObj = ex.translations?.find(t => t.language === 2) || ex.translations?.[0] || {};
      const categoryName = ex.category?.name || 'Other';
      
      const steps = [];
      const tips = [];
      
      if (nameObj.description) {
        const cleanDesc = nameObj.description.replace(/<[^>]*>/g, '').trim();
        const paragraphs = cleanDesc.split(/\n\n+/).filter(p => p.trim());
        
        paragraphs.forEach(p => {
          const lines = p.split(/\n/).filter(l => l.trim());
          lines.forEach(line => {
            const cleanLine = line.replace(/^[-•*]\s*/, '').trim();
            if (cleanLine.length > 10) {
              if (cleanLine.toLowerCase().includes('tip') || cleanLine.toLowerCase().includes('note')) {
                tips.push(cleanLine);
              } else {
                steps.push(cleanLine);
              }
            }
          });
        });
      }
      
      return {
        id: `wger_${ex.id}`,
        wgerId: ex.id,
        name: nameObj.name || `Exercise ${ex.id}`,
        category: categoryName.toLowerCase(),
        categoryName: categoryName,
        muscles: ex.muscles?.map(m => m.name_en || m.name) || [],
        musclesSecondary: ex.muscles_secondary?.map(m => m.name_en || m.name) || [],
        equipment: ex.equipment?.map(e => e.name) || [],
        description: nameObj.description?.replace(/<[^>]*>/g, '') || '',
        instructions: steps.length > 0 ? steps : ['Perform the exercise with proper form'],
        tips: tips.length > 0 ? tips : ['Focus on controlled movement', 'Breathe steadily'],
        images: ex.images || [],
        videos: ex.videos || [],
      };
    });
  }, forceRefresh);
}

async function fetchEquipment(forceRefresh = false) {
  return fetchWithCache('equipment', async () => {
    const equipment = await fetchAllPages('/equipment/');
    return equipment.map(formatEquipment);
  }, forceRefresh);
}

async function fetchMuscles(forceRefresh = false) {
  return fetchWithCache('muscles', async () => {
    const muscles = await fetchAllPages('/muscle/');
    return muscles.map(formatMuscle);
  }, forceRefresh);
}

async function fetchCategories(forceRefresh = false) {
  return fetchWithCache('categories', async () => {
    const categories = await fetchAllPages('/exercisecategory/');
    return categories.map(formatCategory);
  }, forceRefresh);
}

function formatExercise(ex) {
  const nameObj = ex.exercises.find(e => e.language === 2) || ex.exercises[0] || {};
  const descObj = ex.description.find(d => d.language === 2) || ex.description[0] || {};

  return {
    id: `wger_${ex.id}`,
    wgerId: ex.id,
    name: nameObj.name || `Exercise ${ex.id}`,
    category: ex.category,
    categoryName: null,
    muscles: ex.muscles || [],
    musclesSecondary: ex.muscles_secondary || [],
    equipment: ex.equipment || [],
    equipmentNames: [],
    description: descObj.description || '',
    descriptionHtml: descObj.html || '',
  };
}

function formatEquipment(eq) {
  return {
    id: eq.id,
    name: eq.name,
    nameOriginal: eq.name_original || eq.name
  };
}

function formatMuscle(m) {
  return {
    id: m.id,
    name: m.name,
    nameEn: m.name_en || m.name,
    front: m.front || false
  };
}

function formatCategory(cat) {
  return {
    id: cat.id,
    name: cat.name
  };
}

async function getEnrichedExercises(forceRefresh = false) {
  const [exercises, equipment, muscles, categories] = await Promise.all([
    fetchExercises(forceRefresh),
    fetchEquipment(forceRefresh),
    fetchMuscles(forceRefresh),
    fetchCategories(forceRefresh)
  ]);

  const equipmentMap = equipment.reduce((acc, eq) => {
    acc[eq.id] = eq.name;
    return acc;
  }, {});

  const muscleMap = muscles.reduce((acc, m) => {
    acc[m.id] = m.nameEn || m.name;
    return acc;
  }, {});

  const categoryMap = categories.reduce((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  return exercises.map(ex => ({
    ...ex,
    categoryName: ex.category ? categoryMap[ex.category] : null,
    equipmentNames: ex.equipment.map(id => equipmentMap[id]).filter(Boolean),
    muscleNames: ex.muscles.map(id => muscleMap[id]).filter(Boolean),
    muscleSecondaryNames: ex.musclesSecondary.map(id => muscleMap[id]).filter(Boolean)
  }));
}

async function getExerciseById(wgerId) {
  const exercises = await fetchExercises();
  return exercises.find(ex => ex.wgerId === parseInt(wgerId));
}

module.exports = {
  fetchExercises,
  fetchEquipment,
  fetchMuscles,
  fetchCategories,
  getEnrichedExercises,
  getExerciseById,
  cache
};
