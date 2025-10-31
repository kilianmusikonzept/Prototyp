import React from 'react';
import { WEBINARS } from '../constants';
import { Webinar } from '../types';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) + ' Uhr';
};

const getMonthName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', { month: 'long' }).toUpperCase();
}

const UpcomingWebinar: React.FC<{ webinar: Webinar }> = ({ webinar }) => (
    <div className="bg-surface rounded-card shadow-card border border-gray-200/80 overflow-hidden flex flex-col md:flex-row animate-fade-in">
        <div className="md:w-1/3">
            <img src={webinar.speakerImage} alt={webinar.speaker} className="w-full h-48 md:h-full object-cover" />
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
                 <span className="inline-block bg-accent/10 text-accent font-bold text-xs px-3 py-1 rounded-full mb-3 tracking-wider">
                    LIVE IM {getMonthName(webinar.date)}
                 </span>
                <h3 className="text-2xl font-bold text-text-primary mb-2">{webinar.title}</h3>
                <p className="font-semibold text-primary mb-2">mit {webinar.speaker}</p>
                <p className="text-sm font-semibold text-text-secondary mb-4">{formatDate(webinar.date)}</p>
                <p className="text-text-secondary leading-relaxed">{webinar.description}</p>
            </div>
            <button className="w-full md:w-auto mt-6 bg-secondary text-secondary-content px-6 py-3 text-base font-bold rounded-button hover:bg-secondary-focus transition-colors self-start">
                Jetzt kostenlos anmelden
            </button>
        </div>
    </div>
);

const PastWebinarCard: React.FC<{ webinar: Webinar }> = ({ webinar }) => (
    <div className="bg-surface rounded-card shadow-card border border-gray-200/80 p-5 flex flex-col animate-fade-in">
        <h4 className="font-bold text-text-primary flex-grow">{webinar.title}</h4>
        <p className="text-sm text-text-secondary mt-1">mit {webinar.speaker}</p>
        <p className="text-xs text-text-secondary mt-2 mb-4">{new Date(webinar.date).toLocaleDateString('de-DE', { year: 'numeric', month: 'long' })}</p>
        <button 
            disabled={!webinar.recordingUrl || webinar.recordingUrl === '#'}
            className="w-full bg-surface-muted text-text-primary px-4 py-2 text-sm font-semibold rounded-button hover:bg-gray-200/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Aufzeichnung ansehen
        </button>
    </div>
);


const Webinars: React.FC = () => {
    const liveWebinar = WEBINARS.find(w => w.isLive);
    const pastWebinars = WEBINARS.filter(w => !w.isLive);

    return (
        <div className="p-4 md:p-6 animate-fade-in h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-text-primary mb-1">Live-Webinare & Aufzeichnungen</h2>
            <p className="text-text-secondary mb-6">Nimm live an Experten-Vorträgen teil oder schau dir vergangene Webinare an.</p>
            
            {liveWebinar && (
                <section className="mb-10">
                    <h3 className="text-xl font-bold text-primary mb-4">Nächstes Live-Event</h3>
                    <UpcomingWebinar webinar={liveWebinar} />
                </section>
            )}

            <section>
                <h3 className="text-xl font-bold text-primary mb-4">Archiv</h3>
                 {pastWebinars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pastWebinars.map(webinar => <PastWebinarCard key={webinar.id} webinar={webinar} />)}
                    </div>
                ) : (
                     <p className="text-text-secondary">Das Archiv wird bald gefüllt.</p>
                )}
            </section>
        </div>
    );
};

export default Webinars;