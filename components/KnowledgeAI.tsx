import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, KnowledgeChatMode, View } from '../types';
import { getKnowledgeAnswer } from '../services/geminiService';
import UserInput from './UserInput';

export const formatUserDataForContext = (data: any): string => {
    if (!data) return "Keine Nutzerdaten verfügbar.";
    
    const addLine = (label: string, value: any) => {
        if (value && (!Array.isArray(value) || value.length > 0)) {
            return `${label}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
        }
        return '';
    };

    let context = '';
    context += addLine('Name', data.name);
    context += addLine('Alter', data.age);
    context += addLine('Geschlecht', data.gender);
    context += addLine('Dauer der Beschwerden', data.symptomDuration);
    context += addLine('Hauptsymptome', data.symptoms);
    context += addLine('Andere Symptome', data.symptomComment);
    context += addLine('Vermiedene Situationen', data.avoidedSituations);
    context += addLine('Sicherheitsverhalten', data.safetyBehaviors);
    context += addLine('Verstärker der Angst', data.anxietyAmplifiers);
    context += addLine('Durchschnittlicher Schlaf', data.avgSleep);
    context += addLine('Weitere Auslöser', data.triggersComment);
    context += addLine('Med. Abklärung Herz/Kreislauf', data.medicalCardio);
    context += addLine('Med. Abklärung Schilddrüse', data.medicalThyroid);
    context += addLine('Med. Abklärung Atmung', data.medicalRespiratory);
    context += addLine('Med. Abklärung Neurologie', data.medicalNeuro);
    context += addLine('Med. Abklärung Substanzen', data.medicalSubstances);
    context += addLine('Med. Abklärung Therapie', data.medicalTherapy);

    return context.trim() || "Keine detaillierten Nutzerdaten verfügbar.";
};

const CHAT_MODES_CONFIG = {
  general: {
    welcomeMessage: "Hallo! Hier kannst du mir Fragen rund um die Themen Angst, Panik und Wohlbefinden stellen. Was möchtest du wissen?",
    prompts: [
      "Was ist der Unterschied zwischen Angst und Panik?",
      "Erkläre mir das Kämpfe-oder-Fliehe-System.",
      "Wie funktioniert eine Atemübung?",
    ],
  },
  quick_help: {
    welcomeMessage: "Hallo! Ich bin hier, um dir schnell zu helfen. Beschreibe kurz die Situation, in der du dich befindest, und ich gebe dir umsetzbare Tipps.",
    prompts: [
      "Ich muss gleich in einen vollen Supermarkt.",
      "Ich habe in 10 Minuten ein wichtiges Meeting.",
      "Was kann ich im Flugzeug gegen die Angst tun?",
    ],
  },
};

interface KnowledgeAIProps {
  navigate: (view: View) => void;
}

const KnowledgeAI: React.FC<KnowledgeAIProps> = ({ navigate }) => {
    const [mode, setMode] = useState<KnowledgeChatMode>('general');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([]);
        addMessage('balance', 'text', CHAT_MODES_CONFIG[mode].welcomeMessage);
    }, [mode]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const addMessage = (sender: 'user' | 'balance', type: ChatMessage['type'], content: any) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender, type, content }]);
    };
    
    const handleUserMessage = async (text: string) => {
        addMessage('user', 'text', text);
        setIsLoading(true);

        let userContext = "Keine Nutzerdaten verfügbar.";
        try {
            const userDataString = localStorage.getItem('prototype_user_data');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                userContext = formatUserDataForContext(userData);
            }
        } catch (e) {
            console.error("Fehler beim Verarbeiten der Nutzerdaten:", e);
            userContext = "Fehler beim Laden der Nutzerdaten.";
        }

        const answer = await getKnowledgeAnswer(text, userContext, mode);
        setIsLoading(false);
        addMessage('balance', 'text', answer);
    };

    const handlePromptClick = (prompt: string) => {
        if (isLoading) return;
        handleUserMessage(prompt);
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200/80 bg-surface">
                <h2 className="text-xl font-bold text-text-primary mb-1">Chatbot</h2>
                <p className="text-sm text-text-secondary mb-4">Wähle einen Modus, der zu deiner Frage passt.</p>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => setMode('general')} className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${mode === 'general' ? 'bg-primary text-primary-content border-primary' : 'bg-surface text-text-secondary border-gray-300 hover:bg-gray-100'}`}>
                        💬 Allgemein
                    </button>
                    <button onClick={() => setMode('quick_help')} className={`px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors ${mode === 'quick_help' ? 'bg-primary text-primary-content border-primary' : 'bg-surface text-text-secondary border-gray-300 hover:bg-gray-100'}`}>
                        ⚡ Schnelle Hilfe
                    </button>
                    <button onClick={() => navigate(View.Emergency)} className="px-4 py-2 text-sm font-semibold rounded-full border-2 transition-colors bg-emergency/10 text-emergency border-emergency/20 hover:bg-emergency/20">
                        🆘 Hilfe im Notfall
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 {messages.map((msg) => (
                    <div key={msg.id} className={`flex animate-fade-in ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`px-4 py-3 rounded-2xl max-w-sm md:max-w-md shadow-sm border ${msg.sender === 'user' ? 'bg-secondary text-secondary-content rounded-br-none border-transparent' : 'bg-surface text-text-primary rounded-bl-none border-gray-200/80'}`}>
                           <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && <div className="flex justify-start"><div className="px-4 py-3 rounded-2xl bg-surface text-text-primary rounded-bl-none shadow-sm border border-gray-200/80"><div className="flex items-center space-x-2"><div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div><div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-75"></div><div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse delay-150"></div></div></div></div>}
                <div ref={chatEndRef} />
            </div>
            <div className="p-3 bg-surface/95 backdrop-blur-sm border-t border-gray-200/80">
                <div className="flex flex-wrap gap-2 mb-3">
                    {CHAT_MODES_CONFIG[mode].prompts.map(prompt => (
                        <button 
                            key={prompt} 
                            onClick={() => handlePromptClick(prompt)}
                            disabled={isLoading}
                            className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full hover:bg-primary/20 transition-colors disabled:opacity-50"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
                <UserInput onSend={handleUserMessage} disabled={isLoading} />
            </div>
        </div>
    );
};

export default KnowledgeAI;