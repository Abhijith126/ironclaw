import { useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import type { LucideIcon } from 'lucide-react';

type TabId = 'dashboard' | 'workout' | 'exercises' | 'weight' | 'profile';

interface Tab {
  id: TabId;
  label: string;
  icon: LucideIcon;
  path: string;
}

interface UseAppNavigationReturn {
  activeTab: TabId;
  tabs: Tab[];
  navigateTo: (tab: TabId) => void;
  getTabPath: (tab: TabId) => string;
}

export function useAppNavigation(
  translations: {
    home: string;
    workout: string;
    exercises: string;
    progress: string;
    profile: string;
  },
  iconComponents: {
    LayoutDashboard: LucideIcon;
    Dumbbell: LucideIcon;
    Cpu: LucideIcon;
    Scale: LucideIcon;
    UserCircle: LucideIcon;
  }
): UseAppNavigationReturn {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo((): TabId => {
    const path = location.pathname;
    if (path.includes('/checklist') || path.includes('/workout')) return 'workout';
    if (path.includes('/exercises')) return 'exercises';
    if (path.includes('/weight')) return 'weight';
    if (path.includes('/settings') || path.includes('/about')) return 'profile';
    return 'dashboard';
  }, [location.pathname]);

  const tabs = useMemo<Tab[]>(
    () => [
      { id: 'dashboard', label: translations.home, icon: iconComponents.LayoutDashboard, path: ROUTES.DASHBOARD },
      { id: 'workout', label: translations.workout, icon: iconComponents.Dumbbell, path: '/checklist' },
      { id: 'exercises', label: translations.exercises, icon: iconComponents.Cpu, path: '/exercises' },
      { id: 'weight', label: translations.progress, icon: iconComponents.Scale, path: ROUTES.WEIGHT },
      { id: 'profile', label: translations.profile, icon: iconComponents.UserCircle, path: ROUTES.SETTINGS },
    ],
    [translations, iconComponents]
  );

  const getTabPath = useCallback((tab: TabId): string => {
    const routes: Record<TabId, string> = {
      dashboard: ROUTES.DASHBOARD,
      workout: '/checklist',
      exercises: '/exercises',
      weight: ROUTES.WEIGHT,
      profile: ROUTES.SETTINGS,
    };
    return routes[tab];
  }, []);

  const navigateTo = useCallback(
    (tab: TabId) => {
      navigate(getTabPath(tab));
    },
    [navigate, getTabPath]
  );

  return {
    activeTab,
    tabs,
    navigateTo,
    getTabPath,
  };
}

export default useAppNavigation;
