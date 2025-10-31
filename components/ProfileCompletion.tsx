import React, { useState, useEffect } from 'react';
import { UserData } from '../types';
import { SYMPTOM_OPTIONS } from '../constants';

interface ProfileCompletionProps {
  onComplete: () => void;
  onBack: () => void;
}

const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
    const progressPercentage = (current / total) * 100;
    return (
        <div className="w-full bg-surface-muted rounded-full h-1.5 mb-8">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
    );
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ onComplete, onBack }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Omit<UserData, 'name' | 'age' | 'gender' | 'country' | 'disorder'>>({
        symptomDuration: '',
        symptoms: [] as string[],
        customSymptoms: [] as string[],
        symptomComment: '',
        avoidedSituations: '',
        safetyBehaviors: '',
        anxietyAmplifiers: [] as string[],
        avgSleep: '',
        triggersComment: '',
        medicalCardio: '',
        medicalThyroid: '',
        medicalRespiratory: '',
        medicalNeuro: '',
        medicalSubstances: '',
        medicalTherapy: '',
        medicalReportName: '',
    });
    const [showCrisisAlert, setShowCrisisAlert] = useState(false);
    const [combinedSymptomOptions, setCombinedSymptomOptions] = useState<string[]>(SYMPTOM_OPTIONS);

    useEffect(() => {
        const existingData = JSON.parse(localStorage.getItem('prototype_user_data') || '{}');
        setFormData(prev => ({ ...prev, ...existingData }));
        
        const customSymptoms = existingData.customSymptoms || [];
        // Ensure no duplicates
        setCombinedSymptomOptions([...new Set([...SYMPTOM_OPTIONS, ...customSymptoms])]);
    }, []);


    const totalSteps = 6;

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSelect = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, medicalReportName: e.target.files![0].name }));
        }
    };
    
    const handleSymptomToggle = (symptom: string) => {
        setFormData(prev => {
            const newSymptoms = prev.symptoms?.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...(prev.symptoms || []), symptom];
            return { ...prev, symptoms: newSymptoms };
        });
    };
    
    const handleAmplifierToggle = (amplifier: string) => {
        setFormData(prev => {
            const newAmplifiers = prev.anxietyAmplifiers?.includes(amplifier)
                ? prev.anxietyAmplifiers.filter(a => a !== amplifier)
                : [...(prev.anxietyAmplifiers || []), amplifier];
            return { ...prev, anxietyAmplifiers: newAmplifiers };
        });
    };

    const handleCrisisResponse = () => {
        setShowCrisisAlert(true);
    };

    const handleSubmit = () => {
        const existingData = JSON.parse(localStorage.getItem('prototype_user_data') || '{}');
        const completeData = { ...existingData, ...formData };
        console.log("Profile completion data:", completeData);
        localStorage.setItem('prototype_user_data', JSON.stringify(completeData));
        onComplete();
    };
    
    if (showCrisisAlert) {
        return (
            <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4 font-sans">
                 <div className="w-full max-w-md mx-auto text-center bg-surface p-6 sm:p-8 rounded-box shadow-xl border-t-4 border-emergency">
                     <h1 className="text-2xl font-bold text-emergency mb-4">Deine Sicherheit ist das Wichtigste</h1>
                     <p className="text-text-secondary mb-6">
                         Es ist mutig, dass du das teilst. Bitte zögere nicht, dir sofort professionelle Hilfe zu suchen. Du musst das nicht alleine durchstehen.
                     </p>
                     <div className="text-left bg-emergency-light p-4 rounded-card space-y-3">
                         <p className="font-bold text-emergency-dark">Hier erreichst du jederzeit jemanden:</p>
                         <p><strong>Telefonseelsorge:</strong> <a href="tel:08001110111" className="font-semibold underline text-primary">0800 111 0 111</a></p>
                         <p><strong>Ärztlicher Dienst:</strong> <a href="tel:116117" className="font-semibold underline text-primary">116 117</a></p>
                         <p><strong>Im Notfall:</strong> <a href="tel:112" className="font-semibold underline text-primary">112</a></p>
                     </div>
                     <p className="text-xs text-gray-500 mt-6">
                        Der Fragebogen wurde beendet. Deine Antworten wurden nicht gespeichert.
                     </p>
                </div>
            </div>
        );
    }

    const renderStepContent = () => {
        switch (step) {
            case 1:
                const durationOptions = ['Weniger als ein Monat', '1-6 Monate', '6-12 Monate', 'Länger als ein Jahr'];
                return (
                     <div className="animate-fade-in text-left">
                        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Seit wann bestehen deine Beschwerden ungefähr?</h2>
                        <div className="space-y-3">
                            {durationOptions.map(opt => (
                                 <button
                                    key={opt}
                                    onClick={() => { handleSelect('symptomDuration', opt); nextStep(); }}
                                    className={`w-full p-4 border-2 rounded-card font-semibold transition-all text-left text-text-primary ${formData.symptomDuration === opt ? 'border-primary bg-primary/5' : 'border-gray-200 bg-surface hover:border-primary/50'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="animate-fade-in text-center">
                        <h2 className="text-2xl font-bold text-text-primary mb-2">Eine wichtige Frage</h2>
                        <p className="text-md text-text-secondary mb-8">Hast du aktuell Gedanken an Selbstverletzung oder Suizid?</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleCrisisResponse} 
                                className="w-full bg-emergency text-white font-bold py-3 px-6 rounded-button text-lg hover:bg-rose-700 transition-colors"
                            >
                                Ja
                            </button>
                            <button 
                                onClick={nextStep} 
                                className="w-full bg-surface-muted text-text-primary font-bold py-3 px-6 rounded-button text-lg hover:bg-gray-200 transition-colors"
                            >
                                Nein
                            </button>
                        </div>
                    </div>
                );
             case 3:
                 return (
                    <div className="animate-fade-in text-left w-full">
                        <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">Welche Symptome erlebst du?</h2>
                        <p className="text-md text-text-secondary mb-6 text-center">Wähle alle zutreffenden Punkte aus.</p>
                        <div className="space-y-3 mb-6">
                             {combinedSymptomOptions.map(symptom => (
                                <div
                                    key={symptom}
                                    onClick={() => handleSymptomToggle(symptom)}
                                    className={`p-4 border-2 rounded-card transition-all cursor-pointer flex items-center justify-between ${
                                        formData.symptoms?.includes(symptom) ? 'border-primary bg-primary/5' : 'border-gray-200 bg-surface hover:border-primary/50'
                                    }`}
                                >
                                    <span className="font-medium text-text-primary">{symptom}</span>
                                     <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${formData.symptoms?.includes(symptom) ? 'bg-primary' : 'border-2 border-gray-300'}`}>
                                        {formData.symptoms?.includes(symptom) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">Weitere Symptome (optional)</h3>
                         <textarea name="symptomComment" value={formData.symptomComment} onChange={handleInputChange} rows={3} placeholder="Beschreibe hier andere Symptome..."
                            className="w-full p-3 border border-gray-300 rounded-button bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                         <button onClick={nextStep} className="w-full mt-8 bg-primary text-primary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-primary-focus">
                            Weiter
                        </button>
                    </div>
                );
            case 4:
                const amplifierOptions = ['Stress', 'Schlafmangel', 'Koffein', 'Alkohol', 'Anstrengung', 'Enge Räume'];
                const sleepOptions = ['< 5 Stunden', '5-6 Stunden', '7-8 Stunden', '> 8 Stunden'];
                return (
                    <div className="animate-fade-in text-left w-full overflow-y-auto" style={{maxHeight: '70vh'}}>
                        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Erzähl uns etwas über deine Auslöser</h2>
                        
                        <div className="mb-6">
                            <label className="font-semibold text-text-primary mb-2 block">Gibt es Situationen, die du vermeidest?</label>
                            <input type="text" name="avoidedSituations" value={formData.avoidedSituations} onChange={handleInputChange} placeholder="z.B. Menschenmengen, Fahrstuhl..."
                                className="w-full p-3 border border-gray-300 rounded-button bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>

                         <div className="mb-6">
                            <label className="font-semibold text-text-primary mb-2 block">Was gibt dir Sicherheit?</label>
                            <input type="text" name="safetyBehaviors" value={formData.safetyBehaviors} onChange={handleInputChange} placeholder="z.B. Wasserflasche, Begleitperson..."
                                className="w-full p-3 border border-gray-300 rounded-button bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>

                        <div className="mb-6">
                            <label className="font-semibold text-text-primary mb-2 block">Was verstärkt deine Angst?</label>
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {amplifierOptions.map(item => (
                                    <div key={item} onClick={() => handleAmplifierToggle(item)}
                                        className={`p-3 border-2 rounded-card text-sm text-center font-medium transition-all cursor-pointer ${
                                            formData.anxietyAmplifiers?.includes(item) ? 'border-primary bg-primary/5 text-primary' : 'bg-surface text-text-secondary hover:border-gray-300'
                                        }`}>{item}</div>
                                ))}
                            </div>
                        </div>

                         <div className="mb-6">
                            <label className="font-semibold text-text-primary mb-2 block">Wie viele Stunden schläfst du im Schnitt?</label>
                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {sleepOptions.map(item => (
                                    <div key={item} onClick={() => handleSelect('avgSleep', item)}
                                        className={`p-3 border-2 rounded-card text-sm text-center font-medium transition-all cursor-pointer ${
                                            formData.avgSleep === item ? 'border-primary bg-primary/5 text-primary' : 'bg-surface text-text-secondary hover:border-gray-300'
                                        }`}>{item}</div>
                                ))}
                            </div>
                        </div>
                        <button onClick={nextStep} className="w-full mt-2 bg-primary text-primary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-primary-focus">
                            Weiter
                        </button>
                    </div>
                );
             case 5:
                const MedicalField: React.FC<{name: keyof Omit<UserData, 'customSymptoms' | 'symptoms' | 'anxietyAmplifiers'>, label: string, placeholder: string}> = ({name, label, placeholder}) => (
                    <div className="mb-4">
                        <label className="font-semibold text-text-primary mb-1 block text-sm">{label}</label>
                        <textarea name={name} value={formData[name] as string} onChange={handleInputChange} rows={2} placeholder={placeholder}
                            className="w-full p-2 border border-gray-300 rounded-button bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm" />
                    </div>
                );
                return (
                     <div className="animate-fade-in text-left w-full overflow-y-auto" style={{maxHeight: '70vh'}}>
                        <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">Medizinische Abklärung (Optional)</h2>
                        <p className="text-sm text-text-secondary mb-6 text-center">Angaben zu ärztlichen Abklärungen helfen Prototype, deine Situation besser zu verstehen.</p>
                        
                        <MedicalField name="medicalCardio" label="Herz / Kreislauf" placeholder="z.B. EKG, Blutdruck..." />
                        <MedicalField name="medicalThyroid" label="Schilddrüse / Stoffwechsel" placeholder="z.B. TSH-Wert, Hormonstörungen..." />
                        <MedicalField name="medicalRespiratory" label="Atmung" placeholder="z.B. Asthma, Allergien..." />
                        <MedicalField name="medicalNeuro" label="Neurologie" placeholder="z.B. Schwindelursache, Migräne..." />
                        <MedicalField name="medicalTherapy" label="Therapie / Medikamente" placeholder="z.B. Verhaltenstherapie, Antidepressiva..." />

                        <div className="mt-4">
                            <label className="font-semibold text-text-primary mb-2 block text-sm">Ärztlichen Befund hochladen</label>
                            <label htmlFor="file-upload" className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-card cursor-pointer bg-surface-muted hover:bg-gray-200">
                                <svg className="w-6 h-6 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                <span className="text-sm text-gray-600">{formData.medicalReportName ? formData.medicalReportName : 'PDF-Datei auswählen'}</span>
                            </label>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf" />
                        </div>
                        <button onClick={nextStep} className="w-full mt-8 bg-primary text-primary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-primary-focus">
                            Weiter
                        </button>
                    </div>
                );
            case 6:
                 return (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">Profil vervollständigt!</h2>
                        <p className="text-md text-text-secondary mb-6">Vielen Dank für deine Angaben. Prototype ist jetzt optimal auf dich eingestellt.</p>
                        <button onClick={handleSubmit} className="w-full bg-secondary text-secondary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-secondary-focus transition-transform transform hover:scale-105">
                            Zum Dashboard
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center p-4 font-sans">
             <div className="w-full max-w-md mx-auto text-center bg-surface p-6 sm:p-8 rounded-box shadow-xl border border-gray-200/80">
                 <ProgressBar current={step} total={totalSteps} />
                 {renderStepContent()}
                 <div className="mt-6 flex justify-center items-center space-x-4">
                    {step > 1 && step < totalSteps && (
                         <button onClick={prevStep} className="text-sm text-gray-500 hover:underline">
                             Zurück
                         </button>
                     )}
                     <button onClick={onBack} className="text-sm text-gray-500 hover:underline">
                         Später vervollständigen
                     </button>
                 </div>
            </div>
        </div>
    );
};

export default ProfileCompletion;