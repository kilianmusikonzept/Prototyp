import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, JournalEntry, Tool, CustomExercise, UserData } from '../types';
import StatsChart from './StatsChart';
import { TOOLS, MOTIVATIONAL_QUOTES } from '../constants';
import { toggleDashboardExerciseCompletion } from '../services/mockApi';

interface DashboardProps {
  navigate: (view: View, params?: { toolId?: string; date?: string }) => void;
  isProfileComplete: boolean;
  userName?: string;
}

const ProfileCompletionBanner: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
    <div className="bg-primary/5 border-l-4 border-primary text-primary-dark p-4 rounded-card shadow-card mb-6 animate-fade-in" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-primary mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>
        </div>
        <div>
          <p className="font-bold">Vervollständige dein Profil</p>
          <p className="text-sm">Beantworte ein paar weitere Fragen, um Prototype besser auf dich abzustimmen.</p>
          <button onClick={onComplete} className="mt-2 bg-primary text-primary-content font-semibold py-1 px-3 rounded-button text-sm hover:bg-primary-focus transition-colors">
            Jetzt starten
          </button>
        </div>
      </div>
    </div>
);

const JournalPromptBanner: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => (
    <div className="bg-secondary/5 border-l-4 border-secondary text-secondary-dark p-4 rounded-card shadow-card mb-6 animate-fade-in" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.514C18.332 12.89 18 15.941 18 19c0 .337.016.67.046.998M17 13l-4.5-4.5M5.436 13.683L4 15" /></svg>
        </div>
        <div>
          <p className="font-bold">Wie geht es dir heute?</p>
          <p className="text-sm">Halte dein Wohlbefinden in deinem Symptomtagebuch fest, um deine Fortschritte zu verfolgen.</p>
          <button onClick={onNavigate} className="mt-2 bg-secondary text-secondary-content font-semibold py-1 px-3 rounded-button text-sm hover:bg-secondary-focus transition-colors">
            Eintrag erstellen
          </button>
        </div>
      </div>
    </div>
);

