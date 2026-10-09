const MANTRAS_STORAGE_KEY = '21days_mantras';
const MANTRA_MODE_KEY = '21days_mantra_mode';
const MANTRA_INDEX_KEY = '21days_mantra_index';
const UNLOCK_KEY = 'habit_unlocked';
const BYPASS_KEY = 'habit_bypass_until';

export const DEFAULT_MANTRAS = [
  'Small daily disciplines lead to massive long-term transformations.',
  'I choose discomfort today so tomorrow becomes effortless.',
  'Consistency beats motivation every single day.',
];

export function getStoredMantras(): string[] {
  try {
    const raw = localStorage.getItem(MANTRAS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load mantras from localStorage', e);
  }
  return DEFAULT_MANTRAS;
}

export function saveStoredMantras(mantras: string[]): void {
  try {
    localStorage.setItem(MANTRAS_STORAGE_KEY, JSON.stringify(mantras));
  } catch (e) {
    console.error('Failed to save mantras to localStorage', e);
  }
}

export function getMantraMode(): 'random' | 'sequential' {
  try {
    const mode = localStorage.getItem(MANTRA_MODE_KEY);
    if (mode === 'sequential' || mode === 'random') {
      return mode;
    }
  } catch (e) {
    console.error(e);
  }
  return 'random';
}

export function saveMantraMode(mode: 'random' | 'sequential'): void {
  try {
    localStorage.setItem(MANTRA_MODE_KEY, mode);
  } catch (e) {
    console.error(e);
  }
}

export function getTodayMantra(): string {
  const mantras = getStoredMantras();
  if (mantras.length === 0) {
    return DEFAULT_MANTRAS[0];
  }

  const mode = getMantraMode();

  if (mode === 'random') {
    // Deterministic random for today, or freshly picked
    const todaySeed = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < todaySeed.length; i++) {
      hash = (hash << 5) - hash + todaySeed.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % mantras.length;
    return mantras[index];
  } else {
    // Sequential mode
    try {
      let idx = parseInt(localStorage.getItem(MANTRA_INDEX_KEY) || '0', 10);
      if (isNaN(idx) || idx >= mantras.length) idx = 0;
      return mantras[idx];
    } catch {
      return mantras[0];
    }
  }
}

export function advanceSequentialMantra(): void {
  const mantras = getStoredMantras();
  if (mantras.length <= 1) return;
  try {
    const current = parseInt(localStorage.getItem(MANTRA_INDEX_KEY) || '0', 10);
    const next = (current + 1) % mantras.length;
    localStorage.setItem(MANTRA_INDEX_KEY, next.toString());
  } catch (e) {
    console.error(e);
  }
}

export function isGateUnlocked(): boolean {
  if (typeof window === 'undefined') return true;

  try {
    // 1. Check if unlocked for today in sessionStorage
    const unlockedDate = sessionStorage.getItem(UNLOCK_KEY);
    const today = new Date().toDateString();
    if (unlockedDate === today) {
      return true;
    }

    // 2. Check if bypassed for 10 minutes
    const bypassUntil = sessionStorage.getItem(BYPASS_KEY);
    if (bypassUntil) {
      const until = parseInt(bypassUntil, 10);
      if (!isNaN(until) && Date.now() < until) {
        return true;
      } else {
        sessionStorage.removeItem(BYPASS_KEY);
      }
    }
  } catch (e) {
    console.error(e);
    return true; // Fallback gracefully if storage blocked
  }

  return false;
}

export function unlockGateForToday(): void {
  try {
    const today = new Date().toDateString();
    sessionStorage.setItem(UNLOCK_KEY, today);
    advanceSequentialMantra();
  } catch (e) {
    console.error(e);
  }
}

export function bypassGate10Min(): void {
  try {
    const expiresAt = Date.now() + 10 * 60 * 1000;
    sessionStorage.setItem(BYPASS_KEY, expiresAt.toString());
  } catch (e) {
    console.error(e);
  }
}

export function relockGate(): void {
  try {
    sessionStorage.removeItem(UNLOCK_KEY);
    sessionStorage.removeItem(BYPASS_KEY);
  } catch (e) {
    console.error(e);
  }
}
