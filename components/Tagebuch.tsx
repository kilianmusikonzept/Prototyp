import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { JournalEntry, CustomExercise, UserData, Tool, View } from '../types';
import { TOOLS, SYMPTOM_OPTIONS, MOOD_OPTIONS } from '../constants';
import { analyzeNewSymptoms } from '../services/geminiService';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const ProfilePromptBanner: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => (
    <div className="bg-primary/5 border-l-4 border-primary text-primary-dark p-4 rounded-card shadow-card mb-6 animate-fade-in" role="alert">
      <div className="flex">
        <div className="py-1">
            <svg className="fill-current h-6 w-6 text-primary mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg>
        </div>
        <div>
          <p className="font-bold">Hol das Beste aus deinem Symptomtagebuch heraus</p>
          <p className="text-sm">Vervollständige dein Profil, damit deine Einträge und Symptome perfekt personalisiert und nachverfolgt werden können.</p>
          <button onClick={onNavigate} className="mt-2 bg-primary text-primary-content font-semibold py-1 px-3 rounded-button text-sm hover:bg-primary-focus transition-colors">
            Profil vervollständigen
          </button>
        </div>
      </div>
    </div>
);

interface PlanViewProps {
    visibleTools: Tool[];
    customExercises: CustomExercise[];
    onPlanSubmit: (planned: string[]) => void;
    saveCustomExercises: (exercises: CustomExercise[]) => void;
}

