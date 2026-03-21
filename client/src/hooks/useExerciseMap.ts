import { useState, useEffect } from 'react';
import { getExerciseMap } from '../services/api';
import type { ExerciseMapEntry } from '../services/api';

export type { ExerciseMapEntry };
export type ExerciseMap = Record<string, ExerciseMapEntry>;

export function useExerciseMap() {
  const [exerciseMap, setExerciseMap] = useState<ExerciseMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getExerciseMap()
      .then((map) => {
        if (!cancelled) setExerciseMap(map);
      })
      .catch((err) => console.error('Failed to fetch exercises:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { exerciseMap, loading };
}
