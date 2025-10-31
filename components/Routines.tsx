
import React, { useState } from 'react';

const Routines: React.FC = () => {
    const [journalEntry, setJournalEntry] = useState('');

    return (
        <div className="p-4 md:p-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-text-primary mb-1">Routinen & Reflexion</h2>
            <p className="text-text-secondary mb-6">Strukturiere deinen Tag und halte deine Gedanken fest.</p>
            
            <div className="bg-surface p-5 rounded-card shadow-card border border-gray-200/80 mb-6">
                <h3 className="text-lg font-bold text-primary mb-3">Meine Routinen</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-surface-muted rounded-button">
                        <span className="font-medium text-text-primary">Morgenroutine</span>
                        <button className="text-sm text-primary font-semibold hover:underline">Bearbeiten</button>
                    </div>
                     <div className="flex justify-between items-center p-4 bg-surface-muted rounded-button">
                        <span className="font-medium text-text-primary">Abendroutine</span>
                        <button className="text-sm text-primary font-semibold hover:underline">Bearbeiten</button>
                    </div>
                </div>
            </div>

            <div className="bg-surface p-5 rounded-card shadow-card border border-gray-200/80">
                <h3 className="text-lg font-bold text-primary mb-3">Heutige Reflexion</h3>
                <p className="text-text-secondary mb-3 text-sm">Was hat dich heute beschäftigt? Was ist gut gelaufen? Halte deine Gedanken hier fest.</p>
                <textarea
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    rows={8}
                    className="w-full p-3 border border-gray-300 rounded-button bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Schreibe hier deine Gedanken auf..."
                />
                <button className="mt-4 bg-secondary text-secondary-content px-4 py-2 rounded-button font-semibold hover:bg-secondary-focus transition-colors">
                    Eintrag speichern
                </button>
            </div>
        </div>
    );
};

export default Routines;
