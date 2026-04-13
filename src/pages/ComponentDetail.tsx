import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Check, ExternalLink, Code } from 'lucide-react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy} className="h-8 w-8">
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </Button>
  );
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="relative rounded-lg border border-border bg-muted/30 overflow-hidden">
      {label && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      {!label && (
        <div className="absolute top-2 right-2 z-10">
          <CopyButton text={code} />
        </div>
      )}
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="text-foreground/90">{code}</code>
      </pre>
    </div>
  );
}

const ComponentDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const component = mockComponents.find(c => slugify(c.name) === name);

  if (!component) {
    return (
      <SidebarProvider>
        <ComponentSidebar components={mockComponents} />
        <SidebarInset>
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Component not found</h1>
              <p className="text-muted-foreground mb-4">
                No component matching "{name}" was found.
              </p>
              <Link to="/components" className="text-blue-400 hover:underline">
                Back to components
              </Link>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  const fileSlug = slugify(component.name);
  const githubUrl = `https://github.com/devfellowship/dfl-components-cli/tree/main/${component.filePath}`;

  // Build import statement
  const importPath = component.filePath
    .replace(/^src\//, '@/')
    .replace(/\.tsx?$/, '');
  const importStatement = `import { ${component.name.replace(/\s+/g, '')} } from '${importPath}';`;

  // For components with subPages, build tabs
  const hasSubPages = component.subPages && component.subPages.length > 0;

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
                <BreadcrumbLink asChild>
                  <Link to={`/components?category=${component.category}`}>{component.category}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{component.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Content */}
        <div className="p-6 max-w-4xl">
          {/* Title section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{component.name}</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                  v{component.version}
                </span>
                <Button variant="outline" size="sm" asChild>
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Edit on GitHub
                  </a>
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground">{component.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {component.tags.map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {hasSubPages ? (
            <Tabs defaultValue={component.subPages![0].name} className="space-y-6">
              <TabsList>
                {component.subPages!.map(sub => (
                  <TabsTrigger key={sub.name} value={sub.name}>
                    {sub.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {component.subPages!.map(sub => (
                <TabsContent key={sub.name} value={sub.name} className="space-y-6">
                  {/* Preview */}
                  {sub.previewComponent && (
                    <section>
                      <h2 className="text-lg font-semibold mb-3">Preview</h2>
                      <div className="border border-border rounded-lg p-6 bg-muted/20 flex items-center justify-center min-h-[200px]">
                        {React.createElement(sub.previewComponent)}
                      </div>
                    </section>
                  )}

                  {/* Code */}
                  <section>
                    <h2 className="text-lg font-semibold mb-3">Source Code</h2>
                    <p className="text-sm text-muted-foreground mb-2 font-mono">{sub.filePath}</p>
                    <CodeBlock code={sub.code} label={sub.filePath} />
                  </section>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="space-y-8">
              {/* Preview */}
              {component.previewComponent && (
                <section>
                  <h2 className="text-lg font-semibold mb-3">Preview</h2>
                  <div className="border border-border rounded-lg p-6 bg-muted/20 flex items-center justify-center min-h-[120px]">
                    {React.createElement(component.previewComponent)}
                  </div>
                </section>
              )}

              {/* Import */}
              <section>
                <h2 className="text-lg font-semibold mb-3">Installation</h2>
                <CodeBlock code={importStatement} label="Import" />
              </section>

              {/* Source code */}
              <section>
                <h2 className="text-lg font-semibold mb-3">Source Code</h2>
                <CodeBlock code={component.code} label={component.filePath} />
              </section>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ComponentDetail;
