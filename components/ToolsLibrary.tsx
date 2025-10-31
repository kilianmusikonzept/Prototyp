import React from 'react';
import { TOOLS } from '../constants';
import { View, Tool, ToolCategory } from '../types';

const CATEGORY_CONFIG: Record<ToolCategory, { name: string; icon: string; description: string }> = {
  [ToolCategory.Beruhigen]: {
    name: 'Beruhigen',
    icon: '🕊️',
    description: 'Wenn du dein Nervensystem herunterfahren und zur Ruhe kommen möchtest.',
  },
  [ToolCategory.Fokussieren]: {
    name: 'Fokussieren',
    icon: '🎯',
    description: 'Wenn du Klarheit, Orientierung und einen Weg aus dem Gedankenkarussell suchst.',
  },
  [ToolCategory.Staerken]: {
    name: 'Stärken',
    icon: '💪',
    description: 'Wenn du Selbstwirksamkeit aufbauen und dein Vertrauen stärken möchtest.',
  },
  [ToolCategory.Verstehen]: {
    name: 'Verstehen',
    icon: '💡',
    description: 'Wenn du verstehen möchtest, was in deinem Körper passiert und warum du sicher bist.',
  },
};

const getCategoryStyles = (category: ToolCategory) => {
    switch (category) {
        case ToolCategory.Beruhigen: return { border: 'border-blue-500', text: 'text-blue-500' };
        case ToolCategory.Fokussieren: return { border: 'border-primary', text: 'text-primary' }; // Re-use primary color
        case ToolCategory.Staerken: return { border: 'border-green-500', text: 'text-green-500' };
        case ToolCategory.Verstehen: return { border: 'border-yellow-500', text: 'text-yellow-500' };
        default: return { border: 'border-gray-500', text: 'text-gray-500' };
    }
}

interface ToolsLibraryProps {
  navigate: (view: View, params?: { toolId?: string }) => void;
}

const ToolCard: React.FC<{ tool: Tool; onSelect: () => void }> = ({ tool, onSelect }) => {
    const categoryConfig = CATEGORY_CONFIG[tool.category];
    const categoryStyles = getCategoryStyles(tool.category);

    return (
        <div className="bg-surface p-5 rounded-card shadow-card border border-gray-200/80 flex flex-col justify-between animate-fade-in transition-all hover:shadow-card-hover hover:-translate-y-1">
            <div>
                <h3 className="font-bold text-text-primary text-base">{tool.title}</h3>
                <p className="text-sm text-text-secondary my-2">{tool.description}</p>
            </div>
            <div className="flex flex-col mt-4">
                 <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                    <span className="font-medium bg-surface-muted px-2 py-1 rounded-full">⏱️ {tool.duration} Min.</span>
                    <span className={`font-semibold ${categoryStyles.text}`}>{categoryConfig.icon} {tool.category}</span>
                </div>
                 <p className="text-center text-sm font-semibold text-text-primary mb-3">{tool.subtitle}</p>
                <button onClick={onSelect} className="w-full bg-primary text-primary-content px-4 py-2 text-sm font-semibold rounded-button hover:bg-primary-focus transition-colors">
                    Starten
                </button>
            </div>
        </div>
    );
};

const ToolsLibrary: React.FC<ToolsLibraryProps> = ({ navigate }) => {
  const toolsByCategory = TOOLS.reduce((acc, tool) => {
      const category = tool.category;
      if (!acc[category]) {
          acc[category] = [];
      }
      acc[category].push(tool);
      return acc;
  }, {} as Record<ToolCategory, Tool[]>);

  const categoryOrder: ToolCategory[] = [ToolCategory.Beruhigen, ToolCategory.Fokussieren, ToolCategory.Staerken, ToolCategory.Verstehen];

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold text-text-primary mb-1">Tool-Bibliothek</h2>
      <p className="text-text-secondary mb-6">Was brauchst du gerade in diesem Moment?</p>
      
      <div className="space-y-8">
        {categoryOrder.map(categoryKey => {
          const tools = toolsByCategory[categoryKey];
          const config = CATEGORY_CONFIG[categoryKey];
          const styles = getCategoryStyles(categoryKey);

          if (!tools || tools.length === 0) {
            return null; // Don't render empty categories for now
          }

          return (
            <section key={categoryKey} aria-labelledby={`category-title-${categoryKey}`}>
              <div className={`border-l-4 ${styles.border} pl-4 mb-4`}>
                <h3 id={`category-title-${categoryKey}`} className="text-xl font-bold text-text-primary flex items-center gap-2">
                  {config.icon} {config.name}
                </h3>
                <p className="text-text-secondary">{config.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map(tool => (
                  <ToolCard 
                    key={tool.id} 
                    tool={tool} 
                    onSelect={() => navigate(View.ToolDetail, { toolId: tool.id })} 
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default ToolsLibrary;