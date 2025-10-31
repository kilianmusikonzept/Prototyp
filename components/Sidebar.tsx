import React from 'react';
import { View } from '../types';

interface SidebarProps {
    currentView: View;
    navigate: (view: View, params?: { toolId?: string; date?: string }) => void;
    onResetApp: () => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    isEmergency?: boolean;
}> = ({ label, icon, isActive, onClick, isEmergency = false }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200
        ${isEmergency 
            ? 'bg-emergency/10 text-emergency hover:bg-emergency/20'
            : isActive 
                ? 'bg-primary/10 text-primary' 
                : 'text-text-secondary hover:bg-gray-200/50 hover:text-text-primary'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);


const Sidebar: React.FC<SidebarProps> = ({ currentView, navigate, onResetApp }) => {
    const mainNavItems = [
        { view: View.Dashboard, label: "Dashboard", icon: <IconHome /> },
        { view: View.Tagebuch, label: "Symptomtagebuch", icon: <IconTagebuch /> },
        { view: View.Tools, label: "Tools & Übungen", icon: <IconTools /> },
        { view: View.Knowledge, label: "Chatbot", icon: <IconKnowledge /> },
    ];

    const secondaryNavItems = [
         { view: View.Courses, label: "Kurse", icon: <IconCourses /> },
         { view: View.Webinars, label: "Webinare", icon: <IconWebinar /> },
         { view: View.Therapy, label: "1:1 Gespräch", icon: <IconTherapy /> },
    ];
    
    return (
        <aside className="w-64 bg-surface p-4 flex flex-col border-r border-gray-200/80">
            <div className="flex items-center space-x-2 px-2 mb-8">
                 <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                 </div>
                <h1 className="text-xl font-bold text-text-primary">Prototype</h1>
            </div>

            <nav className="flex-1 flex flex-col space-y-1">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menü</p>
                {mainNavItems.map(item => (
                    <NavItem
                        key={item.view}
                        label={item.label}
                        icon={item.icon}
                        isActive={currentView === item.view || (currentView === View.ToolDetail && item.view === View.Tools)}
                        onClick={() => navigate(item.view)}
                    />
                ))}

                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider pt-6 mb-2">Mehr</p>
                 {secondaryNavItems.map(item => (
                    <NavItem
                        key={item.view}
                        label={item.label}
                        icon={item.icon}
                        isActive={currentView === item.view}
                        onClick={() => navigate(item.view)}
                    />
                ))}
            </nav>

            <div className="mt-auto">
                 <NavItem
                    label="Notfall-Hilfe"
                    icon={<IconEmergency />}
                    isActive={currentView === View.Emergency}
                    onClick={() => navigate(View.Emergency)}
                    isEmergency
                />
                 <div className="mt-4 pt-4 border-t border-gray-200/60">
                    <button
                        onClick={onResetApp}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-text-secondary bg-surface-muted hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                        title="Setzt die App zurück und löscht alle lokalen Daten."
                    >
                        <IconReset />
                        <span>App zurücksetzen</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

// SVG Icons
const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const IconEmergency = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const IconTools = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const IconTagebuch = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const IconKnowledge = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconCourses = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconWebinar = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const IconTherapy = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconReset = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m-5.223 1.155a9 9 0 0114.074.885M20 20v-5h-5m5.223-1.155a9 9 0 01-14.074-.885" /></svg>;


export default Sidebar;