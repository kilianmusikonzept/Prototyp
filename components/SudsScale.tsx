
import React, { useState } from 'react';

interface SudsScaleProps {
  onSelect: (value: number) => void;
  prompt: string;
}

const SudsScale: React.FC<SudsScaleProps> = ({ onSelect, prompt }) => {
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  const handleSelect = (value: number) => {
    setSelectedValue(value);
    onSelect(value);
  };

  return (
    <div className="p-4 bg-surface-muted rounded-card w-full mx-auto my-2 animate-fade-in">
      <p className="text-center text-text-primary font-medium mb-4">{prompt}</p>
      <div className="flex justify-center space-x-1 md:space-x-1.5">
        {Array.from({ length: 11 }, (_, i) => i).map((value) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={`w-8 h-8 md:w-9 md:h-9 rounded-full text-sm font-bold transition-all duration-200 flex items-center justify-center
              ${selectedValue === value 
                ? 'bg-primary text-white scale-110 shadow-lg' 
                : 'bg-surface text-text-secondary hover:bg-primary/10 border border-gray-200/80'
              }`}
          >
            {value}
          </button>
        ))}
      </div>
       <div className="flex justify-between text-xs text-text-secondary mt-2 px-1">
        <span>Keine</span>
        <span>Maximal</span>
      </div>
    </div>
  );
};

export default SudsScale;