const PlanView: React.FC<PlanViewProps> = ({ visibleTools, customExercises, onPlanSubmit, saveCustomExercises }) => {
    const [tempPlanned, setTempPlanned] = useState<string[]>([]);
    const [newExerciseName, setNewExerciseName] = useState('');

    const handleToggleExercise = (id: string) => {
        setTempPlanned(prev => prev.includes(id) ? prev.filter(exId => exId !== id) : [...prev, id]);
    };

    const handleAddCustom = () => {
         if (newExerciseName.trim()) {
            const newEx = { id: `custom_${Date.now()}`, title: newExerciseName.trim() };
            saveCustomExercises([...customExercises, newEx]);
            setTempPlanned(prev => [...prev, newEx.id]);
            setNewExerciseName('');
        }
    };

    const handleDeleteCustom = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm("Möchtest du diese eigene Übung endgültig löschen?")) {
            saveCustomExercises(customExercises.filter(ex => ex.id !== id));
            setTempPlanned(prev => prev.filter(exId => exId !== id));
        }
    };

    return (
        <div className="bg-surface p-5 rounded-card shadow-card border border-gray-200/80 mb-6 animate-fade-in">
            <h3 className="text-lg font-bold text-primary mb-2">Welche Übungen nimmst du dir für heute vor?</h3>
            <p className="text-text-secondary mb-4">Wähle aus der Liste oder füge eigene hinzu.</p>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {visibleTools.map(tool => (
                    <div key={tool.id} onClick={() => handleToggleExercise(tool.id)} className={`p-3 border-2 rounded-card transition-all cursor-pointer flex items-center justify-between ${tempPlanned.includes(tool.id) ? 'border-primary bg-primary/5' : 'bg-surface'}`}>
                        <span className="font-medium text-text-primary text-sm">{tool.subtitle}</span>
                    </div>
                ))}
                {customExercises.map(ex => (
                     <div key={ex.id} onClick={() => handleToggleExercise(ex.id)} className={`group p-3 border-2 rounded-card transition-all cursor-pointer flex items-center justify-between ${tempPlanned.includes(ex.id) ? 'border-primary bg-primary/5' : 'bg-surface'}`}>
                        <span className="font-medium text-text-primary text-sm">{ex.title}</span>
                        <button onClick={(e) => handleDeleteCustom(e, ex.id)} className="text-gray-400 hover:text-emergency opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                    <input type="text" value={newExerciseName} onChange={e => setNewExerciseName(e.target.value)} placeholder="Eigene Übung hinzufügen..." className="flex-grow p-2 border border-gray-300 rounded-button bg-surface focus:outline-none focus:ring-2 focus:ring-primary"/>
                    <button onClick={handleAddCustom} className="bg-primary text-primary-content px-4 rounded-button font-semibold text-sm">Hinzufügen</button>
                </div>
            </div>
            <button onClick={() => onPlanSubmit(tempPlanned)} className="w-full mt-6 bg-secondary text-secondary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-secondary-focus transition-all">
                Plan speichern & weiter
            </button>
        </div>
    );
};


interface TagebuchProps {
    navigate: (view: View, params?: { date?: string }) => void;
    selectedDate: string | null;
    clearSelectedDate: () => void;
}

const Tagebuch: React.FC<TagebuchProps> = ({ navigate, selectedDate, clearSelectedDate }) => {
    // Data state
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);
    const [userData, setUserData] = useState<UserData>({});
    const [isProfileComplete, setIsProfileComplete] = useState(true);
    
    // UI State
    const [view, setView] = useState<'loading' | 'history' | 'ask' | 'plan' | 'form'>('loading');
    const entryRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
    
    // Form state
    const [currentPlannedExercises, setCurrentPlannedExercises] = useState<string[]>([]);
    const [currentCompletedExercises, setCurrentCompletedExercises] = useState<string[]>([]);
    const [mood, setMood] = useState(0);
    const [notes, setNotes] = useState('');
    const [hadSymptoms, setHadSymptoms] = useState<boolean | null>(null);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [symptomComment, setSymptomComment] = useState('');
    const [isPanicAttack, setIsPanicAttack] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const loadData = useCallback(() => {
        const storedEntries = localStorage.getItem('prototype_journal_entries');
        setEntries(storedEntries ? JSON.parse(storedEntries) : []);
        const storedExercises = localStorage.getItem('prototype_custom_exercises');
        setCustomExercises(storedExercises ? JSON.parse(storedExercises) : []);
        const storedUserData = localStorage.getItem('prototype_user_data');
        setUserData(storedUserData ? JSON.parse(storedUserData) : {});
        const profileStatus = localStorage.getItem('prototype_profile_complete') === 'true';
        setIsProfileComplete(profileStatus);
    }, []);

    useEffect(() => {
        loadData();
        window.addEventListener('storage', loadData);
        return () => {
            window.removeEventListener('storage', loadData);
        }
    }, [loadData]);

    useEffect(() => {
        // This effect determines the initial view based on today's entry status.
        // It avoids interrupting the user's flow once they start an action (like planning).
        if (view === 'plan') {
            return;
        }

        const todayStr = getTodayDateString();
        const todayEntry = entries.find(e => e.date === todayStr);

        if (todayEntry) {
            if (todayEntry.mood > 0) { // Entry is complete
                setView('history');
            } else { // Entry is partial (planned, but not filled out)
                setCurrentPlannedExercises(todayEntry.plannedExercises || []);
                setCurrentCompletedExercises(todayEntry.completedExercises || []);
                setView('form');
            }
        } else { // No entry for today
            setView('ask');
            resetFormState();
        }
    }, [entries]);

    useEffect(() => {
        if (selectedDate && view === 'history') {
            const entryElement = entryRefs.current.get(selectedDate);
            if (entryElement) {
                entryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                entryElement.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'transition-all', 'duration-300');
                const timer = setTimeout(() => {
                    entryElement.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
                }, 2500);
                clearSelectedDate();
                return () => clearTimeout(timer);
            } else {
                clearSelectedDate();
            }
        }
    }, [selectedDate, clearSelectedDate, view, entries]);

    const { frequentSymptoms, otherSymptoms } = useMemo(() => {
        const userFrequent = [...(userData.symptoms || []), ...(userData.customSymptoms || [])];
        const uniqueFrequent = [...new Set(userFrequent)];
        const others = SYMPTOM_OPTIONS.filter(s => !uniqueFrequent.includes(s));
        return { frequentSymptoms: uniqueFrequent, otherSymptoms: others };
    }, [userData.symptoms, userData.customSymptoms]);

    const visibleTools = useMemo(() => {
        return TOOLS.filter(tool => !(userData.hiddenToolIds || []).includes(tool.id));
    }, [userData.hiddenToolIds]);

    const saveEntries = (newEntries: JournalEntry[]) => {
        newEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEntries(newEntries);
        localStorage.setItem('prototype_journal_entries', JSON.stringify(newEntries));
        window.dispatchEvent(new Event('storage'));
    };
    
    const saveCustomExercises = (newExercises: CustomExercise[]) => {
        setCustomExercises(newExercises);
        localStorage.setItem('prototype_custom_exercises', JSON.stringify(newExercises));
        window.dispatchEvent(new Event('storage'));
    }

    const createPartialEntry = (planned: string[]) => {
        const todayStr = getTodayDateString();
        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            date: todayStr,
            mood: 0,
            notes: '',
            hadAnxietySymptoms: false,
            hadPanicAttack: null,
            panicSymptoms: [],
            panicSymptomComment: '',
            plannedExercises: planned,
            completedExercises: [],
        };
        saveEntries([newEntry, ...entries.filter(e => e.date !== todayStr)]);
        setCurrentPlannedExercises(planned);
        setCurrentCompletedExercises([]);
        setView('form');
    };

    const getExerciseTitle = useCallback((id: string): string => {
        const allExercises = [...TOOLS, ...customExercises];
        const exercise = allExercises.find(ex => ex.id === id);
        if (!exercise) return id;
        return (exercise as Tool).subtitle || exercise.title;
    }, [customExercises]);
    
    const resetFormState = () => {
        setCurrentPlannedExercises([]);
        setCurrentCompletedExercises([]);
        setMood(0);
        setNotes('');
        setHadSymptoms(null);
        setSelectedSymptoms([]);
        setSymptomComment('');
        setIsPanicAttack(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mood === 0) {
            alert("Bitte wähle eine Stimmung aus, um deinen Eintrag zu speichern.");
            return;
        }
        setIsSubmitting(true);
        
        let finalSymptoms = selectedSymptoms;
        const allKnownSymptoms = [...frequentSymptoms, ...otherSymptoms];
        let newCustomSymptoms: string[] = [];

        if (symptomComment.trim()) {
            const analyzed = await analyzeNewSymptoms(symptomComment.trim());
            newCustomSymptoms = analyzed.filter(s => !allKnownSymptoms.includes(s));
            finalSymptoms = [...new Set([...selectedSymptoms, ...analyzed])];
        }

        const todayStr = getTodayDateString();
        const existingEntry = entries.find(e => e.date === todayStr);

        const finalEntry: JournalEntry = {
            ...(existingEntry as JournalEntry),
            id: existingEntry?.id || Date.now().toString(),
            date: todayStr,
            mood,
            notes,
            hadAnxietySymptoms: hadSymptoms || false,
            hadPanicAttack: hadSymptoms ? isPanicAttack : null,
            panicSymptoms: finalSymptoms,
            panicSymptomComment: symptomComment,
            plannedExercises: currentPlannedExercises,
            completedExercises: currentCompletedExercises
        };
        
        saveEntries([finalEntry, ...entries.filter(e => e.date !== todayStr)]);
        
        if (newCustomSymptoms.length > 0) {
            const updatedUserData: UserData = {
                ...userData,
                customSymptoms: [...(userData.customSymptoms || []), ...newCustomSymptoms]
            };
            setUserData(updatedUserData);
            localStorage.setItem('prototype_user_data', JSON.stringify(updatedUserData));
            window.dispatchEvent(new Event('storage'));
        }
        
        setIsSubmitting(false);
        resetFormState();
        setView('history');
    };

    const SymptomCheckbox: React.FC<{ symptom: string }> = ({ symptom }) => (
        <div onClick={() => setSelectedSymptoms(p => p.includes(symptom) ? p.filter(s => s !== symptom) : [...p, symptom])}
            className={`p-3 border-2 rounded-card text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${selectedSymptoms.includes(symptom) ? 'border-primary bg-primary/5 text-primary' : 'bg-surface text-text-secondary hover:border-gray-300'}`}>
            <span>{symptom}</span>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${selectedSymptoms.includes(symptom) ? 'bg-primary' : 'border-2 border-gray-300'}`}>
                {selectedSymptoms.includes(symptom) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
            </div>
        </div>
    );
    
    const renderAskView = () => (
        <div className="bg-surface p-5 rounded-card shadow-card border border-gray-200/80 mb-6 text-center animate-fade-in">
            <h3 className="text-lg font-bold text-primary mb-2">Plane deinen Tag</h3>
            <p className="text-text-secondary mb-4">Machst du Übungen?</p>
            <div className="flex gap-4">
                <button onClick={() => setView('plan')} className="w-full bg-primary text-primary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-primary-focus transition-all">
                    Ja
                </button>
                <button onClick={() => createPartialEntry([])} className="w-full bg-surface-muted text-text-primary font-bold py-3 px-6 rounded-button text-lg hover:bg-gray-200 transition-colors">
                    Nein
                </button>
            </div>
        </div>
    );
    
    const renderNewEntryForm = () => (
        <form onSubmit={handleSubmit} className="bg-surface p-5 rounded-card shadow-card border border-gray-200/80 mb-6 animate-fade-in">
            <h3 className="text-lg font-bold text-primary mb-4">Heutiger Eintrag</h3>
            
            <div className="mb-4">
                <label className="font-semibold text-text-primary mb-3 block">1. Wie war dein allgemeines Wohlbefinden heute?</label>
                <div className="flex justify-around">
                    {MOOD_OPTIONS.map(opt => (
                        <button type="button" key={opt.value} onClick={() => setMood(opt.value)}
                            className={`flex flex-col items-center p-2 rounded-lg transition-all w-16 ${mood === opt.value ? 'bg-primary/10 scale-110' : 'hover:bg-gray-100'}`}>
                            <span className="text-3xl">{opt.icon}</span>
                            <span className={`text-xs mt-1 font-medium ${mood === opt.value ? 'text-primary' : 'text-text-secondary'}`}>{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="my-6">
                <label htmlFor="notes" className="font-semibold text-text-primary mb-2 block">2. Notizen zum Tag:</label>
                <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                    className="w-full p-3 border border-gray-300 rounded-button bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Was ist heute passiert? Was hat dich beschäftigt?" />
            </div>
            
             <div className="my-6">
                <label className="font-semibold text-text-primary mb-2 block">3. Hattest du heute mit Angst-Symptomen zu kämpfen?</label>
                 <div className="flex gap-4">
                    <button type="button" onClick={() => setHadSymptoms(true)} className={`w-full p-3 border-2 rounded-card font-semibold ${hadSymptoms === true ? 'border-primary bg-primary/5' : 'bg-surface'}`}>Ja</button>
                    <button type="button" onClick={() => { setHadSymptoms(false); setIsPanicAttack(null); setSelectedSymptoms([]); setSymptomComment(''); }} className={`w-full p-3 border-2 rounded-card font-semibold ${hadSymptoms === false ? 'border-primary bg-primary/5' : 'bg-surface'}`}>Nein</button>
                 </div>
             </div>

            {hadSymptoms && (
                <div className="my-6 p-4 bg-surface-muted rounded-card animate-fade-in">
                    <label className="font-semibold text-text-primary mb-3 block">Welche Symptome sind aufgetreten?</label>
                    {frequentSymptoms.length > 0 && <div className="mb-4"><h4 className="text-sm font-semibold text-text-primary mb-2">Deine häufigen Symptome</h4><div className="space-y-2">{frequentSymptoms.map(s => <SymptomCheckbox key={s} symptom={s} />)}</div></div>}
                    {otherSymptoms.length > 0 && <div className="mb-4"><h4 className="text-sm font-semibold text-text-primary mb-2">Weitere Symptome</h4><div className="space-y-2">{otherSymptoms.map(s => <SymptomCheckbox key={s} symptom={s} />)}</div></div>}
                    <label htmlFor="symptomComment" className="font-semibold text-text-primary mb-2 block text-sm">Gab es weitere Symptome?</label>
                    <textarea id="symptomComment" value={symptomComment} onChange={e => setSymptomComment(e.target.value)} rows={2} className="w-full p-2 border border-gray-300 rounded-button bg-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="z.B. Druck im Kopf, innere Unruhe..." />
                     <label className="font-semibold text-text-primary mb-2 mt-4 block">Würdest du das als Panikattacke bezeichnen?</label>
                    <div className="flex gap-4">
                        <button type="button" onClick={() => setIsPanicAttack(true)} className={`w-full p-3 border-2 rounded-card font-semibold ${isPanicAttack === true ? 'border-primary bg-primary/5' : 'bg-surface'}`}>Ja</button>
                        <button type="button" onClick={() => setIsPanicAttack(false)} className={`w-full p-3 border-2 rounded-card font-semibold ${isPanicAttack === false ? 'border-primary bg-primary/5' : 'bg-surface'}`}>Nein</button>
                    </div>
                </div>
            )}

            {currentPlannedExercises && currentPlannedExercises.length > 0 && (
                <div className="my-6">
                    <p className="font-semibold text-text-primary mb-2 block">4. Welche Übungen hast du heute gemacht?</p>
                    <div className="space-y-2">
                        {currentPlannedExercises.map(exerciseId => {
                            const isCompleted = currentCompletedExercises.includes(exerciseId);
                            return (
                                <div key={exerciseId} onClick={() => setCurrentCompletedExercises(prev => isCompleted ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId])} className="p-3 border-2 rounded-card transition-all flex items-center justify-between bg-surface hover:border-gray-300 cursor-pointer">
                                    <div className="flex-1 flex items-center">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all mr-3 flex-shrink-0 ${isCompleted ? 'bg-primary' : 'border-2 border-gray-300'}`}> {isCompleted && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>} </div>
                                        <span className={`text-sm font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-text-primary'}`}>{getExerciseTitle(exerciseId)}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            <button type="submit" disabled={isSubmitting || mood === 0} className="w-full bg-secondary text-secondary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-secondary-focus transition-all transform hover:scale-105 disabled:bg-gray-300">
                {isSubmitting ? 'Wird gespeichert...' : 'Eintrag speichern'}
            </button>
        </form>
    );

    const renderHistory = () => (
         <div className="space-y-4">
            <h3 className="text-lg font-bold text-text-primary mt-4">Dein Verlauf</h3>
            {entries.length === 0 && <p className="text-text-secondary">Noch keine Einträge vorhanden.</p>}
            {entries.map(entry => (
                <div 
                    key={entry.id} 
                    ref={el => { entryRefs.current.set(entry.date, el); }}
                    className="bg-surface p-4 rounded-card shadow-card border border-gray-200/80"
                >
                   <div className="flex justify-between items-start">
                       <div>
                            <p className="font-bold text-primary">{new Date(entry.date + 'T00:00:00').toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                           <div className="flex items-center mt-1">
                                {MOOD_OPTIONS.map(opt => (
                                    <span key={opt.value} className={`text-xl ${entry.mood >= opt.value ? '' : 'opacity-20'}`}>{opt.icon}</span>
                                ))}
                                <span className="ml-2 text-sm font-medium text-text-secondary">({entry.mood}/5)</span>
                           </div>
                       </div>
                   </div>
                    {entry.notes && <p className="text-text-primary my-3 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">{entry.notes}</p>}
                    
                    {entry.hadAnxietySymptoms && (
                         <div className="mt-3 pt-3 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-text-primary mb-2">
                                    {entry.hadPanicAttack ? 'Panikattacke protokolliert' : 'Angstsymptome protokolliert'}
                                </h4>
                                {entry.panicSymptoms.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                                        {entry.panicSymptoms.map(symptom => <li key={symptom}>{symptom}</li>)}
                                    </ul>
                                ) : <p className="text-sm text-text-secondary">Keine spezifischen Symptome ausgewählt.</p>}
                                {entry.panicSymptomComment && <p className="text-xs italic text-gray-500 mt-2">Weitere Notiz: "{entry.panicSymptomComment}"</p>}
                        </div>
                    )}

                    {entry.plannedExercises?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-text-primary mb-2">Übungen:</h4>
                            <ul className="list-disc list-inside text-sm text-text-secondary space-y-1">
                                {entry.plannedExercises.map(id => (
                                    <li key={id} className={`${(entry.completedExercises || []).includes(id) ? 'line-through text-gray-400' : ''}`}>
                                        {getExerciseTitle(id)}
                                        {(entry.completedExercises || []).includes(id) && 
                                            <span className="text-primary font-bold ml-2">✓</span>
                                        }
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    const renderContent = () => {
        switch (view) {
            case 'ask':
                return renderAskView();
            case 'plan':
                return <PlanView 
                    visibleTools={visibleTools}
                    customExercises={customExercises}
                    saveCustomExercises={saveCustomExercises}
                    onPlanSubmit={createPartialEntry}
                />;
            case 'form':
                return renderNewEntryForm();
            case 'history':
                return renderHistory();
            case 'loading':
            default:
                return <p>Lade...</p>;
        }
    };
    
    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-1">Symptomtagebuch</h2>
            <p className="text-text-secondary mb-6">Halte dein Wohlbefinden fest, um Muster und Fortschritte zu erkennen.</p>

            {!isProfileComplete && (view === 'ask' || view === 'plan' || view === 'form') && (
                <ProfilePromptBanner onNavigate={() => navigate(View.ProfileCompletion)} />
            )}
            
            {renderContent()}

            {view === 'form' && renderHistory()}
        </div>
    );
};

export default Tagebuch;