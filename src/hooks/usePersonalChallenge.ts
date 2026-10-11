import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Challenge, DayLog, HabitEffort, HabitType, CravingLevel } from '../types/challenge';
import { soundFx } from '../utils/sound';
import {
  parseLocalDate,
  formatLocalDate,
  addDays,
  getTodayString,
  calculateTargetFinishDate,
} from '../utils/calendarDates';
import confetti from 'canvas-confetti';

const LIST_STORAGE_KEY = '21days_challenges_list';
const ACTIVE_ID_KEY = '21days_active_challenge_id';
const LEGACY_STORAGE_KEY = '21days_active_challenge';
const HISTORY_KEY = '21days_challenge_history';

// Helper to construct blank 21 days with calendar dates
export const createInitialDays = (startDateStr?: string): DayLog[] => {
  const effectiveStartStr = startDateStr && startDateStr.trim() ? startDateStr.trim() : getTodayString();
  const start = parseLocalDate(effectiveStartStr);
  return Array.from({ length: 21 }, (_, index) => {
    const dateObj = addDays(start, index);
    return {
      dayNumber: index + 1,
      dateString: formatLocalDate(dateObj),
      completed: false,
      isSlip: false,
    };
  });
};

export interface PendingMilestone {
  day: number;
  challengeTitle: string;
}

export interface ChallengeStats {
  completedCount: number;
  cleanCount: number;
  slippedCount: number;
  completionPercentage: number;
  activeDayNumber: number;
  calendarDayNumber: number;
  streak: number;
  isAllCompleted: boolean;
  isTodayDone: boolean;
  isTodaySlipped: boolean;
  targetFinishDate: string;
  habitType: HabitType;
}

