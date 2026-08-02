import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { projects } from '../data/projects';
import { Project } from '../types/project';

const FAVORITES_KEY = '@homevalue/favorites';
const PROGRESS_KEY = '@homevalue/progress';
const COMPLETED_KEY = '@homevalue/completed';

// Maps projectId -> array of completed step indices
type ProgressMap = Record<string, number[]>;

interface AppStateContextValue {
  favoriteIds: string[];
  toggleFavorite: (projectId: string) => void;
  isFavorite: (projectId: string) => boolean;
  progress: ProgressMap;
  toggleStepComplete: (projectId: string, stepIndex: number) => void;
  isStepComplete: (projectId: string, stepIndex: number) => boolean;
  getProjectProgress: (projectId: string, totalSteps: number) => number;
  completedIds: string[];
  markProjectComplete: (projectId: string) => void;
  totalValueAdded: { low: number; high: number };
  isLoaded: boolean;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [favRaw, progRaw, compRaw] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(PROGRESS_KEY),
          AsyncStorage.getItem(COMPLETED_KEY),
        ]);
        if (favRaw) setFavoriteIds(JSON.parse(favRaw));
        if (progRaw) setProgress(JSON.parse(progRaw));
        if (compRaw) setCompletedIds(JSON.parse(compRaw));
      } catch (e) {
        console.warn('Failed to load persisted app state', e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback((key: string, value: unknown) => {
    AsyncStorage.setItem(key, JSON.stringify(value)).catch((e) =>
      console.warn('Failed to persist app state', e)
    );
  }, []);

  const toggleFavorite = useCallback(
    (projectId: string) => {
      setFavoriteIds((prev) => {
        const next = prev.includes(projectId)
          ? prev.filter((id) => id !== projectId)
          : [...prev, projectId];
        persist(FAVORITES_KEY, next);
        return next;
      });
    },
    [persist]
  );

  const isFavorite = useCallback((projectId: string) => favoriteIds.includes(projectId), [favoriteIds]);

  const toggleStepComplete = useCallback(
    (projectId: string, stepIndex: number) => {
      setProgress((prev) => {
        const current = prev[projectId] ?? [];
        const next = current.includes(stepIndex)
          ? current.filter((i) => i !== stepIndex)
          : [...current, stepIndex];
        const updated = { ...prev, [projectId]: next };
        persist(PROGRESS_KEY, updated);
        return updated;
      });
    },
    [persist]
  );

  const isStepComplete = useCallback(
    (projectId: string, stepIndex: number) => (progress[projectId] ?? []).includes(stepIndex),
    [progress]
  );

  const getProjectProgress = useCallback(
    (projectId: string, totalSteps: number) => {
      if (totalSteps === 0) return 0;
      const done = (progress[projectId] ?? []).length;
      return Math.min(1, done / totalSteps);
    },
    [progress]
  );

  const markProjectComplete = useCallback(
    (projectId: string) => {
      setCompletedIds((prev) => {
        if (prev.includes(projectId)) {
          const next = prev.filter((id) => id !== projectId);
          persist(COMPLETED_KEY, next);
          return next;
        }
        const next = [...prev, projectId];
        persist(COMPLETED_KEY, next);
        return next;
      });
    },
    [persist]
  );

  const totalValueAdded = useMemo(() => {
    return completedIds.reduce(
      (acc, id) => {
        const project = projects.find((p: Project) => p.id === id);
        if (!project) return acc;
        return {
          low: acc.low + project.valueAddLow,
          high: acc.high + project.valueAddHigh,
        };
      },
      { low: 0, high: 0 }
    );
  }, [completedIds]);

  const value: AppStateContextValue = {
    favoriteIds,
    toggleFavorite,
    isFavorite,
    progress,
    toggleStepComplete,
    isStepComplete,
    getProjectProgress,
    completedIds,
    markProjectComplete,
    totalValueAdded,
    isLoaded,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within an AppStateProvider');
  return ctx;
}
