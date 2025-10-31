import React, { useState, useEffect, useCallback } from 'react';
import { View } from './types';

import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ToolsLibrary from './components/ToolsLibrary';
import ToolDetail from './components/ToolDetail';
import EmergencyAI from './components/EmergencyAI';
import KnowledgeAI from './components/KnowledgeAI';
import Courses from './components/Courses';
import Tagebuch from './components/Tagebuch';
import Therapy from './components/Therapy';
import Onboarding from './components/Onboarding';
import ProfileCompletion from './components/ProfileCompletion';
import Webinars from './components/Webinars';

const ResetConfirmationModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; }> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-surface rounded-box p-6 shadow-xl max-w-md w-full m-4 animate-slide-in-up">
                <h2 className="text-xl font-bold text-text-primary mb-4">App zurücksetzen?</h2>
                <p className="text-text-secondary mb-4">
                    Möchtest du die App wirklich auf den Startzustand zurücksetzen? Alle deine Daten gehen dabei verloren.
                </p>
                <div className="mb-4 p-2 border rounded-lg bg-surface-muted">
                    <p className="text-xs text-text-secondary mb-2 text-center font-medium">So wird die App danach aussehen:</p>
                    <img 
                        src="https://i.imgur.com/G5PoX1h.png" 
                        alt="Startbildschirm der App" 
                        className="rounded-md border border-gray-200" 
                    />
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-button text-sm font-semibold bg-surface-muted hover:bg-gray-200/80 transition-colors">
                        Abbrechen
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-button text-sm font-semibold bg-emergency text-white hover:bg-rose-700 transition-colors">
                        Zurücksetzen
                    </button>
                </div>
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [isOnboarded, setIsOnboarded] = useState(() => localStorage.getItem('prototype_onboarded') === 'true');
    const [isProfileComplete, setIsProfileComplete] = useState(() => localStorage.getItem('prototype_profile_complete') === 'true');
    const [userName, setUserName] = useState<string>('');
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const [view, setView] = useState<View>(View.Dashboard);
    const [activeToolId, setActiveToolId] = useState<string | null>(null);
    const [activeJournalDate, setActiveJournalDate] = useState<string | null>(null);
    
    useEffect(() => {
        if (isOnboarded) {
            try {
                const userData = JSON.parse(localStorage.getItem('prototype_user_data') || '{}');
                setUserName(userData.name || '');
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }
    }, [isOnboarded, isProfileComplete]);


    const handleOnboardingComplete = () => {
        localStorage.setItem('prototype_onboarded', 'true');
        setIsOnboarded(true);
    };

    const handleProfileCompletion = () => {
        localStorage.setItem('prototype_profile_complete', 'true');
        setIsProfileComplete(true);
        setView(View.Dashboard); // Go back to dashboard after completion
    };

    const navigate = (newView: View, params?: { toolId?: string; date?: string }) => {
        setView(newView);
        setActiveToolId(params?.toolId || null);
        setActiveJournalDate(params?.date || null);
    };

    const handleResetApp = useCallback(() => {
        setShowResetConfirm(true);
    }, []);

    const handleConfirmReset = useCallback(() => {
        localStorage.clear();
        // Reset all relevant React states to their initial values
        setIsOnboarded(false);
        setIsProfileComplete(false);
        setUserName('');
        setView(View.Dashboard);
        setActiveToolId(null);
        setActiveJournalDate(null);
        setShowResetConfirm(false);
    }, []);

    if (!isOnboarded) {
        return <Onboarding onComplete={handleOnboardingComplete} />;
    }

    if (view === View.ProfileCompletion) {
        return <ProfileCompletion onComplete={handleProfileCompletion} onBack={() => navigate(View.Dashboard)} />;
    }
    
    const renderView = () => {
        switch (view) {
            case View.Dashboard:
                return <Dashboard navigate={navigate} isProfileComplete={isProfileComplete} userName={userName} />;
            case View.Tools:
                return <ToolsLibrary navigate={navigate} />;
            case View.ToolDetail:
                return <ToolDetail toolId={activeToolId!} onBack={() => navigate(View.Tools)} />;
            case View.Emergency:
                return <EmergencyAI />;
            case View.Knowledge:
                return <KnowledgeAI navigate={navigate} />;
            case View.Courses:
                return <Courses />;
            case View.Webinars:
                return <Webinars />;
            case View.Tagebuch:
                return <Tagebuch navigate={navigate} selectedDate={activeJournalDate} clearSelectedDate={() => setActiveJournalDate(null)} />;
            case View.Therapy:
                return <Therapy />;
            default:
                return <Dashboard navigate={navigate} isProfileComplete={isProfileComplete} userName={userName} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-background font-sans flex items-center justify-center">
            <div className="flex h-full w-full max-w-7xl bg-surface rounded-lg shadow-2xl shadow-gray-200/50 border border-gray-200/50">
                <Sidebar currentView={view} navigate={navigate} onResetApp={handleResetApp} />
                <main className="flex-1 overflow-y-auto bg-background">
                    {renderView()}
                </main>
            </div>
            <ResetConfirmationModal 
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={handleConfirmReset}
            />
        </div>
    );
};

export default App;