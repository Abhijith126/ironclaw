import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { userAPI, getExercises } from '../services/api';
import { downloadJSON, readJSONFile } from '../utils';
import type { Exercise } from '../types';

interface ImportSchedule {
  [day: string]: Exercise[];
}

interface UseImportExportReturn {
  importData: ImportSchedule | null;
  isImporting: boolean;
  error: string | null;
  handleExport: () => Promise<void>;
  handleImportClick: () => void;
  handleImport: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  confirmImport: () => Promise<void>;
  clearImportData: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const VALID_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function useImportExport(): UseImportExportReturn {
  const { t } = useTranslation();
  const [importData, setImportData] = useState<ImportSchedule | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(async () => {
    try {
      const res = await userAPI.getWeeklySchedule();
      const schedule = res.data.weeklySchedule || {};

      const exportData = {
        weeklySchedule: schedule,
        exportedAt: new Date().toISOString(),
        version: '3',
      };

      const filename = `workout-schedule-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(exportData, filename);
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

        // Build lookup maps from exercise catalog
        const allExercises = await getExercises();
        const byId = new Map<string, { id: string; name: string; imageUrl?: string }>();
        const byName = new Map<string, { id: string; name: string; imageUrl?: string }>();
        allExercises.forEach((ex) => {
          byId.set(ex.id, { id: ex.id, name: ex.name, imageUrl: ex.imageUrl });
          byName.set(ex.name.toLowerCase(), { id: ex.id, name: ex.name, imageUrl: ex.imageUrl });
        });

        const rawSchedule = data.weeklySchedule as Record<string, unknown>;
        const normalized: ImportSchedule = {};

        for (const day of VALID_DAYS) {
          const exercises = rawSchedule[day];
          if (!Array.isArray(exercises)) {
            normalized[day] = [];
            continue;
          }

          normalized[day] = exercises
            .filter((ex: Record<string, unknown>) => ex && (ex.id || ex.name) && ex.sets)
            .map((ex: Record<string, unknown>) => {
              // Try matching by ID first, then by name
              const match =
                (ex.id && byId.get(ex.id as string)) ||
                (ex.name && byName.get((ex.name as string).toLowerCase()));

              return {
                id: match?.id || (ex.id as string) || 'unknown',
                name: match?.name || (ex.name as string),
                imageUrl: match?.imageUrl || (ex.imageUrl as string),
                sets: ex.sets as number,
                reps: ex.reps as number | string,
                pr: (ex.pr as { weight: number; reps: number }) || null,
              };
            });
        }

        setImportData(normalized);
      } catch (err) {
        console.error('Import failed:', err);
        setError(t('importExport.invalidFormatMessage'));
      } finally {
        e.target.value = '';
        setIsImporting(false);
      }
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
