import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Search, Eye } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { mockComponents } from '@/data/mockComponents';
import { Component } from '@/types/component';
import { ComponentSidebar } from '@/components/ComponentSidebar';
import designSystemData from '@/data/designSystemData.json';
import { componentPreviews } from '@/data/componentPreviews';

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// Build full component list for the sidebar
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

const DesignSystem: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const { components, totalComponents } = designSystemData;

  const availableCount = components.filter(c => c.available).length;
  const percentage = Math.round((availableCount / totalComponents) * 100);

  const filtered = components.filter(comp => {
    const matchesSearch = !searchTerm ||
      comp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || comp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(components.map(c => c.category))];

  // Group filtered components by category
  const grouped = categories.reduce<Record<string, typeof filtered>>((acc, cat) => {
    const items = filtered.filter(c => c.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  return (
    <SidebarProvider>
      <ComponentSidebar components={allComponents} />
      <SidebarInset className="bg-background">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-6 py-3">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/components">Components</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Design System</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Content */}
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Design System Gallery</h1>
            <p className="text-muted-foreground mt-1">
              Visual showcase of all DFL design system components.
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
              <p className="text-sm text-muted-foreground">Coverage</p>
              <p className="text-3xl font-bold">
                <span className={percentage === 100 ? 'text-green-400' : 'text-blue-400'}>
                  {percentage}%
                </span>
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
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
          </div>

          {/* Gallery by category */}
          {Object.entries(grouped).map(([category, comps]) => (
            <div key={category} className="mb-12">
              <div className="flex items-center gap-2 mb-5">
                <h2 className="text-xl font-semibold">{category}</h2>
                <span className="text-sm text-muted-foreground">({comps.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {comps.map(comp => {
                  const preview = componentPreviews[comp.name];
                  return (
                    <Link key={comp.name} to={`/components/${slugify(comp.name)}`} className="group">
                      <Card className="h-full transition-colors hover:border-accent-foreground/20 hover:bg-accent/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base group-hover:text-blue-400 transition-colors">
                              {comp.name}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              {comp.available && (
                                <Badge variant="secondary" className="text-xs gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                                  Available
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {preview ? (
                            <div className="border border-border rounded-md p-4 bg-muted/30 flex items-center justify-center min-h-[100px] overflow-hidden">
                              <div className="pointer-events-none [&>*]:scale-90 [&>*]:origin-center">
                                {preview.preview}
                              </div>
                            </div>
                          ) : (
                            <div className="border border-border rounded-md p-4 bg-muted/10 flex items-center justify-center min-h-[100px]">
                              <div className="text-center">
                                <Eye className="w-6 h-6 mx-auto mb-2 text-muted-foreground/40" />
                                <p className="text-xs text-muted-foreground/60">Preview not available</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
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

export default DesignSystem;
