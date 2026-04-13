import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Component } from '@/types/component';
import { mockComponents } from '@/data/mockComponents';
import designSystemData from '@/data/designSystemData.json';
import { ComponentSidebar } from '@/components/ComponentSidebar';
import { CategoryIcon } from '@/components/CategoryIcon';

// Merge: use designSystemData for all components, enrich with mockComponents for previews/code
const allComponents: Component[] = designSystemData.components.map((ds, idx) => {
  const slug = ds.name.toLowerCase().replace(/\s+/g, '-');
  const mock = mockComponents.find(m => m.name.toLowerCase() === ds.name.toLowerCase());
  return {
    id: mock?.id || `ds-${idx}`,
    name: ds.name,
    description: mock?.description || `${ds.name} component`,
    category: (ds.category || 'UI') as Component['category'],
    tags: mock?.tags || [ds.name.toLowerCase()],
    version: mock?.version || '1.0.0',
    filePath: `src/components/ui/${ds.file}`,
    code: mock?.code || `import { ${ds.name.replace(/\s+/g, '')} } from '@/components/ui/${ds.file.replace('.tsx', '')}';`,
    previewComponent: mock?.previewComponent,
    subPages: mock?.subPages,
  };
});

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

const ComponentsListing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComponents = allComponents.filter(component => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      component.name.toLowerCase().includes(q) ||
      component.description.toLowerCase().includes(q) ||
      component.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  const categories = ['UI', 'Hooks', 'Providers', 'Pages'] as const;

  const grouped = categories.reduce<Record<string, Component[]>>((acc, cat) => {
    const items = filteredComponents.filter(c => c.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <SidebarProvider>
      <ComponentSidebar components={allComponents} />
      <SidebarInset>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-6 py-3">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </header>

        {/* Main content */}
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Components</h1>
            <p className="text-muted-foreground mt-1">
              Browse, preview, and copy DFL shared components.
            </p>
          </div>

          {Object.entries(grouped).map(([category, components]) => (
            <div key={category} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <CategoryIcon category={category as Component['category']} />
                <h2 className="text-xl font-semibold">{category}</h2>
                <span className="text-sm text-muted-foreground">({components.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {components.map(comp => (
                  <Link key={comp.id} to={`/components/${slugify(comp.name)}`} className="group">
                    <Card className="h-full p-5 transition-colors hover:bg-accent/50 hover:border-accent-foreground/20">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold group-hover:text-blue-400 transition-colors">
                          {comp.name}
                        </h3>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          v{comp.version}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {comp.description}
                      </p>

                      {/* Mini preview */}
                      {comp.previewComponent && (
                        <div className="bg-muted/50 border border-border rounded-md p-3 mb-3 flex items-center justify-center min-h-[60px]">
                          {React.createElement(comp.previewComponent)}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {comp.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <Eye className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(grouped).length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg text-muted-foreground">No components found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ComponentsListing;
