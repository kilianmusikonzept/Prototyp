import React, { useState, useRef, useEffect } from 'react';
import { Tool, Soundscape } from '../types';
import CalmVisualizer from './CalmVisualizer';

interface AudioExperienceProps {
  tool: Tool;
  onComplete: () => void;
}

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const AudioExperience: React.FC<AudioExperienceProps> = ({ tool, onComplete }) => {
  const mainAudioRef = useRef<HTMLAudioElement>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSoundscape, setActiveSoundscape] = useState<Soundscape | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const mainAudio = mainAudioRef.current;
    if (mainAudio) {
      const setAudioData = () => {
        setDuration(mainAudio.duration);
      };
      const setAudioTime = () => {
        setProgress(mainAudio.currentTime);
      };
      
      mainAudio.addEventListener('loadeddata', setAudioData);
      mainAudio.addEventListener('timeupdate', setAudioTime);
      mainAudio.addEventListener('ended', onComplete);

      return () => {
        mainAudio.removeEventListener('loadeddata', setAudioData);
        mainAudio.removeEventListener('timeupdate', setAudioTime);
        mainAudio.removeEventListener('ended', onComplete);
        mainAudio.pause();
        if (backgroundAudioRef.current) {
            backgroundAudioRef.current.pause();
        }
      };
    }
  }, [onComplete]);

  const togglePlayPause = () => {
    const mainAudio = mainAudioRef.current;
    const backgroundAudio = backgroundAudioRef.current;
    if (!mainAudio) return;

    if (isPlaying) {
      mainAudio.pause();
      backgroundAudio?.pause();
    } else {
      mainAudio.play().catch(e => console.error("Error playing main audio:", e));
      if (backgroundAudio?.src) {
        backgroundAudio.play().catch(e => console.error("Error playing background audio:", e));
      }
    }
    setIsPlaying(!isPlaying);
  };
  
  const selectSoundscape = (soundscape: Soundscape) => {
    const backgroundAudio = backgroundAudioRef.current;
    if (!backgroundAudio) return;

    if (activeSoundscape?.id === soundscape.id) {
        // Deselect
        setActiveSoundscape(null);
        backgroundAudio.pause();
        backgroundAudio.src = '';
    } else {
        setActiveSoundscape(soundscape);
        backgroundAudio.src = soundscape.src;
        backgroundAudio.loop = true;
        if (isPlaying) {
            backgroundAudio.play().catch(e => console.error("Error playing background audio on select:", e));
        }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (mainAudioRef.current) {
      mainAudioRef.current.currentTime = Number(e.target.value);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-4 bg-surface-muted rounded-card">
        {/* Hidden audio elements */}
        <audio ref={mainAudioRef} src={tool.audioSrc} preload="auto"></audio>
        <audio ref={backgroundAudioRef}></audio>

        <CalmVisualizer isPlaying={isPlaying} />

        <div className="my-4 w-full max-w-md">
            <h4 className="text-center font-semibold text-text-primary mb-3">Optionale Geräuschkulisse</h4>
            <div className="flex justify-center gap-3">
                {tool.soundscapes?.map(sc => (
                    <button 
                        key={sc.id}
                        onClick={() => selectSoundscape(sc)}
                        className={`flex flex-col items-center p-3 w-24 rounded-lg border-2 transition-all ${
                            activeSoundscape?.id === sc.id ? 'border-primary bg-primary/10' : 'border-transparent bg-surface hover:bg-gray-200'
                        }`}
                        aria-pressed={activeSoundscape?.id === sc.id}
                    >
                        <span className="text-2xl">{sc.icon}</span>
                        <span className="text-xs font-semibold mt-1">{sc.name}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-4 w-full max-w-md flex flex-col items-center">
             <div className="w-full flex items-center gap-3">
                <span className="text-xs font-mono text-text-secondary">{formatTime(progress)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={progress}
                    onChange={handleProgressChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-label="Fortschritt der Übung"
                />
                <span className="text-xs font-mono text-text-secondary">{formatTime(duration)}</span>
            </div>

            <button 
                onClick={togglePlayPause}
                className="mt-6 bg-primary text-primary-content w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-focus transition-all transform hover:scale-110"
                aria-label={isPlaying ? "Pause" : "Start"}
            >
                {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
            </button>
        </div>
    </div>
  );
};

export default AudioExperience;
