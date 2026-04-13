import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Layout, Zap, Users, Code } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Component } from '@/types/component';

interface ComponentSidebarProps {
  components: Component[];
}

const categoryIcons: Record<string, React.ElementType> = {
  UI: Layout,
  Hooks: Zap,
  Providers: Users,
  Pages: Code,
};

function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export const ComponentSidebar: React.FC<ComponentSidebarProps> = ({ components }) => {
  const location = useLocation();

  const grouped = components.reduce<Record<string, Component[]>>((acc, comp) => {
    if (!acc[comp.category]) acc[comp.category] = [];
    acc[comp.category].push(comp);
    return acc;
  }, {});

  const categoryOrder = ['UI', 'Hooks', 'Providers', 'Pages'];

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <Link to="/" className="block">
          <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            DFL Components
          </h2>
          <p className="text-xs text-sidebar-foreground/60 mt-0.5">Browse & preview</p>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/' || location.pathname === '/components'}>
                  <Link to="/components">
                    <Layout className="w-4 h-4" />
                    <span>All Components</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {categoryOrder.map(category => {
          const items = grouped[category];
          if (!items || items.length === 0) return null;
          const Icon = categoryIcons[category] || Layout;

          return (
            <SidebarGroup key={category}>
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger className="flex w-full items-center">
                    <Icon className="w-4 h-4 mr-2" />
                    {category}
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map(comp => {
                        const slug = slugify(comp.name);
                        const isActive = location.pathname === `/components/${slug}`;
                        return (
                          <SidebarMenuItem key={comp.id}>
                            <SidebarMenuButton asChild isActive={isActive} size="sm">
                              <Link to={`/components/${slug}`}>
                                <span>{comp.name}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <p className="text-xs text-sidebar-foreground/50">
          {components.length} components
        </p>
      </SidebarFooter>
    </Sidebar>
  );
};
