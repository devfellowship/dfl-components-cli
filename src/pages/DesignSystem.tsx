import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Search } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { mockComponents } from '@/data/mockComponents';
import { ComponentSidebar } from '@/components/ComponentSidebar';
import designSystemData from '@/data/designSystemData.json';

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

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

  return (
    <SidebarProvider>
      <ComponentSidebar components={mockComponents} />
      <SidebarInset>
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
            <h1 className="text-3xl font-bold tracking-tight">Design System Coverage</h1>
            <p className="text-muted-foreground mt-1">
              Component availability matrix across the DFL design system.
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
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
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

          {/* Table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Component</TableHead>
                  <TableHead className="w-[120px]">Category</TableHead>
                  <TableHead className="w-[120px]">File</TableHead>
                  <TableHead className="w-[100px] text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(comp => (
                  <TableRow key={comp.name}>
                    <TableCell className="font-medium">
                      {comp.available ? (
                        <Link
                          to={`/components/${slugify(comp.name)}`}
                          className="hover:text-blue-400 transition-colors"
                        >
                          {comp.name}
                        </Link>
                      ) : (
                        comp.name
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                        {comp.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {comp.file}
                    </TableCell>
                    <TableCell className="text-center">
                      {comp.available ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 inline-block" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 inline-block" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            {filtered.length} of {totalComponents} components shown.
            Status is auto-generated from <code className="font-mono">src/components/ui/</code>.
          </p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DesignSystem;
