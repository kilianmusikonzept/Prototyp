
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getEmergencyResponse } from '../services/geminiService';
import { formatUserDataForContext } from './KnowledgeAI'; // Re-using formatter
import UserInput from './UserInput';

const CrisisAlert: React.FC = () => (
    <div className="bg-emergency-light border-l-4 border-emergency text-emergency-dark p-4 rounded-card m-4 animate-fade-in" role="alert">
        <p className="font-bold">Wichtiger Hinweis</p>
        <p className="text-sm">
            Prototype ist eine KI und kann professionelle Hilfe nicht ersetzen.
            Wenn du dich in einer schweren Krise befindest, zögere bitte nicht, dir sofort Unterstützung zu suchen.
        </p>
        <ul className="mt-2 list-disc list-inside text-sm">
            <li>Telefonseelsorge: <a href="tel:08001110111" className="font-semibold underline">0800 111 0 111</a></li>
            <li>Ärztlicher Bereitschaftsdienst: <a href="tel:116117" className="font-semibold underline">116 117</a></li>
            <li>Im Notfall: Wähle die <a href="tel:112" className="font-semibold underline">112</a></li>
        </ul>
    </div>
);

const EmergencyAI: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatStarted, setChatStarted] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        addMessage('balance', 'text', "Ich bin für dich da. Atme einmal tief durch. Befindest du dich gerade in einer akuten Situation?");
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const addMessage = (sender: 'user' | 'balance', type: ChatMessage['type'], content: any) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender, type, content }]);
    };

    const handlePanicButtonClick = async () => {
        setChatStarted(true);
        addMessage('user', 'text', "Ich habe gerade eine Panikattacke.");
        setIsLoading(true);
        
        const userContext = getUserContext();
        const response = await getEmergencyResponse(userContext);
        
        setIsLoading(false);
        addMessage('balance', 'text', response);
    };

    const handleUserMessage = async (text: string) => {
        addMessage('user', 'text', text);
        setIsLoading(true);

        const userContext = getUserContext();
        const response = await getEmergencyResponse(userContext, text);
        
        setIsLoading(false);
        addMessage('balance', 'text', response);
    };

    const getUserContext = (): string => {
        try {
            const userDataString = localStorage.getItem('prototype_user_data');
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                return formatUserDataForContext(userData);
            }
        } catch (e) {
            console.error("Fehler beim Verarbeiten der Nutzerdaten:", e);
            return "Fehler beim Laden der Nutzerdaten.";
        }
        return "Keine Nutzerdaten verfügbar.";
    }


    return (
        <div className="flex flex-col h-full">
            <CrisisAlert />
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

            {!chatStarted ? (
                <div className="p-4 bg-surface/95 backdrop-blur-sm border-t border-gray-200/80">
                    <button 
                        onClick={handlePanicButtonClick} 
                        className="w-full bg-emergency text-white font-bold py-3 px-6 rounded-button text-lg hover:bg-rose-700 transition-all transform hover:scale-105"
                    >
                        Ich habe eine Panikattacke
                    </button>
                </div>
            ) : (
                <UserInput onSend={handleUserMessage} disabled={isLoading} />
            )}
        </div>
    );
};

export default EmergencyAI;