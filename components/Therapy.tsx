
import React, { useState, useEffect } from 'react';
import { Therapist } from '../types';
import { getTherapists } from '../services/mockApi';

const TherapistCard: React.FC<{ therapist: Therapist }> = ({ therapist }) => (
    <div className="bg-surface rounded-card shadow-card border border-gray-200/80 p-4 flex items-start gap-4 animate-fade-in transition-all hover:shadow-card-hover">
        <img src={therapist.imageUrl} alt={therapist.name} className="w-20 h-20 rounded-full object-cover border-4 border-primary/10" />
        <div className="flex-1">
            <h3 className="text-base font-bold text-text-primary">{therapist.name}</h3>
            <p className="text-sm font-semibold text-primary">{therapist.specialty}</p>
            <p className="text-sm text-text-secondary my-2 leading-relaxed">{therapist.bio}</p>
             <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-text-primary">{therapist.price}</span>
                <button className="bg-secondary text-secondary-content px-4 py-2 text-sm font-semibold rounded-button hover:bg-secondary-focus transition-colors">
                    Sitzung buchen
                </button>
            </div>
        </div>
    </div>
);

const Therapy: React.FC = () => {
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTherapists = async () => {
            const data = await getTherapists();
            setTherapists(data);
            setIsLoading(false);
        };
        fetchTherapists();
    }, []);

    return (
         <div className="p-4 md:p-6">
            <h2 className="text-2xl font-bold text-text-primary mb-1">1:1 Gespräche</h2>
            <p className="text-text-secondary mb-6">Finde professionelle Unterstützung für deinen Weg.</p>
            {isLoading ? (
                <p className="text-text-secondary">Lade Therapeuten...</p>
            ) : (
                <div className="space-y-4">
                    {therapists.map(therapist => <TherapistCard key={therapist.id} therapist={therapist} />)}
                </div>
            )}
        </div>
    );
};

export default Therapy;
