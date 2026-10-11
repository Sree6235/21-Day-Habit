import { useState } from 'react';
import { usePersonalChallenge } from './hooks/usePersonalChallenge';
import { SetupScreen } from './components/SetupScreen';
import { ChallengeSwitcher } from './components/ChallengeSwitcher';
import { AllChallengesOverview } from './components/AllChallengesOverview';
import { CockpitHeader } from './components/CockpitHeader';
import { DailyCheckInCard } from './components/DailyCheckInCard';
import { CalendarView } from './components/CalendarView';
import { DayGrid } from './components/DayGrid';
import { CreateChallengeModal } from './components/CreateChallengeModal';
import { MilestoneModal } from './components/MilestoneModal';
import { CompletionSummaryModal } from './components/CompletionSummaryModal';
import { DayDetailModal } from './components/DayDetailModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { HistoryModal } from './components/HistoryModal';
import { CommitmentGatekeeper } from './components/CommitmentGatekeeper';
import { SettingsModal } from './components/SettingsModal';
import {
  isGateUnlocked,
  getTodayMantra,
  unlockGateForToday,
  bypassGate10Min,
  relockGate,
  getStoredMantras,
} from './utils/mantras';
import type { DayLog } from './types/challenge';
import { ShieldCheck, Sparkles, Calendar as CalendarIcon, LayoutGrid } from 'lucide-react';