const TaskItem: React.FC<{
    title: string;
    description?: string;
    icon: string;
    isCompleted?: boolean;
    isCustom?: boolean;
    onNavigate: () => void;
    onToggleComplete: () => void;
}> = ({ title, description, icon, isCompleted = false, isCustom = false, onNavigate, onToggleComplete }) => (
    <div 
        className={`w-full text-left flex items-center gap-3 p-3 rounded-button transition-colors ${
            isCompleted 
            ? 'bg-primary/10 text-text-secondary' 
            : 'bg-surface-muted hover:bg-primary/10'
        }`}
    >
        <span className={`text-xl transition-opacity pt-1 ${isCompleted ? 'opacity-50' : ''}`}>{icon}</span>
        <div className={`flex-1 ${!isCustom ? 'cursor-pointer' : ''}`} onClick={!isCustom ? onNavigate : undefined}>
            <span className={`font-semibold transition-colors ${
                isCompleted 
                ? 'line-through text-text-secondary' 
                : 'text-text-primary'
            }`}>{title}</span>
             {description && <p className={`text-xs ${isCompleted ? 'text-text-secondary/80' : 'text-text-secondary'}`}>{description}</p>}
        </div>
        <button 
            onClick={onToggleComplete}
            aria-label={`Markiere ${title} als ${isCompleted ? 'unvollständig' : 'vollständig'}`}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isCompleted ? 'bg-primary' : 'border-2 border-gray-300'}`}
        >
            {isCompleted && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
        </button>
    </div>
);

const ToDoToday: React.FC<{ 
    navigate: (view: View, params?: { toolId?: string }) => void;
    isJournalEntryCompleted: boolean;
    plannedExercises: (Tool | CustomExercise)[];
    completedExerciseIds: string[];
}> = ({ navigate, isJournalEntryCompleted, plannedExercises, completedExerciseIds }) => {

    return (
        <div className="bg-surface p-5 rounded-card border border-gray-200/80 shadow-card">
            <h3 className="text-base font-bold text-primary mb-3">Heute zu tun</h3>
            <div className="space-y-2">
                <TaskItem 
                    title="Symptomtagebuch-Eintrag machen"
                    description="Halte dein Wohlbefinden für heute fest."
                    icon="📔"
                    isCompleted={isJournalEntryCompleted}
                    onNavigate={() => navigate(View.Tagebuch)}
                    onToggleComplete={() => navigate(View.Tagebuch)}
                />
                {plannedExercises.map(exercise => {
                    const isCustom = exercise.id.startsWith('custom_');
                    return (
                        <TaskItem 
                            key={exercise.id}
                            title={(exercise as Tool).subtitle || exercise.title}
                            icon={isCustom ? '✍️' : '🧘‍♀️'}
                            isCompleted={completedExerciseIds.includes(exercise.id)}
                            onNavigate={() => !isCustom && navigate(View.ToolDetail, { toolId: exercise.id })}
                            onToggleComplete={() => toggleDashboardExerciseCompletion(exercise.id)}
                            isCustom={isCustom}
                        />
                    );
                })}
            </div>
        </div>
    );
};

const WeeklySummary: React.FC<{ stats: { toolsUsed: number; panicFreeDays: number } }> = ({ stats }) => (
    <div className="bg-surface p-5 rounded-card border border-gray-200/80 shadow-card">
        <h3 className="text-base font-bold text-primary mb-3">Deine Woche</h3>
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <span className="text-2xl">✔️</span>
                <div>
                    <p className="font-bold text-text-primary text-lg">{stats.toolsUsed}</p>
                    <p className="text-sm text-text-secondary -mt-1">Tools genutzt</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-2xl">🕊️</span>
                <div>
                    <p className="font-bold text-text-primary text-lg">{stats.panicFreeDays}</p>
                    <p className="text-sm text-text-secondary -mt-1">Tage ohne Panikattacke</p>
                </div>
            </div>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ navigate, isProfileComplete, userName }) => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);
  const [hiddenToolIds, setHiddenToolIds] = useState<string[]>([]);
  const [dailyQuote, setDailyQuote] = useState<string>('Heute ist ein guter Tag, um ruhig zu atmen. 🕊️');

  const loadAndPrepareData = useCallback(() => {
    const storedEntriesRaw = localStorage.getItem('prototype_journal_entries');
    let entries: JournalEntry[] = storedEntriesRaw ? JSON.parse(storedEntriesRaw) : [];
    
    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setJournalEntries(sortedEntries);

    const storedExercises = localStorage.getItem('prototype_custom_exercises');
    setCustomExercises(storedExercises ? JSON.parse(storedExercises) : []);

    const storedUserData = localStorage.getItem('prototype_user_data');
    if (storedUserData) {
        const userData: UserData = JSON.parse(storedUserData);
        setHiddenToolIds(userData.hiddenToolIds || []);
    }
  }, []);

  useEffect(() => {
    // Logic for daily quote
    const todayStr = new Date().toISOString().split('T')[0];
    const storedQuoteDataRaw = localStorage.getItem('prototype_daily_quote');
    let currentQuote = '';

    if (storedQuoteDataRaw) {
        try {
            const storedQuoteData = JSON.parse(storedQuoteDataRaw);
            if (storedQuoteData.date === todayStr) {
                currentQuote = storedQuoteData.quote;
            }
        } catch (e) {
            console.error("Failed to parse daily quote data", e);
            localStorage.removeItem('prototype_daily_quote'); // Clear corrupted data
        }
    }

    if (!currentQuote) {
        const lastQuote = storedQuoteDataRaw ? JSON.parse(storedQuoteDataRaw).quote : null;
        let newQuote: string;
        do {
            newQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
        } while (MOTIVATIONAL_QUOTES.length > 1 && newQuote === lastQuote);
        
        localStorage.setItem('prototype_daily_quote', JSON.stringify({ quote: newQuote, date: todayStr }));
        currentQuote = newQuote;
    }
    setDailyQuote(currentQuote);
      
    loadAndPrepareData();
    window.addEventListener('storage', loadAndPrepareData);
    window.addEventListener('focus', loadAndPrepareData);
    return () => {
        window.removeEventListener('storage', loadAndPrepareData);
        window.removeEventListener('focus', loadAndPrepareData);
    }
  }, [loadAndPrepareData]);

  const { hasCompletedJournalEntryToday, weeklyStats, plannedExerciseIds, completedExerciseIds } = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayEntry = journalEntries.find(e => e.date === todayStr);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(new Date().getDate() - 7);

    const recentWeekEntries = journalEntries.filter(entry => new Date(entry.date) >= sevenDaysAgo);
    
    const toolsUsed = recentWeekEntries.reduce((acc, entry) => acc + (entry.completedExercises?.length || 0), 0);
    const panicFreeDays = recentWeekEntries.filter(entry => !entry.hadPanicAttack).length;

    return {
        hasCompletedJournalEntryToday: !!todayEntry && todayEntry.mood > 0,
        weeklyStats: { toolsUsed, panicFreeDays },
        plannedExerciseIds: todayEntry ? todayEntry.plannedExercises : [],
        completedExerciseIds: todayEntry ? (todayEntry.completedExercises || []) : []
    };
  }, [journalEntries]);
  
  const exercisesForTodoList = useMemo(() => {
      if (!plannedExerciseIds || plannedExerciseIds.length === 0) return [];
      const allAvailableExercises: (Tool | CustomExercise)[] = [
          ...TOOLS.filter(tool => !hiddenToolIds.includes(tool.id)), 
          ...customExercises
      ];
      return allAvailableExercises.filter(ex => plannedExerciseIds.includes(ex.id));
  }, [hiddenToolIds, customExercises, plannedExerciseIds]);

  const showProfileCompletionBanner = !isProfileComplete;
  const showJournalPromptBanner = isProfileComplete && !hasCompletedJournalEntryToday;

  return (
    <div className="p-6 md:p-8 animate-fade-in h-full overflow-y-auto">
        {showProfileCompletionBanner && <ProfileCompletionBanner onComplete={() => navigate(View.ProfileCompletion)} />}
        {showJournalPromptBanner && <JournalPromptBanner onNavigate={() => navigate(View.Tagebuch)} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        {userName ? `Willkommen zurück, ${userName}!` : 'Willkommen bei Prototype!'}
                    </h1>
                    <p className="text-lg text-text-secondary">{dailyQuote}</p>
                </div>
                
                <div className="bg-surface p-6 rounded-card border border-gray-200/80">
                     <h2 className="text-xl font-bold text-primary mb-4">Dein Fortschritt</h2>
                     <div className="h-64">
                        <StatsChart data={journalEntries} onDateSelect={(date) => navigate(View.Tagebuch, { date })} />
                     </div>
                </div>
            </div>
            
            <div className="lg:col-span-1 space-y-6">
                <ToDoToday 
                    navigate={navigate} 
                    isJournalEntryCompleted={hasCompletedJournalEntryToday}
                    plannedExercises={exercisesForTodoList}
                    completedExerciseIds={completedExerciseIds}
                />
                <WeeklySummary stats={weeklyStats} />
            </div>
        </div>
    </div>
  );
};

export default Dashboard;