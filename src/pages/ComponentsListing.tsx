import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Component } from '@/types/component';
import { mockComponents } from '@/data/mockComponents';
import designSystemData from '@/data/designSystemData.json';
import { ComponentSidebar } from '@/components/ComponentSidebar';
import { componentPreviews } from '@/data/componentPreviews';

// Merge: use designSystemData for all components, enrich with mockComponents for previews/code
const allComponents: Component[] = designSystemData.components.map((ds, idx) => {
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
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { components, totalComponents } = designSystemData;

  const availableCount = components.filter(c => c.available).length;

  const filtered = allComponents.filter(comp => {
    const matchesSearch = !searchTerm ||
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const dsComp = components.find(c => c.name.toLowerCase() === comp.name.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || (dsComp?.category || comp.category) === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(components.map(c => c.category))];

  // Group filtered components by category
  const grouped = categories.reduce<Record<string, Component[]>>((acc, cat) => {
    const items = filtered.filter(c => {
      const dsComp = components.find(d => d.name.toLowerCase() === c.name.toLowerCase());
      return (dsComp?.category || c.category) === cat;
    });
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <SidebarProvider>
      <ComponentSidebar components={allComponents} />
      <SidebarInset className="bg-sidebar">
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

        {/* Content */}
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">All Components</h1>
            <p className="text-muted-foreground mt-1">
              Browse, preview, and copy DFL shared components.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="rounded-lg border border-border p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground">Available</p>
              <p className="text-3xl font-bold text-green-400">{availableCount}</p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-bold">{totalComponents}</p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground">Shown</p>
              <p className="text-3xl font-bold text-blue-400">{filtered.length}</p>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                  categoryFilter === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Single-column gallery by category */}
          {Object.entries(grouped).map(([category, comps]) => (
            <div key={category} className="mb-12">
              <div className="flex items-center gap-2 mb-5">
                <h2 className="text-xl font-semibold">{category}</h2>
                <span className="text-sm text-muted-foreground">({comps.length})</span>
              </div>

              <div className="space-y-8">
                {comps.map(comp => {
                  const preview = componentPreviews[comp.name];

                  return (
                    <div key={comp.name}>
                      <Link
                        to={`/components/${slugify(comp.name)}`}
                        className="text-base font-semibold hover:text-blue-400 transition-colors"
                      >
                        {comp.name}
                      </Link>
                      <hr className="border-border my-3" />
                      {preview ? (
                        <div className="flex items-center justify-center min-h-[60px] overflow-hidden">
                          {preview.preview}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center min-h-[60px]">
                          <p className="text-xs text-muted-foreground/60">Preview not available</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {Object.keys(grouped).length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg text-muted-foreground">No components found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            {filtered.length} of {totalComponents} components shown.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ComponentsListing;
