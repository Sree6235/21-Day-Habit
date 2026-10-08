import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Challenge, DayLog, HabitEffort } from '../types/challenge';
import { soundFx } from '../utils/sound';
import confetti from 'canvas-confetti';

const LIST_STORAGE_KEY = '21days_challenges_list';
const ACTIVE_ID_KEY = '21days_active_challenge_id';
const LEGACY_STORAGE_KEY = '21days_active_challenge';
const HISTORY_KEY = '21days_challenge_history';

// Helper to construct blank 21 days
export const createInitialDays = (): DayLog[] => {
  return Array.from({ length: 21 }, (_, index) => ({
    dayNumber: index + 1,
    completed: false,
  }));
};

export interface PendingMilestone {
  day: number;
  challengeTitle: string;
}

export interface ChallengeStats {
  completedCount: number;
  completionPercentage: number;
  activeDayNumber: number;
  streak: number;
  isAllCompleted: boolean;
  isTodayDone: boolean;
}

export function calculateChallengeStats(challenge: Challenge): ChallengeStats {
  const completedCount = challenge.days.filter((d) => d.completed).length;
  const completionPercentage = Math.round((completedCount / 21) * 100);
  const firstIncomplete = challenge.days.find((d) => !d.completed);
  const activeDayNumber = firstIncomplete ? firstIncomplete.dayNumber : 21;
  const isAllCompleted = completedCount === 21 || challenge.isCompleted;

  let streak = 0;
  for (const day of challenge.days) {
    if (day.completed) {
      streak++;
    } else {
      break;
    }
  }

  // Check if today's active day or current day is done
  const activeDayLog = challenge.days.find((d) => d.dayNumber === activeDayNumber);
  const isTodayDone = Boolean(activeDayLog?.completed);

  return {
    completedCount,
    completionPercentage,
    activeDayNumber,
    streak,
    isAllCompleted,
    isTodayDone,
  };
}