export function App() {
  const {
    isLoaded,
    challenges,
    activeChallengeId,
    activeChallenge,
    history,
    pendingMilestone,
    setActiveChallengeId,
    createNewChallenge,
    checkInDay,
    uncheckDay,
    updateDayNote,
    deleteChallenge,
    archiveChallenge,
    resetActiveChallenge,
    dismissMilestone,
    triggerConfettiBlast,
    completedCount,
    cleanCount,
    completionPercentage,
    activeDayNumber,
    streak,
    targetFinishDate,
    isAllCompleted,
  } = usePersonalChallenge();

  // Gatekeeper Typing Challenge State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => isGateUnlocked());
  const [currentMantra, setCurrentMantra] = useState<string>(() => getTodayMantra());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Navigation view mode: 'single' (focused challenge) or 'overview' (multi-habit cockpit)
  const [viewMode, setViewMode] = useState<'single' | 'overview'>('single');

  // Visualization style in Single view: 'calendar' (authentic month view) or 'matrix' (3x7 grid)
  const [gridStyle, setGridStyle] = useState<'calendar' | 'matrix'>('calendar');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDayForDetail, setSelectedDayForDetail] = useState<DayLog | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [showCompletionSummaryManual, setShowCompletionSummaryManual] = useState(false);

  const handleUnlock = () => {
    unlockGateForToday();
    setIsUnlocked(true);
  };

  const handleBypass = () => {
    bypassGate10Min();
    setIsUnlocked(true);
  };

  const handleRelockScreen = () => {
    relockGate();
    setIsUnlocked(false);
    setCurrentMantra(getTodayMantra());
  };

  const handleRefreshMantra = () => {
    const list = getStoredMantras();
    const filtered = list.filter((m) => m !== currentMantra);
    const next =
      filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : currentMantra;
    setCurrentMantra(next);
  };

  // If still reading from localStorage on first render, show smooth dark loader
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center">
        <div className="flex items-center gap-3 text-emerald-400 font-bold text-sm tracking-wider uppercase animate-pulse">
          <Sparkles className="w-5 h-5" />
          <span>Initializing 21 Days Cockpit...</span>
        </div>
      </div>
    );
  }

  // If no challenges exist at all, show the initial setup screen
  if (challenges.length === 0 || !activeChallenge) {
    return (
      <SetupScreen
        onStart={(title, cue, startDate, category, iconName, habitType, urgeReplacementPlan) => {
          createNewChallenge(title, cue, startDate, category, iconName, habitType, urgeReplacementPlan);
          setViewMode('single');
        }}
      />
    );
  }

  const todayLog = activeChallenge.days.find((d) => d.dayNumber === activeDayNumber);

  const handleSelectChallenge = (id: string) => {
    setActiveChallengeId(id);
    setViewMode('single');
  };

  const handleConfirmReset = (archiveFirst: boolean) => {
    setIsResetModalOpen(false);
    resetActiveChallenge(archiveFirst);
  };

  const handleStartNextFromSummary = () => {
    setShowCompletionSummaryManual(false);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Commitment Gatekeeper Typing Lock Screen */}
      {!isUnlocked && (
        <CommitmentGatekeeper
          mantra={currentMantra}
          onUnlock={handleUnlock}
          onBypass={handleBypass}
          onRefreshMantra={handleRefreshMantra}
        />
      )}

      {/* Top Challenge Switcher & Multi-Habit Tab Bar */}
      <ChallengeSwitcher
        challenges={challenges}
        activeChallengeId={activeChallengeId}
        viewMode={viewMode}
        onSelectChallenge={handleSelectChallenge}
        onSelectOverview={() => setViewMode('overview')}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main View: Overview OR Single Focus Cockpit */}
      {viewMode === 'overview' ? (
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
          <AllChallengesOverview
            challenges={challenges}
            onFocusChallenge={handleSelectChallenge}
            onCheckInDay={checkInDay}
            onUndoDay={uncheckDay}
            onArchiveChallenge={archiveChallenge}
            onDeleteChallenge={deleteChallenge}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        </main>
      ) : (
        <>
          {/* Cockpit Sticky Header for Active Challenge */}
          <CockpitHeader
            challenge={activeChallenge}
            streak={streak}
            completedCount={completedCount}
            cleanCount={cleanCount}
            activeDayNumber={activeDayNumber}
            targetFinishDate={targetFinishDate}
            completionPercentage={completionPercentage}
            onOpenReset={() => setIsResetModalOpen(true)}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            historyCount={history.length}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
            {/* Top Active Day Cockpit Card */}
            <section aria-label="Daily Check-In">
              <DailyCheckInCard
                habitType={activeChallenge.habitType || 'build'}
                urgeReplacementPlan={activeChallenge.urgeReplacementPlan}
                activeDayNumber={activeDayNumber}
                todayLog={todayLog}
                onCheckIn={(_dayNum, reflection, effort, cravingLevel, isSlip) =>
                  checkInDay(
                    activeChallenge.id,
                    activeDayNumber,
                    reflection,
                    effort,
                    cravingLevel,
                    isSlip
                  )
                }
                onUndo={(_dayNum) => uncheckDay(activeChallenge.id, activeDayNumber)}
                onUpdateNote={(_dayNum, reflection, effort, cravingLevel) =>
                  updateDayNote(activeChallenge.id, activeDayNumber, reflection, effort, cravingLevel)
                }
                onViewSummary={() => setShowCompletionSummaryManual(true)}
                isAllCompleted={isAllCompleted}
              />
            </section>

            {/* Layout Mode Selector (Authentic Calendar View vs 3x7 Grid) */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>21-Day Journey Roadmap</span>
                  <span className="text-xs font-normal text-slate-400">
                    ({activeChallenge.habitType === 'quit' ? 'Harm Reduction Calendar' : 'Consistency Calendar'})
                  </span>
                </h2>
              </div>

              <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setGridStyle('calendar')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    gridStyle === 'calendar'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Calendar View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGridStyle('matrix')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    gridStyle === 'matrix'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>3×7 Matrix</span>
                </button>
              </div>
            </div>

            {/* 21-Day Calendar View or 3x7 Grid View */}
            <section aria-label="Challenge Tracking Grid">
              {gridStyle === 'calendar' ? (
                <CalendarView
                  challenge={activeChallenge}
                  activeDayNumber={activeDayNumber}
                  onSelectDay={(day) => setSelectedDayForDetail(day)}
                  onQuickCheckIn={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                <DayGrid
                  days={activeChallenge.days}
                  activeDayNumber={activeDayNumber}
                  onSelectDay={(day) => setSelectedDayForDetail(day)}
                  onQuickCheckIn={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </section>
          </main>
        </>
      )}

      {/* Motivational Philosophy Footer */}
      <footer className="pt-8 pb-12 border-t border-slate-800/80 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local-First & Multi-Habit Ready • 100% Stored in your Browser</span>
        </div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          "You do not rise to the level of your goals. You fall to the level of your systems."
          <span className="block mt-0.5 text-slate-600">— James Clear, Atomic Habits</span>
        </p>
      </footer>

      {/* Modal: Settings & Mantra Customizer */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onRelockScreen={handleRelockScreen}
      />

      {/* Modal: Create New Challenge */}
      <CreateChallengeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(title, cue, startDate, category, iconName, habitType, urgeReplacementPlan) => {
          createNewChallenge(title, cue, startDate, category, iconName, habitType, urgeReplacementPlan);
          setViewMode('single');
        }}
      />

      {/* Milestone Modal (Day 3, 7, 14) */}
      <MilestoneModal
        day={pendingMilestone ? pendingMilestone.day : null}
        challengeTitle={pendingMilestone?.challengeTitle}
        onClose={dismissMilestone}
      />

      {/* Completion Summary Modal (Day 21 / Final Recap) */}
      <CompletionSummaryModal
        challenge={activeChallenge}
        isOpen={pendingMilestone?.day === 21 || showCompletionSummaryManual}
        onClose={() => {
          dismissMilestone();
          setShowCompletionSummaryManual(false);
        }}
        onNewChallenge={handleStartNextFromSummary}
        onReBlastConfetti={() => triggerConfettiBlast(true)}
      />

      {/* Day Detail & Reflection Viewer/Editor Modal */}
      <DayDetailModal
        day={selectedDayForDetail}
        habitType={activeChallenge.habitType || 'build'}
        isOpen={selectedDayForDetail !== null}
        onClose={() => setSelectedDayForDetail(null)}
        onSaveNote={(dayNum, reflection, effort, cravingLevel) => {
          if (activeChallenge) {
            updateDayNote(activeChallenge.id, dayNum, reflection, effort, cravingLevel);
          }
        }}
        onUncheck={(dayNum) => {
          if (activeChallenge) {
            uncheckDay(activeChallenge.id, dayNum);
          }
        }}
      />

      {/* Reset/Delete Confirmation Dialog */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        challengeTitle={activeChallenge?.title}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      {/* History Archive Modal */}
      <HistoryModal
        history={history}
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </div>
  );
}

export default App;
