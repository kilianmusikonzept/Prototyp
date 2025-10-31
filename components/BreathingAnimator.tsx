
import React, { useState, useEffect } from 'react';

const BreathingAnimator: React.FC = () => {
  const [text, setText] = useState("Bereit machen...");
  const cycleTime = 8000; // 4s in, 4s out to simplify animation sync

  useEffect(() => {
    const cycle = () => {
      setText("Einatmen");
      setTimeout(() => {
        setText("Ausatmen");
      }, cycleTime / 2);
    };

    const timeoutId = setTimeout(() => {
        cycle();
        const intervalId = setInterval(cycle, cycleTime);
        return () => clearInterval(intervalId);
    }, 1000); // Initial delay
    
    return () => clearTimeout(timeoutId);

  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
        <div className="absolute w-full h-full bg-primary/20 rounded-full animate-breather"></div>
        <div className="absolute w-full h-full bg-primary/30 rounded-full animate-breather" style={{animationDelay: '4s'}}></div>
        <div className="relative w-32 h-32 bg-surface rounded-full flex items-center justify-center shadow-lg border border-gray-200/50">
            <span className="text-xl font-semibold text-primary z-10">{text}</span>
        </div>
      </div>
    </div>
  );
};

export default BreathingAnimator;
