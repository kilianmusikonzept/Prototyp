
import React, { useState } from 'react';

interface UserInputProps {
    onSend: (text: string) => void;
    disabled: boolean;
}

const UserInput: React.FC<UserInputProps> = ({ onSend, disabled }) => {
    const [input, setInput] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input.trim());
            setInput('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-3 bg-surface/95 backdrop-blur-sm border-t border-gray-200/80">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={disabled ? "Balance antwortet..." : "Schreibe eine Nachricht..."}
                    disabled={disabled}
                    className="w-full pl-4 pr-14 py-3 border border-gray-300 rounded-full bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label="Deine Nachricht eingeben"
                />
                <button type="submit" disabled={disabled || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary text-secondary-content w-10 h-10 flex items-center justify-center rounded-full disabled:bg-gray-400 transition-all hover:bg-secondary-focus transform hover:scale-110" aria-label="Nachricht senden">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </button>
            </div>
        </form>
    );
};

export default UserInput;
