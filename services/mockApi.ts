

import { Context, TimeWindow, Tool, SessionLog, Tag, Course, Therapist, JournalEntry } from '../types';
import { TOOLS, COURSES, THERAPISTS } from '../constants';

// In a real app, this would be on a server. We simulate it here.
let tagWeights: { [key in Tag]: number } = {
  [Tag.Panikattacke]: 1,
  [Tag.Exposition]: 1,
  [Tag.Atemtraining]: 1,
  [Tag.Vermeidung]: 1,
  [Tag.SUDS]: 1,
  [Tag.Schlaf]: 1,
  [Tag.Koerperfokus]: 1,
};

const simulateDelay = <T,>(data: T, delay: number = 300): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const getRecommendations = (context: Context, time: TimeWindow, maxItems: number = 3): Promise<Tool[]> => {
  const suitableTools = TOOLS.filter(tool => 
    tool.contexts.includes(context) && tool.duration <= time
  );

  // Simple scoring based on tag weights
  const scoredTools = suitableTools.map(tool => {
    const score = tool.tags.reduce((acc, tag) => acc + (tagWeights[tag] || 1), 0);
    return { ...tool, score };
  }).sort((a, b) => b.score - a.score);

  return simulateDelay(scoredTools.slice(0, maxItems));
};

export const logSession = (log: Omit<SessionLog, 'id' | 'date'>): Promise<SessionLog> => {
  const newLog: SessionLog = {
    ...log,
    id: Date.now().toString(),
    date: new Date(),
  };
  console.log("Session logged:", newLog);
  return simulateDelay(newLog);
};

export const updateTags = (tool: Tool, delta: number): Promise<void> => {
  if (delta > 0.25) { // SUDS improvement > 25%
    tool.tags.forEach(tag => {
      tagWeights[tag] = (tagWeights[tag] || 1) * 1.1; // Increase weight by 10%
    });
    console.log("Tags updated:", tagWeights);
  }
  return simulateDelay(undefined, 100);
};

export const getToolById = (id: string): Promise<Tool | undefined> => {
    return simulateDelay(TOOLS.find(t => t.id === id));
}

export const getCourses = (): Promise<Course[]> => {
    return simulateDelay(COURSES);
}

export const getTherapists = (): Promise<Therapist[]> => {
    return simulateDelay(THERAPISTS);
}

export const logExerciseAsCompleted = (toolId: string): Promise<void> => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const storedEntriesRaw = localStorage.getItem('prototype_journal_entries');
      let entries: JournalEntry[] = storedEntriesRaw ? JSON.parse(storedEntriesRaw) : [];
      
      let todayEntry = entries.find(e => e.date === todayStr);

      if (todayEntry) {
        if (!todayEntry.completedExercises) {
            todayEntry.completedExercises = [];
        }
        if (!todayEntry.completedExercises.includes(toolId)) {
          todayEntry.completedExercises.push(toolId);
        }
      } else {
        // No entry for today, create a partial one
        const newEntry: JournalEntry = {
          id: Date.now().toString(),
          date: todayStr,
          mood: 3, // Default mood: Okay
          notes: '',
          hadAnxietySymptoms: false,
          hadPanicAttack: null,
          panicSymptoms: [],
          panicSymptomComment: '',
          plannedExercises: [toolId], // Sensible default: if completed, it was planned
          completedExercises: [toolId],
        };
        entries.push(newEntry);
      }
      
      localStorage.setItem('prototype_journal_entries', JSON.stringify(entries));
      window.dispatchEvent(new Event('storage')); // Notify other components
      console.log(`Exercise ${toolId} logged as completed for ${todayStr}.`);

    } catch (error) {
      console.error("Failed to log completed exercise in journal:", error);
    }
    return simulateDelay(undefined, 50);
};

export const toggleDashboardExerciseCompletion = (exerciseId: string): Promise<void> => {
    try {
        const todayStr = new Date().toISOString().split('T')[0];
        const storedEntriesRaw = localStorage.getItem('prototype_journal_entries');
        let entries: JournalEntry[] = storedEntriesRaw ? JSON.parse(storedEntriesRaw) : [];
        
        let todayEntry = entries.find(e => e.date === todayStr);

        if (todayEntry) {
            let completed = todayEntry.completedExercises || [];
            const isCurrentlyCompleted = completed.includes(exerciseId);

            if (isCurrentlyCompleted) {
                todayEntry.completedExercises = completed.filter(id => id !== exerciseId);
            } else {
                todayEntry.completedExercises.push(exerciseId);
            }
            
            localStorage.setItem('prototype_journal_entries', JSON.stringify(entries));
            window.dispatchEvent(new Event('storage')); // Notify other components
            console.log(`Toggled completion for exercise ${exerciseId} to ${!isCurrentlyCompleted}`);
        } else {
            console.warn("Could not toggle exercise completion: No journal entry for today.");
        }
    } catch (error) {
        console.error("Failed to toggle dashboard exercise completion:", error);
    }
    return simulateDelay(undefined, 50);
};