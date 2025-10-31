import React, { useState, useEffect } from 'react';

interface TimerProps {
  durationInSeconds: number;
  onComplete: () => void;
}

const Timer: React.FC<TimerProps> = ({ durationInSeconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);

  useEffect(() => {
    // Set up a single, stable interval.
    const intervalId = setInterval(() => {
      setTimeLeft(prevTimeLeft => {
        // When the countdown reaches 1, we clear the interval and call onComplete.
        if (prevTimeLeft <= 1) {
          clearInterval(intervalId);
          onComplete();
          return 0;
        }
        // Otherwise, just decrement.
        return prevTimeLeft - 1;
      });
    }, 1000);

    // Clean up the interval when the component unmounts.
    return () => clearInterval(intervalId);
  }, [durationInSeconds, onComplete]); // Rerun only if the core props change.

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-2xl font-mono font-bold text-primary p-2 bg-primary/10 rounded-button">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

export default Timer;
