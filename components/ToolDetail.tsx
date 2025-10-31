import React, { useState, useEffect } from 'react';
import { Tool } from '../types';
import { getToolById, logSession, updateTags, logExerciseAsCompleted } from '../services/mockApi';
import SudsScale from './SudsScale';
import BreathingAnimator from './BreathingAnimator';
import Timer from './Timer';
import AudioExperience from './AudioExperience';

interface ToolDetailProps {
  toolId: string;
  onBack: () => void;
}

type ExerciseStep = 'start' | 'preSuds' | 'exercise' | 'postSuds' | 'complete';

const ToolDetail: React.FC<ToolDetailProps> = ({ toolId, onBack }) => {
    const [tool, setTool] = useState<Tool | null>(null);
    const [step, setStep] = useState<ExerciseStep>('start');
    const [preSuds, setPreSuds] = useState<number | null>(null);
    const [postSuds, setPostSuds] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTool = async () => {
            setIsLoading(true);
            const fetchedTool = await getToolById(toolId);
            if (fetchedTool) {
                setTool(fetchedTool);
                setStep('preSuds');
            }
            setIsLoading(false);
        };
        fetchTool();
    }, [toolId]);

    const handleSudsSelect = async (value: number) => {
        if (step === 'preSuds') {
            setPreSuds(value);
            setStep('exercise');
        } else if (step === 'postSuds') {
            setPostSuds(value);
            if (tool && preSuds !== null) {
                const preSudsNormalized = preSuds / 10;
                const postSudsNormalized = value / 10;
                const delta = preSudsNormalized - postSudsNormalized;
                await updateTags(tool, delta);
                await logSession({ toolId: tool.id, toolTitle: tool.subtitle, preSuds, postSuds: value });
                await logExerciseAsCompleted(tool.id);
            }
            setStep('complete');
        }
    };

    const handleExerciseComplete = () => {
        setStep('postSuds');
    };

    if (isLoading) {
        return <div className="p-6 text-center text-text-secondary">Lade Übung...</div>;
    }

    if (!tool) {
        return <div className="p-6 text-center text-accent">Übung konnte nicht geladen werden.</div>;
    }
    
    return (
        <div className="p-4 md:p-6 animate-fade-in">
             <button onClick={onBack} className="mb-4 text-primary font-semibold hover:underline flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Zurück zur Bibliothek
             </button>
             <div className="bg-surface p-4 sm:p-6 rounded-card shadow-card border border-gray-200/80">
                <h2 className="text-2xl font-bold text-text-primary">{tool.title}</h2>
                <p className="text-md text-text-secondary mb-4 -mt-1 font-semibold">{tool.subtitle}</p>

                {step === 'preSuds' && (
                    <SudsScale onSelect={handleSudsSelect} prompt="Bevor wir beginnen: Wie hoch ist deine Anspannung gerade auf einer Skala von 0 (gar nicht) bis 10 (maximal)?" />
                )}

                {step === 'exercise' && (
                    tool.component === 'AudioPlayer' ? (
                        <AudioExperience tool={tool} onComplete={handleExerciseComplete} />
                    ) : (
                        <div className="w-full flex flex-col items-center p-4 bg-surface-muted rounded-card">
                            <p className="text-text-secondary mb-4 text-center">Mach es dir so bequem wie möglich und folge der Anleitung.</p>
                            {tool.component === 'Breathing' ? <BreathingAnimator /> : (
                                <div className="text-left space-y-3 text-text-primary prose max-w-full">
                                    {tool.steps!.map((step, index) => <p key={index} className="text-sm"><strong>Schritt {index + 1}:</strong> {step}</p>)}
                                </div>
                            )}
                            <div className="mt-6">
                               <Timer durationInSeconds={tool.duration * 60} onComplete={handleExerciseComplete} />
                            </div>
                        </div>
                    )
                )}
                
                {step === 'postSuds' && (
                    <SudsScale onSelect={handleSudsSelect} prompt="Sehr gut, du hast die Übung abgeschlossen. Wie fühlst du dich jetzt? Bewerte deine Anspannung erneut von 0 bis 10." />
                )}

                {step === 'complete' && (
                    <div className="text-center p-6 bg-primary/5 rounded-card">
                        <div className="mx-auto bg-primary text-primary-content h-12 w-12 flex items-center justify-center rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                         <h3 className="text-xl font-bold text-primary">Toll gemacht!</h3>
                         <p className="text-text-primary my-2">
                           Deine Anspannung hat sich von <strong>{preSuds}/10</strong> auf <strong>{postSuds}/10</strong> verändert.
                         </p>
                         <p className="text-text-secondary text-sm">Jede Übung ist ein wichtiger Schritt. Sei stolz auf dich, dass du dir diese Zeit genommen hast.</p>
                         <button onClick={onBack} className="mt-4 bg-primary text-primary-content px-4 py-2 rounded-button hover:bg-primary-focus transition-colors">
                            Fertig
                         </button>
                    </div>
                )}
             </div>
        </div>
    );
};

export default ToolDetail;