export function calculateChallengeStats(challenge: Challenge): ChallengeStats {
  const habitType: HabitType = challenge.habitType || 'build';
  const targetFinishDate =
    challenge.targetFinishDate || calculateTargetFinishDate(challenge.startDate);

  // Completed count for build habit, Clean count for quit habit
  const completedCount = challenge.days.filter((d) => d.completed).length;
  const cleanCount = challenge.days.filter((d) => d.completed && !d.isSlip).length;
  const slippedCount = challenge.days.filter((d) => d.isSlip).length;

  const progressCount = habitType === 'quit' ? cleanCount : completedCount;
  const completionPercentage = Math.round((progressCount / 21) * 100);

  // Real calendar day calculation relative to startDate
  const todayStr = getTodayString();
  const start = parseLocalDate(challenge.startDate);
  const today = parseLocalDate(todayStr);
  const diffDays = Math.round((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const rawCalendarDay = diffDays + 1;
  const calendarDayNumber = Math.max(1, Math.min(21, rawCalendarDay));

  // Active day: the day for today, or first incomplete
  const activeDayNumber = calendarDayNumber;

  const isAllCompleted = progressCount === 21 || challenge.isCompleted;

  // Streak calculation
  let streak = 0;
  if (habitType === 'quit') {
    // Current unbroken clean streak: iterate backwards from calendarDayNumber
    for (let dayNum = calendarDayNumber; dayNum >= 1; dayNum--) {
      const day = challenge.days.find((d) => d.dayNumber === dayNum);
      if (day?.completed && !day.isSlip) {
        streak++;
      } else if (day?.isSlip) {
        break; // Slip breaks the streak
      } else if (dayNum < calendarDayNumber && !day?.completed) {
        break;
      }
    }
  } else {
    // Build habit streak: contiguous completed days up to current
    for (let dayNum = 1; dayNum <= calendarDayNumber; dayNum++) {
      const day = challenge.days.find((d) => d.dayNumber === dayNum);
      if (day?.completed) {
        streak++;
      } else if (dayNum < calendarDayNumber) {
        streak = 0; // Missed previous day breaks streak
      }
    }
  }

  // Check today's status
  const todayLog = challenge.days.find((d) => d.dayNumber === calendarDayNumber);
  const isTodayDone = Boolean(todayLog?.completed && !todayLog?.isSlip);
  const isTodaySlipped = Boolean(todayLog?.isSlip);

  return {
    completedCount,
    cleanCount,
    slippedCount,
    completionPercentage,
    activeDayNumber,
    calendarDayNumber,
    streak,
    isAllCompleted,
    isTodayDone,
    isTodaySlipped,
    targetFinishDate,
    habitType,
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

      const todayStr = getTodayString();

      // Ensure all challenges have habitType, targetFinishDate, and dateStrings
      const normalizedChallenges = loadedChallenges.map((c) => {
        const habitType = c.habitType || 'build';
        const hasAnyCheckIns = c.days.some((d) => d.completed || d.isSlip);

        // If a challenge has 0 check-ins and its startDate is missing or in the past (e.g. from mock or timezone bug), anchor it to today as Day 1
        let startDate = c.startDate;
        if (!hasAnyCheckIns && (!startDate || startDate < todayStr)) {
          startDate = todayStr;
        }

        const targetFinishDate = calculateTargetFinishDate(startDate);
        const start = parseLocalDate(startDate);

        const days = c.days.map((d, idx) => {
          const dateObj = addDays(start, idx);
          return {
            ...d,
            dateString: formatLocalDate(dateObj),
            isSlip: Boolean(d.isSlip),
          };
        });

        return {
          ...c,
          startDate,
          targetFinishDate,
          habitType,
          days,
        };
      });

      setChallenges(normalizedChallenges);

      // Determine active challenge ID
      const savedActiveId = localStorage.getItem(ACTIVE_ID_KEY);
      if (savedActiveId && normalizedChallenges.some((c) => c.id === savedActiveId)) {
        setActiveChallengeId(savedActiveId);
      } else if (normalizedChallenges.length > 0) {
        setActiveChallengeId(normalizedChallenges[0].id);
        localStorage.setItem(ACTIVE_ID_KEY, normalizedChallenges[0].id);
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

  // Create new challenge with habitType and urgeReplacementPlan
  const createNewChallenge = useCallback(
    (
      title: string,
      cue: string,
      startDate?: string,
      category?: string,
      iconName?: string,
      habitType: HabitType = 'build',
      urgeReplacementPlan?: string
    ) => {
      const today = getTodayString();
      const start = startDate || today;
      const targetFinish = calculateTargetFinishDate(start);
      const newId = `chal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      const newChallenge: Challenge = {
        id: newId,
        title: title.trim(),
        cue: cue.trim(),
        habitType,
        urgeReplacementPlan: urgeReplacementPlan?.trim() || undefined,
        category: category?.trim() || (habitType === 'quit' ? 'Harm Reduction' : 'General'),
        iconName: iconName || (habitType === 'quit' ? 'Shield' : 'Target'),
        startDate: start,
        targetFinishDate: targetFinish,
        createdAt: new Date().toISOString(),
        days: createInitialDays(start),
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

  // Check in a day on any specific challenge (handles both normal completion and slip logging)
  const checkInDay = useCallback(
    (
      challengeId: string,
      dayNumber: number,
      reflection?: string,
      effort?: HabitEffort,
      cravingLevel?: CravingLevel,
      isSlip: boolean = false
    ) => {
      const targetChallenge = challenges.find((c) => c.id === challengeId);
      if (!targetChallenge) return;

      const updatedDays = targetChallenge.days.map((day) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            completed: !isSlip,
            isSlip: Boolean(isSlip),
            completedAt: new Date().toISOString(),
            reflection: reflection !== undefined ? reflection.trim() : day.reflection,
            effort: targetChallenge.habitType === 'build' ? effort || day.effort || 'normal' : undefined,
            cravingLevel: targetChallenge.habitType === 'quit' ? cravingLevel || day.cravingLevel || 'low' : undefined,
          };
        }
        return day;
      });

      const successfulCount = updatedDays.filter((d) => d.completed && !d.isSlip).length;
      const isDay21Done = updatedDays.find((d) => d.dayNumber === 21)?.completed;
      const isAllCompleted = successfulCount === 21 || (isDay21Done && !isSlip);

      // Check milestones [3, 7, 14, 21] only for successful clean/complete days
      const newMilestones = [...targetChallenge.celebratedMilestones];
      const milestonesToCheck = [3, 7, 14, 21];

      let milestoneToTrigger: number | null = null;
      if (!isSlip && milestonesToCheck.includes(dayNumber) && !newMilestones.includes(dayNumber)) {
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

      if (isSlip) {
        soundFx.playSoftTap();
        return;
      }

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
            isSlip: false,
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
    (
      challengeId: string,
      dayNumber: number,
      reflection: string,
      effort?: HabitEffort,
      cravingLevel?: CravingLevel
    ) => {
      const targetChallenge = challenges.find((c) => c.id === challengeId);
      if (!targetChallenge) return;

      const updatedDays = targetChallenge.days.map((day) => {
        if (day.dayNumber === dayNumber) {
          return {
            ...day,
            reflection: reflection.trim(),
            ...(effort ? { effort } : {}),
            ...(cravingLevel ? { cravingLevel } : {}),
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
        cleanCount: 0,
        slippedCount: 0,
        completionPercentage: 0,
        activeDayNumber: 1,
        calendarDayNumber: 1,
        streak: 0,
        isAllCompleted: false,
        isTodayDone: false,
        isTodaySlipped: false,
        targetFinishDate: '',
        habitType: 'build' as HabitType,
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
    cleanCount: activeStats.cleanCount,
    slippedCount: activeStats.slippedCount,
    completionPercentage: activeStats.completionPercentage,
    activeDayNumber: activeStats.activeDayNumber,
    calendarDayNumber: activeStats.calendarDayNumber,
    streak: activeStats.streak,
    isAllCompleted: activeStats.isAllCompleted,
    isTodayDone: activeStats.isTodayDone,
    isTodaySlipped: activeStats.isTodaySlipped,
    targetFinishDate: activeStats.targetFinishDate,
    habitType: activeStats.habitType,
  };
}
