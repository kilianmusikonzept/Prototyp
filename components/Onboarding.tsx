
import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
    const progressPercentage = (current / total) * 100;
    return (
        <div className="w-full bg-surface-muted rounded-full h-1.5 mb-8">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
    );
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        disorder: '',
        name: '',
        age: '',
        gender: '',
        country: 'DE',
    });

    const totalSteps = 7;

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSelect = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    const handleSubmit = () => {
        console.log("Initial onboarding data:", formData);
        localStorage.setItem('prototype_user_data', JSON.stringify(formData));
        onComplete();
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="animate-fade-in">
                        <h1 className="text-3xl font-bold text-primary mb-4">Willkommen bei Prototype</h1>
                        <p className="text-base text-text-secondary mb-8">Dein Begleiter für mehr Ruhe und Gelassenheit im Alltag. Lass uns gemeinsam den ersten Schritt machen.</p>
                        <button onClick={nextStep} className="w-full bg-primary text-primary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-primary-focus transition-all transform hover:scale-105">
                            Los geht's
                        </button>
                    </div>
                );
            case 2:
                const disorderOptions = [
                    { id: 'anxiety', label: 'Angst & Panikstörung' },
                    { id: 'depression', label: 'Depression', disabled: true },
                    { id: 'stress', label: 'Stress & Burnout', disabled: true },
                ];
                return (
                    <div className="animate-fade-in text-left">
                        <h2 className="text-2xl font-bold text-text-primary mb-2 text-center">Wobei können wir dir helfen?</h2>
                        <p className="text-md text-text-secondary mb-6 text-center">Wähle den Bereich aus, der am besten auf dich zutrifft.</p>
                        <div className="space-y-3">
                            {disorderOptions.map(opt => (
                                <div
                                    key={opt.id}
                                    onClick={() => !opt.disabled && handleSelect('disorder', opt.id)}
                                    className={`p-4 border-2 rounded-card transition-all ${
                                        formData.disorder === opt.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 bg-surface'
                                    } ${
                                        opt.disabled
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'cursor-pointer hover:border-primary/50'
                                    }`}
                                >
                                    <span className="font-semibold text-text-primary">{opt.label}</span>
                                    {opt.disabled && <span className="text-xs ml-2 bg-gray-200 text-text-secondary px-2 py-0.5 rounded-full">Bald verfügbar</span>}
                                </div>
                            ))}
                        </div>
                         <button onClick={nextStep} disabled={!formData.disorder} className="w-full mt-8 bg-primary text-primary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-primary-focus disabled:bg-gray-300 disabled:cursor-not-allowed transition-transform transform hover:scale-105">
                            Weiter
                        </button>
                    </div>
                );
            case 3:
                 return (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-text-primary mb-2">Wie möchtest du angesprochen werden?</h2>
                        <p className="text-md text-text-secondary mb-6">Du kannst deinen Vornamen oder einen Spitznamen verwenden. (Optional)</p>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Dein Name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-button bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button onClick={nextStep} className="w-full mt-8 bg-primary text-primary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-primary-focus">
                            Weiter
                        </button>
                    </div>
                );
            case 4:
                return (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Wie alt bist du?</h2>
                         <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            placeholder="z.B. 28"
                            className="w-full px-4 py-3 border border-gray-300 rounded-button bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button onClick={nextStep} disabled={!formData.age || parseInt(formData.age) <= 0} className="w-full mt-8 bg-primary text-primary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-primary-focus disabled:bg-gray-300">
                            Weiter
                        </button>
                    </div>
                );
            case 5:
                const genderOptions = ['Weiblich', 'Männlich'];
                return (
                     <div className="animate-fade-in text-left">
                        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Als was identifizierst du dich?</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {genderOptions.map(opt => (
                                 <button
                                    key={opt}
                                    onClick={() => { handleSelect('gender', opt); nextStep(); }}
                                    className={`p-4 border-2 rounded-card font-semibold transition-all text-center text-text-primary ${formData.gender === opt ? 'border-primary bg-primary/5' : 'border-gray-200 bg-surface hover:border-primary/50'}`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="animate-fade-in">
                        <h2 className="text-2xl font-bold text-text-primary mb-2">In welchem Land lebst du?</h2>
                        <p className="text-md text-text-secondary mb-6">Dies hilft uns, dir die richtigen Notfallnummern anzuzeigen.</p>
                         <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-button bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="DE">Deutschland</option>
                            <option value="AT">Österreich</option>
                            <option value="CH">Schweiz</option>
                            <option value="OTHER">Anderes Land</option>
                         </select>
                        <button onClick={nextStep} className="w-full mt-8 bg-primary text-primary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-primary-focus">
                            Weiter
                        </button>
                    </div>
                );
            case 7:
                 return (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-bold text-text-primary mb-2">Vielen Dank!</h2>
                        <p className="text-md text-text-secondary mb-6">Die Grundeinrichtung ist abgeschlossen. Du kannst jetzt mit Prototype starten.</p>
                        <button onClick={handleSubmit} className="w-full bg-secondary text-secondary-content font-bold py-3 px-6 rounded-button text-lg hover:bg-secondary-focus transition-transform transform hover:scale-105">
                            App starten
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
                 {step > 1 && step < totalSteps && <ProgressBar current={step-1} total={totalSteps-2} />}
                 {renderStepContent()}
                 {step > 2 && step < totalSteps && (
                     <button onClick={prevStep} className="mt-6 text-sm text-gray-500 hover:underline">
                         Zurück
                     </button>
                 )}
            </div>
        </div>
    );
};

export default Onboarding;