import { useState } from 'react';
import { usePersonalChallenge } from './hooks/usePersonalChallenge';
import { SetupScreen } from './components/SetupScreen';
import { ChallengeSwitcher } from './components/ChallengeSwitcher';
import { AllChallengesOverview } from './components/AllChallengesOverview';
import { CockpitHeader } from './components/CockpitHeader';
import { DailyCheckInCard } from './components/DailyCheckInCard';
import { DayGrid } from './components/DayGrid';
import { CreateChallengeModal } from './components/CreateChallengeModal';
import { MilestoneModal } from './components/MilestoneModal';
import { CompletionSummaryModal } from './components/CompletionSummaryModal';
import { DayDetailModal } from './components/DayDetailModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { HistoryModal } from './components/HistoryModal';
import type { DayLog } from './types/challenge';
import { ShieldCheck, Sparkles } from 'lucide-react';

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
    completionPercentage,
    activeDayNumber,
    streak,
    isAllCompleted,
  } = usePersonalChallenge();

  // Navigation view mode: 'single' (3x7 matrix focus) or 'overview' (multi-habit cockpit)
  const [viewMode, setViewMode] = useState<'single' | 'overview'>('single');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDayForDetail, setSelectedDayForDetail] = useState<DayLog | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [showCompletionSummaryManual, setShowCompletionSummaryManual] = useState(false);

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
        onStart={(title, cue, startDate, category, iconName) => {
          createNewChallenge(title, cue, startDate, category, iconName);
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
      {/* Top Challenge Switcher & Multi-Habit Tab Bar */}
      <ChallengeSwitcher
        challenges={challenges}
        activeChallengeId={activeChallengeId}
        viewMode={viewMode}
        onSelectChallenge={handleSelectChallenge}
        onSelectOverview={() => setViewMode('overview')}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
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
            completionPercentage={completionPercentage}
            onOpenReset={() => setIsResetModalOpen(true)}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            historyCount={history.length}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
            {/* Top Active Day Cockpit Card */}
            <section aria-label="Daily Check-In">
              <DailyCheckInCard
                activeDayNumber={activeDayNumber}
                todayLog={todayLog}
                onCheckIn={(_dayNum, reflection, effort) =>
                  checkInDay(activeChallenge.id, activeDayNumber, reflection, effort)
                }
                onUndo={(_dayNum) => uncheckDay(activeChallenge.id, activeDayNumber)}
                onUpdateNote={(_dayNum, reflection, effort) =>
                  updateDayNote(activeChallenge.id, activeDayNumber, reflection, effort)
                }
                onViewSummary={() => setShowCompletionSummaryManual(true)}
                isAllCompleted={isAllCompleted}
              />
            </section>

            {/* 21-Day Matrix / Visual Grid */}
            <section aria-label="Challenge Grid">
              <DayGrid
                days={activeChallenge.days}
                activeDayNumber={activeDayNumber}
                onSelectDay={(day) => setSelectedDayForDetail(day)}
                onQuickCheckIn={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
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

      {/* Modal: Create New Challenge */}
      <CreateChallengeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(title, cue, startDate, category, iconName) => {
          createNewChallenge(title, cue, startDate, category, iconName);
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
        isOpen={selectedDayForDetail !== null}
        onClose={() => setSelectedDayForDetail(null)}
        onSaveNote={(dayNum, reflection, effort) => {
          if (activeChallenge) {
            updateDayNote(activeChallenge.id, dayNum, reflection, effort);
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
