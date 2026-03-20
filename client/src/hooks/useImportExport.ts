import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { userAPI, getExerciseNameMap } from '../services/api';
import { downloadJSON, readJSONFile } from '../utils';

interface ImportData {
  [key: string]: Array<{
    id: string;
    name?: string;
    imageUrl?: string;
    sets: number;
    reps: number;
  }>;
}

interface UseImportExportReturn {
  importData: ImportData | null;
  isImporting: boolean;
  error: string | null;
  handleExport: () => Promise<void>;
  handleImportClick: () => void;
  handleImport: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  confirmImport: () => Promise<void>;
  clearImportData: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function useImportExport(): UseImportExportReturn {
  const { t } = useTranslation();
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(async () => {
    try {
      const scheduleRes = await userAPI.getWeeklySchedule();
      const schedule = scheduleRes.data.weeklySchedule;

      const scheduleWithNames: Record<
        string,
        Array<{
          id: string;
          exerciseId: string;
          name: string;
          imageUrl?: string;
          sets: number;
          reps: number;
        }>
      > = {};
      for (const [day, exercises] of Object.entries(schedule || {})) {
        const exList =
          (exercises as Array<{
            id: string;
            name?: string;
            imageUrl?: string;
            sets: number;
            reps: number;
          }>) || [];
        scheduleWithNames[day] = exList.map((ex) => ({
          id: ex.id,
          exerciseId: ex.id,
          name: ex.name || ex.id,
          imageUrl: ex.imageUrl,
          sets: ex.sets,
          reps: ex.reps,
        }));
      }

      const data = {
        weeklySchedule: scheduleWithNames,
        exportedAt: new Date().toISOString(),
        version: '2',
      };
      const filename = `workout-schedule-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(data, filename);
    } catch (err) {
      console.error('Export failed:', err);
      setError(t('importExport.importFailed'));
    }
  }, [t]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImport = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsImporting(true);
      setError(null);

      try {
        const data = (await readJSONFile(file)) as Record<string, unknown>;

        if (!data.weeklySchedule || typeof data.weeklySchedule !== 'object') {
          setError(t('importExport.invalidFormatMessage'));
          return;
        }

        const exerciseMap = (await getExerciseNameMap()) as Record<
          string,
          { id: string; name: string; imageUrl?: string }
        >;
        const exerciseMapById: Record<string, string> = {};
        Object.values(exerciseMap).forEach((info) => {
          exerciseMapById[info.id] = info.name;
        });

        const validDays = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ];
        const normalized: ImportData = {};

        for (const day of validDays) {
          const exercises = (data.weeklySchedule as Record<string, unknown>)[day];
          if (Array.isArray(exercises)) {
            normalized[day] = (
              exercises as Array<{
                id?: string;
                exerciseId?: string;
                name?: string;
                imageUrl?: string;
                sets: number;
                reps: number;
              }>
            )
              .filter((ex) => ex && (ex.id || ex.exerciseId || ex.name) && ex.sets)
              .map((ex) => {
                const importedId = ex.id;
                const importedExerciseId = ex.exerciseId;
                const importedName = ex.name;
                const importedImageUrl = ex.imageUrl;
                let matchedId: string | null = null;

                if (importedExerciseId && exerciseMap[importedExerciseId]) {
                  matchedId = importedExerciseId;
                } else if (importedName) {
                  const nameKey = importedName.toLowerCase().trim();
                  for (const [name, info] of Object.entries(exerciseMap)) {
                    if (
                      name === nameKey ||
                      name.replace(/\s+/g, '_') === nameKey
                    ) {
                      matchedId = info.id;
                      break;
                    }
                  }
                } else if (importedId) {
                  if (
                    importedId.startsWith('wger_') ||
                    importedId.match(/^[0-9a-f]{24}$/)
                  ) {
                    matchedId = importedId;
                  }
                }

                const finalId =
                  matchedId ||
                  importedId ||
                  importedExerciseId ||
                  importedName ||
                  'unknown';
                const finalImageUrl =
                  importedImageUrl ||
                  (finalId !== 'unknown' ? exerciseMap[finalId]?.imageUrl : undefined);

                return {
                  id: finalId,
                  name: importedName,
                  imageUrl: finalImageUrl,
                  sets: ex.sets,
                  reps: ex.reps,
                };
              });
          } else {
            normalized[day] = [];
          }
        }

        setImportData(normalized);
      } catch (err) {
        console.error('Import failed:', err);
        setError(t('importExport.invalidFormatMessage'));
      }

      e.target.value = '';
      setIsImporting(false);
    },
    [t]
  );

  const confirmImport = useCallback(async () => {
    if (!importData) return;

    try {
      await userAPI.updateWeeklySchedule({ weeklySchedule: importData });
      setImportData(null);
    } catch (err) {
      console.error('Import confirm failed:', err);
      setError(t('importExport.importFailed'));
    }
  }, [importData, t]);

  const clearImportData = useCallback(() => {
    setImportData(null);
    setError(null);
  }, []);

  return {
    importData,
    isImporting,
    error,
    handleExport,
    handleImportClick,
    handleImport,
    confirmImport,
    clearImportData,
    fileInputRef,
  };
}

export default useImportExport;
