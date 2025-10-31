import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { MOOD_OPTIONS } from '../constants';

interface StatsChartProps {
    data: JournalEntry[];
    onDateSelect: (date: string) => void;
}

const StatsChart: React.FC<StatsChartProps> = ({ data, onDateSelect }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full bg-surface-muted rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-text-secondary text-center max-w-xs">
                    Noch nicht genügend Daten vorhanden. <br />
                    Mache einen Eintrag im Symptomtagebuch, um hier deinen Fortschritt zu sehen.
                </p>
            </div>
        );
    }

    const width = 500;
    const height = 200;
    const padding = 30;
    const xMin = padding + 15;
    const xMax = width - padding;
    const yMin = padding;
    const yMax = height - padding;
    
    const numXLabels = data.length === 1 ? 1 : Math.min(data.length, 7);
    const xLabelIndices = Array.from({ length: numXLabels }, (_, i) => {
        if (data.length === 1) return 0;
        return Math.floor(i * (data.length - 1) / (numXLabels - 1));
    });

    const getX = (index: number) => {
        if (data.length === 1) {
            return xMin + (xMax - xMin) / 2; // Center the single point
        }
        return xMin + (index / (data.length - 1)) * (xMax - xMin);
    }
    const getY = (mood: number) => yMax - ((mood - 1) / 4) * (yMax - yMin); // Mood is 1-5

    const pathData = data.length > 1 ? data.map((point, i) => {
        const x = getX(i);
        const y = getY(point.mood);
        return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ') : '';

    const moodLabels = [
        { mood: 5, label: 'Sehr Gut' },
        { mood: 3, label: 'Okay' },
        { mood: 1, label: 'Schlecht' },
    ];
    
    const Tooltip: React.FC<{ index: number }> = ({ index }) => {
        const point = data[index];
        if (!point) return null;

        const x = getX(index);
        const y = getY(point.mood);
        const moodInfo = MOOD_OPTIONS.find(m => m.value === point.mood);
        const date = new Date(point.date + 'T00:00:00').toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
        
        let panicInfo = '';
        if (point.hadPanicAttack) {
            panicInfo = 'Panikattacke';
        } else if (point.hadAnxietySymptoms) {
            panicInfo = 'Angstsymptome';
        }

        const tooltipWidth = 125;
        const tooltipHeight = panicInfo ? 60 : 45;
        const tooltipX = x > width / 2 ? x - tooltipWidth - 10 : x + 10;
        const tooltipY = y - tooltipHeight / 2;

        return (
            <g transform={`translate(${tooltipX}, ${tooltipY})`} style={{ pointerEvents: 'none', animation: 'fadeIn 0.2s ease' }}>
                <rect width={tooltipWidth} height={tooltipHeight} rx="8" ry="8" fill="rgba(31, 41, 55, 0.9)" />
                <text x="10" y="16" fill="white" fontSize="10" fontWeight="bold">{date}</text>
                <text x="10" y="32" fill="white" fontSize="10">{`Stimmung: ${point.mood}/5 (${moodInfo?.label})`}</text>
                {panicInfo && <text x="10" y="48" fill="#F97316" fontSize="9" fontWeight="bold">{panicInfo}</text>}
            </g>
        );
    };

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Y-Axis labels and grid lines */}
            {moodLabels.map(({ mood, label }) => (
                <g key={mood}>
                    <line
                        x1={xMin} y1={getY(mood)}
                        x2={xMax} y2={getY(mood)}
                        stroke="#E5E7EB" // gray-200
                        strokeWidth="1"
                        strokeDasharray="2 4"
                    />
                    <text
                        x={xMin - 8}
                        y={getY(mood)}
                        dy="0.32em"
                        textAnchor="end"
                        fontSize="10"
                        fill="#6B7280" // gray-500
                    >
                        {label}
                    </text>
                </g>
            ))}

            {/* X-Axis labels */}
            {xLabelIndices.map(index => {
                const date = new Date(data[index].date + 'T00:00:00');
                const formattedDate = date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
                return (
                     <text
                        key={index}
                        x={getX(index)}
                        y={height - (padding / 2) + 10}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#6B7280"
                    >
                        {formattedDate}
                    </text>
                )
            })}
           
            {/* Data line */}
            {pathData && <path d={pathData} stroke="#8B5CF6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />}

            {/* Invisible hover areas for better UX */}
            {data.map((_, i) => {
                const x = getX(i);
                const rectWidth = data.length > 1 ? (xMax - xMin) / (data.length - 1) : width;
                const rectX = data.length > 1 ? x - rectWidth / 2 : 0;
                return (
                    <rect
                        key={`hover-${i}`}
                        x={rectX}
                        y={0}
                        width={rectWidth}
                        height={height}
                        fill="transparent"
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => onDateSelect(data[i].date)}
                        className="cursor-pointer"
                    />
                );
            })}

            {/* Data points */}
            {data.map((point, i) => (
                <circle
                    key={i}
                    cx={getX(i)}
                    cy={getY(point.mood)}
                    r={hoveredIndex === i ? 6 : 4}
                    fill="#F9FAFB" // bg-background
                    stroke="#8B5CF6" // primary
                    strokeWidth="2"
                    className="transition-all duration-200"
                />
            ))}

             {/* Tooltip */}
            {hoveredIndex !== null && <Tooltip index={hoveredIndex} />}
        </svg>
    );
};

export default StatsChart;