export function usePersonalChallenge() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [history, setHistory] = useState<Challenge[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [pendingMilestone, setPendingMilestone] = useState<PendingMilestone | null>(null);

  // Safe client-side load with backward compatibility migration
  useEffect(() => {
    try {
      let loadedChallenges: Challenge[] = [];
      const savedList = localStorage.getItem(LIST_STORAGE_KEY);

      if (savedList) {
        try {
          loadedChallenges = JSON.parse(savedList);
        } catch (e) {
          console.error('Failed to parse challenges list', e);
        }
      }

      // Backward compatibility: If no list found, check legacy single challenge
      if (loadedChallenges.length === 0) {
        const legacySaved = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacySaved) {
          try {
            const legacyChallenge: Challenge = JSON.parse(legacySaved);
            if (legacyChallenge && legacyChallenge.id) {
              loadedChallenges = [legacyChallenge];
              localStorage.setItem(LIST_STORAGE_KEY, JSON.stringify(loadedChallenges));
            }
          } catch (e) {
            console.error('Failed to parse legacy challenge', e);
          }
        }
      }

      setChallenges(loadedChallenges);

      // Determine active challenge ID
      const savedActiveId = localStorage.getItem(ACTIVE_ID_KEY);
      if (savedActiveId && loadedChallenges.some((c) => c.id === savedActiveId)) {
        setActiveChallengeId(savedActiveId);
      } else if (loadedChallenges.length > 0) {
        setActiveChallengeId(loadedChallenges[0].id);
        localStorage.setItem(ACTIVE_ID_KEY, loadedChallenges[0].id);
      } else {
        setActiveChallengeId(null);
      }

      // Load history
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (err) {
      console.error('Failed to initialize local-first challenge data', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save challenges array to localStorage
  const saveChallenges = useCallback((updated: Challenge[]) => {
    setChallenges(updated);
    try {
      localStorage.setItem(LIST_STORAGE_KEY, JSON.stringify(updated));
      // Keep legacy key synced with active or first challenge for backwards compat
      if (updated.length > 0) {
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updated[0]));
      } else {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to save challenges to localStorage', err);
    }
  }, []);

  // Switch active challenge ID
  const switchActiveChallenge = useCallback((id: string | null) => {
    setActiveChallengeId(id);
    try {
      if (id) {
        localStorage.setItem(ACTIVE_ID_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_ID_KEY);
      }
    } catch (err) {
      console.error('Failed to set active challenge id', err);
    }
  }, []);

  // Save history
  const saveHistory = useCallback((updatedHistory: Challenge[]) => {
    setHistory(updatedHistory);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (err) {
      console.error('Failed to save history to localStorage', err);
    }
  }, []);

  // Trigger celebration effects
  const triggerConfettiBlast = useCallback((isGrandFinale: boolean = false) => {
    if (isGrandFinale) {
      const end = Date.now() + 3.5 * 1000;
      const colors = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#38bdf8'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } else {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
      });
    }
  }, []);

  // Create new challenge
  const createNewChallenge = useCallback(
    (title: string, cue: string, startDate?: string, category?: string, iconName?: string) => {
      const today = new Date().toISOString().split('T')[0];
      const newId = `chal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newChallenge: Challenge = {
        id: newId,
        title: title.trim(),
        cue: cue.trim(),
        category: category?.trim() || 'General',
        iconName: iconName || 'Target',
        startDate: startDate || today,
        createdAt: new Date().toISOString(),
        days: createInitialDays(),
        isCompleted: false,
        celebratedMilestones: [],
      };

      const updated = [...challenges, newChallenge];
      saveChallenges(updated);
      switchActiveChallenge(newId);
      soundFx.playCheckIn();
      return newChallenge;
    },
    [challenges, saveChallenges, switchActiveChallenge]
  );

  // Check in a day on any specific challenge
  const checkInDay = useCallback(
    (challengeId: string, dayNumber: number, reflection?: string, effort?: HabitEffort) => {
      const targetChallenge = challenges.find((c) => c.id === challengeId);
      if (!targetChallenge) return;

      const updatedDays = targetChallenge.days.map((day) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            completed: true,
            completedAt: new Date().toISOString(),
            reflection: reflection !== undefined ? reflection.trim() : day.reflection,
            effort: effort || day.effort || 'normal',
          };
        }
        return day;
      });

      const completedCount = updatedDays.filter((d) => d.completed).length;
      const isDay21Completed = updatedDays.find((d) => d.dayNumber === 21)?.completed;
      const isAllCompleted = completedCount === 21 || isDay21Completed;

      // Check milestones [3, 7, 14, 21]
      const newMilestones = [...targetChallenge.celebratedMilestones];
      const milestonesToCheck = [3, 7, 14, 21];

      let milestoneToTrigger: number | null = null;
      if (milestonesToCheck.includes(dayNumber) && !newMilestones.includes(dayNumber)) {
        newMilestones.push(dayNumber);
        milestoneToTrigger = dayNumber;
      }

      const updatedChallenge: Challenge = {
        ...targetChallenge,
        days: updatedDays,
        isCompleted: Boolean(isAllCompleted),
        celebratedMilestones: newMilestones,
      };

      const nextChallenges = challenges.map((c) => (c.id === challengeId ? updatedChallenge : c));
      saveChallenges(nextChallenges);

      if (milestoneToTrigger === 21 || isAllCompleted) {
        soundFx.playMilestone();
        triggerConfettiBlast(true);
        setPendingMilestone({ day: 21, challengeTitle: targetChallenge.title });
      } else if (milestoneToTrigger) {
        soundFx.playMilestone();
        triggerConfettiBlast(false);
        setPendingMilestone({ day: milestoneToTrigger, challengeTitle: targetChallenge.title });
      } else {
        soundFx.playCheckIn();
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.7 },
          colors: ['#10b981', '#34d399', '#6ee7b7'],
        });
      }
    },
    [challenges, saveChallenges, triggerConfettiBlast]
  );

  // Undo / Uncheck day
  const uncheckDay = useCallback(
    (challengeId: string, dayNumber: number) => {
      const targetChallenge = challenges.find((c) => c.id === challengeId);
      if (!targetChallenge) return;

      const updatedDays = targetChallenge.days.map((day) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            completed: false,
            completedAt: undefined,
          };
        }
        return day;
      });

      const updatedChallenge: Challenge = {
        ...targetChallenge,
        days: updatedDays,
        isCompleted: false,
      };

      const nextChallenges = challenges.map((c) => (c.id === challengeId ? updatedChallenge : c));
      saveChallenges(nextChallenges);
      soundFx.playSoftTap();
    },
    [challenges, saveChallenges]
  );

  // Update day reflection/note
  const updateDayNote = useCallback(
    (challengeId: string, dayNumber: number, reflection: string, effort?: HabitEffort) => {
      const targetChallenge = challenges.find((c) => c.id === challengeId);
      if (!targetChallenge) return;

      const updatedDays = targetChallenge.days.map((day) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            reflection: reflection.trim(),
            ...(effort ? { effort } : {}),
          };
        }
        return day;
      });

      const updatedChallenge: Challenge = {
        ...targetChallenge,
        days: updatedDays,
      };

      const nextChallenges = challenges.map((c) => (c.id === challengeId ? updatedChallenge : c));
      saveChallenges(nextChallenges);
    },
    [challenges, saveChallenges]
  );

  // Delete an individual challenge
  const deleteChallenge = useCallback(
    (challengeId: string) => {
      const nextChallenges = challenges.filter((c) => c.id !== challengeId);
      saveChallenges(nextChallenges);

      if (activeChallengeId === challengeId) {
        const nextActive = nextChallenges[0]?.id || null;
        switchActiveChallenge(nextActive);
      }
      soundFx.playSoftTap();
    },
    [activeChallengeId, challenges, saveChallenges, switchActiveChallenge]
  );

  // Archive an individual challenge
  const archiveChallenge = useCallback(
    (challengeId: string) => {
      const target = challenges.find((c) => c.id === challengeId);
      if (!target) return;

      const updatedHistory = [target, ...history].slice(0, 30);
      saveHistory(updatedHistory);

      const nextChallenges = challenges.filter((c) => c.id !== challengeId);
      saveChallenges(nextChallenges);

      if (activeChallengeId === challengeId) {
        const nextActive = nextChallenges[0]?.id || null;
        switchActiveChallenge(nextActive);
      }
      soundFx.playSoftTap();
    },
    [activeChallengeId, challenges, history, saveChallenges, saveHistory, switchActiveChallenge]
  );

  // Reset or re-initialize current active challenge
  const resetActiveChallenge = useCallback(
    (archiveFirst: boolean = false) => {
      if (!activeChallengeId) return;
      if (archiveFirst) {
        archiveChallenge(activeChallengeId);
      } else {
        deleteChallenge(activeChallengeId);
      }
    },
    [activeChallengeId, archiveChallenge, deleteChallenge]
  );

  const dismissMilestone = useCallback(() => {
    setPendingMilestone(null);
  }, []);

  // Active challenge and computed statistics
  const activeChallenge = useMemo(() => {
    if (!activeChallengeId) return challenges[0] || null;
    return challenges.find((c) => c.id === activeChallengeId) || challenges[0] || null;
  }, [challenges, activeChallengeId]);

  const activeStats = useMemo(() => {
    if (!activeChallenge) {
      return {
        completedCount: 0,
        completionPercentage: 0,
        activeDayNumber: 1,
        streak: 0,
        isAllCompleted: false,
        isTodayDone: false,
      };
    }
    return calculateChallengeStats(activeChallenge);
  }, [activeChallenge]);

  return {
    isLoaded,
    challenges,
    activeChallengeId,
    activeChallenge,
    history,
    pendingMilestone,
    setActiveChallengeId: switchActiveChallenge,
    createNewChallenge,
    checkInDay,
    uncheckDay,
    updateDayNote,
    deleteChallenge,
    archiveChallenge,
    resetActiveChallenge,
    dismissMilestone,
    triggerConfettiBlast,
    // Active challenge shortcuts
    completedCount: activeStats.completedCount,
    completionPercentage: activeStats.completionPercentage,
    activeDayNumber: activeStats.activeDayNumber,
    streak: activeStats.streak,
    isAllCompleted: activeStats.isAllCompleted,
    isTodayDone: activeStats.isTodayDone,
  };
}
