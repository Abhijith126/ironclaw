export const formatDate = (date: Date | string, options: Intl.DateTimeFormatOptions = {}) => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatDateShort = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const getTodayName = () => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
};

export const getTomorrowName = () => {
  return new Date(Date.now() + 86400000).toLocaleDateString('en-US', {
    weekday: 'long',
  });
};

export const getDateKey = (date: Date | string = new Date()) => {
  return new Date(date).toDateString();
};

export const formatWeight = (weight: number | string, unit: string = 'kg') => {
  return `${parseFloat(String(weight)).toFixed(1)} ${unit}`;
};

export const getWeightTrend = (sortedLogs: { weight: number }[]) => {
  if (sortedLogs.length < 2) return null;
  const latest = sortedLogs[sortedLogs.length - 1].weight;
  const previous = sortedLogs[sortedLogs.length - 2].weight;
  return latest - previous;
};

export const calculateWeightChange = (latestWeight: number | null, startWeight: number | null) => {
  if (!latestWeight || !startWeight) return null;
  return (latestWeight - startWeight).toFixed(1);
};

export const getInitials = (name: string) => {
  return name
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const isToday = (date: Date | string) => {
  const today = new Date();
  const d = new Date(date);
  return d.toDateString() === today.toDateString();
};

export const groupBy = <T>(array: T[], key: string | ((item: T) => string)) => {
  return array.reduce((result: Record<string, T[]>, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key as keyof T]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

export const sortByDate = <T extends Record<string, unknown>>(
  array: T[],
  key: string = 'date',
  ascending: boolean = true
) => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[key] as string);
    const dateB = new Date(b[key] as string);
    return ascending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });
};

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const downloadJSON = (data: unknown, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const readJSONFile = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target?.result as string));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};
