
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Component } from '@/types/component';
import { mockComponents } from '@/data/mockComponents';
import { ComponentHeader } from './ComponentHeader';
import { ComponentCard } from './ComponentCard';
import { ComponentDetailModal } from './ComponentDetailModal';
import { CategoryIcon } from './CategoryIcon';

const ComponentHubApp: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [selectedSubPage, setSelectedSubPage] = useState<string>('');
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());

  const categories = ['all', 'UI', 'Hooks', 'Providers', 'Pages'];

  const filteredComponents = mockComponents.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || component.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group components by category when "all" is selected
  const groupedComponents = selectedCategory === 'all' 
    ? categories.slice(1).reduce((acc, category) => {
        const categoryComponents = filteredComponents.filter(comp => comp.category === category);
        if (categoryComponents.length > 0) {
          acc[category] = categoryComponents;
        }
        return acc;
      }, {} as Record<string, Component[]>)
    : { [selectedCategory]: filteredComponents };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied!",
      description: "The component code has been copied to your clipboard.",
    });
  };

  const handleBulkCopy = () => {
    const selectedComponentsData = mockComponents.filter(comp => 
      selectedComponents.has(comp.id)
    );

    let clipboardContent = '';
    
    selectedComponentsData.forEach(component => {
      if (component.subPages) {
        component.subPages.forEach(subPage => {
          clipboardContent += `**${subPage.filePath}**\n\`\`\`typescript\n${subPage.code}\n\`\`\`\n\n`;
        });
      } else {
        clipboardContent += `**${component.filePath}**\n\`\`\`typescript\n${component.code}\n\`\`\`\n\n`;
      }
    });

    navigator.clipboard.writeText(clipboardContent.trim());
    
    toast({
      title: "Components copied!",
      description: `${selectedComponents.size} components copied to clipboard in LLM format.`,
    });
    
    setSelectedComponents(new Set());
  };

  const toggleComponentSelection = (componentId: string) => {
    const newSelected = new Set(selectedComponents);
    if (newSelected.has(componentId)) {
      newSelected.delete(componentId);
    } else {
      newSelected.add(componentId);
    }
    setSelectedComponents(newSelected);
  };

  const openComponent = (component: Component) => {
    setSelectedComponent(component);
    setSelectedSubPage(component.subPages?.[0]?.name || '');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <ComponentHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        selectedComponents={selectedComponents}
        onBulkCopy={handleBulkCopy}
      />

      {/* Component Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {Object.entries(groupedComponents).map(([category, components]) => (
          <div key={category} className="mb-8">
            {selectedCategory === 'all' && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-200 mb-3 flex items-center space-x-2">
                  <CategoryIcon category={category as Component['category']} />
                  <span>{category}</span>
                </h2>
                <div className="h-px bg-gradient-to-r from-gray-700 via-gray-600 to-transparent"></div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {components.map(component => (
                <ComponentCard
                  key={component.id}
                  component={component}
                  isSelected={selectedComponents.has(component.id)}
                  onSelect={toggleComponentSelection}
                  onOpen={openComponent}
                />
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedComponents).length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No components found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>

      <ComponentDetailModal
        component={selectedComponent}
        isOpen={!!selectedComponent}
        onClose={() => setSelectedComponent(null)}
        selectedSubPage={selectedSubPage}
        setSelectedSubPage={setSelectedSubPage}
        onCopyCode={handleCopyCode}
      />
    </div>
  );
};

export default ComponentHubApp;
