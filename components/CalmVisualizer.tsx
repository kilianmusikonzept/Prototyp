import React from 'react';

const CalmVisualizer: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 h-56">
      <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
        <div 
          className="absolute w-full h-full bg-primary/10 rounded-full"
          style={{ 
            animation: isPlaying ? 'pulse 6s ease-in-out infinite' : 'none',
            animationDelay: '0s'
          }}
        ></div>
        <div 
          className="absolute w-3/4 h-3/4 bg-primary/20 rounded-full"
          style={{ 
            animation: isPlaying ? 'pulse 6s ease-in-out infinite' : 'none',
            animationDelay: '2s'
          }}
        ></div>
        <div 
          className="absolute w-1/2 h-1/2 bg-primary/30 rounded-full"
          style={{ 
            animation: isPlaying ? 'pulse 6s ease-in-out infinite' : 'none',
            animationDelay: '4s'
          }}
        ></div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CalmVisualizer;