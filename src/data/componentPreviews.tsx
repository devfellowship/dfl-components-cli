import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Calendar } from '@/components/ui/calendar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import {
  Pagination,
  PaginationContent,
  PaginationItem as PaginationItemComp,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertCircle,
  ArrowUpDown,
  Award,
  Banknote,
  Bold,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  FileText,
  Folder,
  GripVertical,
  Home,
  Info,
  Italic,
  Layers,
  Minus,
  Settings,
  Shield,
  Star,
  Terminal,
  Bell,
  User,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  MoreVertical,
  Copy,
  Plus,
  X,
} from 'lucide-react';

// --- Preview components ---

function ButtonPreview() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Variants</p>
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Sizes</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Bell className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

function BadgePreview() {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Variants</p>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Brand Colors</p>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-[#F39325] text-black hover:bg-[#F39325]/80">Orange</Badge>
          <Badge className="bg-[#4AADE8] text-black hover:bg-[#4AADE8]/80">Cyan</Badge>
          <Badge className="bg-[#A371F7] text-black hover:bg-[#A371F7]/80">Purple</Badge>
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-600/80">Success</Badge>
        </div>
      </div>
    </div>
  );
}

function CardPreview() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sprint Overview</CardTitle>
        <CardDescription>Current sprint progress and key metrics for Q2 2026.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tasks completed</span>
            <span className="font-medium">18 / 24</span>
          </div>
          <Progress value={75} />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Days remaining</span>
            <span className="font-medium">5</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Details</Button>
      </CardFooter>
    </Card>
  );
}

function InputPreview() {
  const inputBase: React.CSSProperties = {
    background: '#0D1117',
    border: '1px solid #21262D',
    color: '#E6EDF3',
    fontSize: 13,
    borderRadius: 12,
    padding: '10px 12px',
    width: '100%',
    outline: 'none',
  };
  return (
    <div className="w-full max-w-sm space-y-5">
      {/* Default */}
      <div className="space-y-1.5">
        <label style={{ color: '#E6EDF3', fontSize: 13, fontWeight: 500 }}>Full name</label>
        <input
          style={inputBase}
          placeholder="e.g. Jo\u00e3o Pessoa"
        />
        <p style={{ color: '#8B949E', fontSize: 12 }}>Your legal name as it appears on documents</p>
      </div>
      {/* Error */}
      <div className="space-y-1.5">
        <label style={{ color: '#EF4444', fontSize: 13, fontWeight: 500 }}>Email</label>
        <div className="relative">
          <input
            style={{
              ...inputBase,
              border: '1px solid rgba(239,68,68,0.5)',
              paddingRight: 36,
            }}
            defaultValue="not-an-email"
          />
          <AlertCircle
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: '#EF4444', width: 16, height: 16 }}
          />
        </div>
        <p style={{ color: '#EF4444', fontSize: 12 }}>Please enter a valid email address</p>
      </div>
      {/* Disabled */}
      <div className="space-y-1.5">
        <label style={{ color: '#6B7280', fontSize: 13, fontWeight: 500 }}>Batch (read-only)</label>
        <input
          style={{
            ...inputBase,
            color: '#6B7280',
            cursor: 'not-allowed',
            background: 'rgba(13,17,23,0.6)',
          }}
          disabled
          defaultValue="Batch 7 — locked"
        />
      </div>
    </div>
  );
}

function AccordionPreview() {
  const items = [
    { q: "What is the DFL Design System?", a: "A unified set of tokens, components, and patterns used across all DevFellowship products to ensure visual consistency." },
    { q: "How do I install components?", a: "Use the CLI tool to copy components directly into your project. Run npx dfl-components add button." },
    { q: "Can I customize the theme?", a: "Yes. Override the CSS variables in your root stylesheet to match your brand palette." },
  ];
  return (
    <div className="w-full max-w-sm" style={{ border: '1px solid #21262D', borderRadius: 12, overflow: 'hidden' }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid #21262D' : 'none' }}>
          <div className="flex items-center justify-between px-4 py-3 cursor-pointer" style={{ color: i === 0 ? '#E6EDF3' : '#C6CDD5' }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{item.q}</span>
            <ChevronDown size={14} style={{ color: '#8B949E', transform: i === 0 ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </div>
          {i === 0 && (
            <div className="px-4 pb-3" style={{ color: '#8B949E', fontSize: 13, lineHeight: 1.5 }}>
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AlertPreview() {
  const alerts = [
    { icon: CheckCircle2, color: '#22C55E', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', title: 'Success', msg: 'Changes saved successfully.' },
    { icon: XCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', title: 'Error', msg: 'Your session has expired. Please log in again.' },
    { icon: AlertTriangle, color: '#F4C542', bg: 'rgba(244,197,66,0.08)', border: 'rgba(244,197,66,0.2)', title: 'Warning', msg: 'Please review before continuing.' },
    { icon: Info, color: '#06B6D4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.2)', title: 'Info', msg: 'New version available for download.' },
  ];
  return (
    <div className="w-full max-w-sm space-y-3">
      {alerts.map((a) => {
        const Icon = a.icon;
        return (
          <div key={a.title} className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: a.bg, border: `1px solid ${a.border}` }}>
            <Icon size={16} style={{ color: a.color, marginTop: 2, flexShrink: 0 }} />
            <div>
              <p style={{ color: a.color, fontSize: 13, fontWeight: 600 }}>{a.title}</p>
              <p style={{ color: '#C6CDD5', fontSize: 12 }}>{a.msg}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AlertDialogPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Button style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>Delete Item</Button>
      {/* Static dialog preview */}
      <div
        className="rounded-xl p-5 w-full max-w-sm"
        style={{ background: '#1C2128', border: '1px solid #21262D', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      >
        <h3 style={{ color: '#E6EDF3', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Are you absolutely sure?</h3>
        <p style={{ color: '#8B949E', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
          This action cannot be undone. This will permanently delete the selected item and remove all associated data from our servers.
        </p>
        <div className="flex items-center gap-2 justify-end">
          <button
            className="px-4 py-2 rounded-lg"
            style={{ background: 'transparent', border: '1px solid #21262D', color: '#C6CDD5', fontSize: 13, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AspectRatioPreview() {
  return (
    <div className="w-full max-w-[200px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md flex items-center justify-center">
        <p className="text-sm text-muted-foreground">16:9</p>
      </AspectRatio>
    </div>
  );
}

function AvatarPreview() {
  const sizes = [
    { label: 'XS', size: 20, fontSize: 8 },
    { label: 'SM', size: 28, fontSize: 10 },
    { label: 'MD', size: 36, fontSize: 12 },
    { label: 'LG', size: 48, fontSize: 14 },
    { label: 'XL', size: 60, fontSize: 18 },
  ];
  return (
    <div className="space-y-5">
      {/* Row 1: Variants */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8B949E' }}>Variants</p>
        <div className="flex items-center gap-3">
          {/* Image placeholder */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: '2px solid #F39325', background: 'transparent' }}>
            <User size={16} color="#F39325" />
          </div>
          {/* Initials */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(163,113,247,0.15)', fontSize: 12, fontWeight: 700, color: '#A371F7' }}>JP</div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)', fontSize: 12, fontWeight: 700, color: '#06B6D4' }}>AF</div>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(243,147,37,0.15)', fontSize: 12, fontWeight: 700, color: '#F39325' }}>CO</div>
          {/* Icon default */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#161B22' }}>
            <User size={16} color="#8B949E" />
          </div>
        </div>
      </div>
      {/* Row 2: Sizes */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8B949E' }}>Sizes</p>
        <div className="flex items-end gap-3">
          {sizes.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <div className="rounded-full flex items-center justify-center" style={{ width: s.size, height: s.size, background: 'rgba(163,113,247,0.15)', fontSize: s.fontSize, fontWeight: 700, color: '#A371F7' }}>
                JP
              </div>
              <span style={{ color: '#8B949E', fontSize: 10 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Row 3: With badge */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8B949E' }}>With Badge</p>
        <div className="relative inline-flex">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(243,147,37,0.15)', fontSize: 14, fontWeight: 700, color: '#F39325' }}>TF</div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#F4C542', fontSize: 10, fontWeight: 700, color: '#0D1117' }}>2</div>
        </div>
      </div>
    </div>
  );
}

function BreadcrumbPreview() {
  return (
    <div className="flex items-center gap-1.5" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Home */}
      <button className="flex items-center gap-1" style={{ color: '#8B949E', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}>
        <Home size={13} />
        <span>Home</span>
      </button>
      <ChevronRight size={12} style={{ color: '#30363D', flexShrink: 0 }} />
      {/* Stage 2 with dropdown indicator */}
      <button
        className="flex items-center gap-1 px-2 py-1 rounded-lg"
        style={{ color: '#C6CDD5', fontSize: 13, background: 'transparent', border: '1px solid transparent', cursor: 'pointer' }}
      >
        <Folder size={13} />
        <span>Stage 2</span>
        <ChevronDown size={11} />
      </button>
      <ChevronRight size={12} style={{ color: '#30363D', flexShrink: 0 }} />
      {/* Active page */}
      <span
        className="flex items-center gap-1 px-2 py-1 rounded-lg"
        style={{ background: 'rgba(74,173,232,0.1)', color: '#4AADE8', fontSize: 13, fontWeight: 600 }}
      >
        <FileText size={13} />
        Sprint 4
      </span>
    </div>
  );
}

function CalendarPreview() {
  const today = 13;
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  return (
    <div className="rounded-xl p-4" style={{ background: '#161B22', border: '1px solid #21262D' }}>
      <div className="flex items-center justify-between mb-3">
        <button style={{ color: '#8B949E' }}><ChevronLeft size={14} /></button>
        <span style={{ color: '#E6EDF3', fontSize: 13, fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif" }}>April 2026</span>
        <button style={{ color: '#8B949E' }}><ChevronRight size={14} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => (
          <div key={d} style={{ color: '#8B949E', fontSize: 10, fontWeight: 600, padding: 4 }}>{d}</div>
        ))}
        {/* offset for April 2026 starting on Wednesday */}
        {[0,0,0].map((_, i) => <div key={`blank-${i}`} />)}
        {days.map((d) => (
          <div
            key={d}
            className="flex items-center justify-center rounded-lg"
            style={{
              width: 28, height: 28,
              fontSize: 11,
              fontWeight: d === today ? 700 : 400,
              color: d === today ? '#0D1117' : '#C6CDD5',
              background: d === today ? '#F39325' : 'transparent',
              cursor: 'pointer',
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}

function CarouselPreview() {
  const slides = [
    { label: 'Stage 1 \u2014 Onboarding', color: '#F39325', sub: 'Weeks 1\u20134' },
    { label: 'Stage 2 \u2014 Builder', color: '#4AADE8', sub: 'Weeks 5\u20138' },
    { label: 'Stage 3 \u2014 Architect', color: '#A371F7', sub: 'Weeks 9\u201312' },
  ];
  const activeIdx = 0;
  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="relative overflow-hidden rounded-xl" style={{ height: 120 }}>
        {/* Show first slide statically */}
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div
              key={slide.label}
              className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${slide.color}18, ${slide.color}08)`,
                border: `1px solid ${slide.color}30`,
                display: i === activeIdx ? 'flex' : 'none',
              }}
            >
              <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 18, color: slide.color }}>{slide.label}</p>
              <p style={{ color: '#8B949E', fontSize: 13 }}>{slide.sub}</p>
            </div>
          ))}
        </div>
        {/* Arrows */}
        <div
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(13,17,23,0.7)', border: '1px solid #21262D', color: '#8B949E' }}
        >
          <ChevronLeft size={14} />
        </div>
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(13,17,23,0.7)', border: '1px solid #21262D', color: '#8B949E' }}
        >
          <ChevronRight size={14} />
        </div>
      </div>
      {/* Dots */}
      <div className="flex items-center justify-center gap-2">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="rounded-full"
            style={{ width: i === activeIdx ? 20 : 6, height: 6, background: i === activeIdx ? slide.color : '#21262D', transition: 'width 0.2s' }}
          />
        ))}
      </div>
    </div>
  );
}

function ChartPreview() {
  return (
    <div className="w-full max-w-sm border border-border rounded-md p-4 bg-muted/10 flex items-center justify-center min-h-[80px]">
      <p className="text-sm text-muted-foreground">Chart — interactive component, see docs</p>
    </div>
  );
}

function CheckboxPreview() {
  const boxSize = 20;
  const boxBase: React.CSSProperties = {
    width: boxSize,
    height: boxSize,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>States</p>
      {/* Checked */}
      <div className="flex items-center gap-3">
        <div style={{ ...boxBase, background: 'rgba(163,113,247,0.9)', border: '1px solid #A371F7' }}>
          <Check style={{ color: '#fff', width: 14, height: 14, strokeWidth: 3 }} />
        </div>
        <span style={{ color: '#E6EDF3', fontSize: 13 }}>Enable notifications</span>
      </div>
      {/* Unchecked */}
      <div className="flex items-center gap-3">
        <div style={{ ...boxBase, background: 'transparent', border: '1px solid #21262D' }} />
        <span style={{ color: '#E6EDF3', fontSize: 13 }}>Auto-deploy on merge</span>
      </div>
      {/* Indeterminate */}
      <div className="flex items-center gap-3">
        <div style={{ ...boxBase, background: 'rgba(163,113,247,0.9)', border: '1px solid #A371F7' }}>
          <Minus style={{ color: '#fff', width: 14, height: 14, strokeWidth: 3 }} />
        </div>
        <span style={{ color: '#E6EDF3', fontSize: 13 }}>Select all tasks</span>
      </div>
    </div>
  );
}

function CollapsiblePreview() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span style={{ color: '#E6EDF3', fontSize: 14, fontWeight: 600 }}>3 items</span>
        <button
          className="p-1.5 rounded-lg"
          style={{ background: '#161B22', border: '1px solid #21262D', color: '#8B949E' }}
        >
          <ChevronsUpDown size={14} />
        </button>
      </div>
      {['Item 1', 'Item 2', 'Item 3'].map((item) => (
        <div
          key={item}
          className="rounded-xl px-4 py-2"
          style={{ background: '#161B22', border: '1px solid #21262D', color: '#C6CDD5', fontSize: 13 }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function CommandPreview() {
  return (
    <div
      className="rounded-xl w-full max-w-sm overflow-hidden"
      style={{ background: '#161B22', border: '1px solid #21262D', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
    >
      <div className="px-3 py-2.5" style={{ borderBottom: '1px solid #21262D' }}>
        <p style={{ color: '#8B949E', fontSize: 13 }}>Type a command or search...</p>
      </div>
      <div className="flex flex-col p-1.5">
        <p style={{ color: '#8B949E', fontSize: 11, fontWeight: 600, padding: '6px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</p>
        {['Create new project', 'Deploy to production', 'View analytics'].map((item) => (
          <div key={item} className="px-3 py-2 rounded-lg" style={{ color: '#E6EDF3', fontSize: 13 }}>
            {item}
          </div>
        ))}
        <p style={{ color: '#8B949E', fontSize: 11, fontWeight: 600, padding: '6px 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigation</p>
        {['Dashboard', 'Settings'].map((item) => (
          <div key={item} className="px-3 py-2 rounded-lg" style={{ color: '#E6EDF3', fontSize: 13 }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function ContextMenuPreview() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <div
        className="flex h-[60px] items-center justify-center rounded-xl"
        style={{ background: '#161B22', border: '1px dashed #30363D', color: '#8B949E', fontSize: 13 }}
      >
        Right click here
      </div>
      {/* Static context menu preview */}
      <div
        className="flex flex-col gap-0.5 p-1.5 rounded-xl"
        style={{ background: '#1C2128', border: '1px solid #21262D', minWidth: 160, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
      >
        {['Back', 'Forward', 'Reload'].map((label) => (
          <div
            key={label}
            className="px-3 py-2 rounded-lg"
            style={{ color: '#C6CDD5', fontSize: 13 }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function DialogPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Button style={{ background: '#161B22', border: '1px solid #21262D', color: '#E6EDF3' }}>Open Modal</Button>
      {/* Static modal preview */}
      <div
        className="rounded-xl p-5 w-full max-w-sm"
        style={{ background: '#1C2128', border: '1px solid #21262D', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
      >
        <h3 style={{ color: '#E6EDF3', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Confirm action</h3>
        <p style={{ color: '#8B949E', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
          This will permanently delete the selected batch and all associated data. This action cannot be undone.
        </p>
        <div className="flex items-center gap-2 justify-end">
          <button
            className="px-4 py-2 rounded-lg"
            style={{ background: 'transparent', border: '1px solid #21262D', color: '#C6CDD5', fontSize: 13, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg"
            style={{ background: 'rgba(248,81,73,0.15)', border: '1px solid rgba(248,81,73,0.4)', color: '#F85149', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Delete Batch
          </button>
        </div>
      </div>
    </div>
  );
}

function DrawerPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Button style={{ background: '#161B22', border: '1px solid #21262D', color: '#E6EDF3' }}>Open Drawer</Button>
      {/* Static drawer preview */}
      <div
        className="rounded-xl p-5 w-full max-w-sm"
        style={{ background: '#161B22', border: '1px solid #21262D' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-3">
          <div style={{ width: 32, height: 4, borderRadius: 2, background: '#30363D' }} />
        </div>
        <h3 style={{ color: '#E6EDF3', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Edit Profile</h3>
        <p style={{ color: '#8B949E', fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
          Make changes to your profile here.
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <label style={{ color: '#C6CDD5', fontSize: 12, fontWeight: 500, display: 'block', marginBottom: 4 }}>Display name</label>
            <div className="rounded-lg px-3 py-2" style={{ background: '#0D1117', border: '1px solid #21262D', color: '#E6EDF3', fontSize: 13 }}>Tainan Fidelis</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex-1 px-4 py-2 rounded-lg" style={{ background: 'rgba(243,147,37,0.12)', border: '1px solid rgba(243,147,37,0.3)', color: '#F39325', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Save Changes
            </button>
            <button className="px-4 py-2 rounded-lg" style={{ background: 'transparent', border: '1px solid #21262D', color: '#C6CDD5', fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DropdownMenuPreview() {
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: '#161B22', border: '1px solid #21262D', color: '#C6CDD5', fontSize: 13 }}
      >
        <MoreVertical size={14} />
        Actions
        <ChevronDown size={12} />
      </button>
      {/* Static visible menu */}
      <div
        className="mt-1 flex flex-col gap-0.5 p-1.5 rounded-xl"
        style={{ background: '#1C2128', border: '1px solid #21262D', minWidth: 180, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
      >
        {[
          { icon: Eye, label: 'View details', color: '#C6CDD5' },
          { icon: Copy, label: 'Duplicate', color: '#C6CDD5' },
          { icon: Settings, label: 'Settings', color: '#C6CDD5' },
          { icon: XCircle, label: 'Delete', color: '#EF4444' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
              style={{ color: item.color, fontSize: 13 }}
            >
              <Icon size={13} />
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HoverCardPreview() {
  return (
    <div className="flex flex-col gap-4">
      <button style={{ color: '#4AADE8', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>@devfellowship</button>
      {/* Static hover card preview */}
      <div
        className="rounded-xl p-4 w-full max-w-xs"
        style={{ background: '#1C2128', border: '1px solid #21262D', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
      >
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(243,147,37,0.15)', fontSize: 12, fontWeight: 700, color: '#F39325' }}>DF</div>
          <div>
            <h4 style={{ color: '#E6EDF3', fontSize: 14, fontWeight: 600 }}>DevFellowship</h4>
            <p style={{ color: '#8B949E', fontSize: 12, lineHeight: 1.5, marginTop: 2 }}>Building the next generation of developer tools and design systems.</p>
            <p style={{ color: '#6B7280', fontSize: 11, marginTop: 4 }}>Joined April 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputOTPPreview() {
  return (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

function LabelPreview() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" placeholder="you@example.com" />
    </div>
  );
}

function MenubarPreview() {
  const menus = ['File', 'Edit', 'View', 'Help'];
  return (
    <div
      className="flex items-center gap-0 rounded-xl px-1"
      style={{ background: '#0D1117', border: '1px solid #21262D' }}
    >
      {menus.map((menu, i) => (
        <button
          key={menu}
          className="px-3 py-2 rounded-lg"
          style={{
            fontSize: 13,
            color: i === 0 ? '#E6EDF3' : '#8B949E',
            background: i === 0 ? '#161B22' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontWeight: i === 0 ? 500 : 400,
          }}
        >
          {menu}
        </button>
      ))}
    </div>
  );
}

function NavigationMenuPreview() {
  const navItems = ['Dashboard', 'Kanban', 'Materials', 'Exams'];
  return (
    <div className="w-full overflow-x-auto">
      <div
        className="flex items-center gap-4 px-5 py-3 rounded-xl"
        style={{ background: '#0D1117', border: '1px solid #21262D', minWidth: 480 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(243,147,37,0.2)' }}>
            <Star size={13} style={{ color: '#F39325' }} />
          </div>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color: '#F39325', fontSize: 15, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>DEVFELLOWSHIP</span>
        </div>
        {/* Nav links */}
        <nav className="flex items-center gap-1 ml-6 shrink-0">
          {navItems.map((item, i) => (
            <button
              key={item}
              className="px-3 py-1.5 rounded-lg"
              style={i === 0
                ? { background: 'rgba(243,147,37,0.12)', color: '#F39325', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' }
                : { color: '#8B949E', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }
              }
            >
              {item}
            </button>
          ))}
        </nav>
        {/* User actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button className="p-1.5 rounded-lg" style={{ color: '#8B949E', background: 'none', border: 'none', cursor: 'pointer' }}>
            <Bell size={15} />
          </button>
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(163,113,247,0.18)', border: '1.5px solid rgba(163,113,247,0.35)' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#A371F7' }}>JP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaginationPreview() {
  const activePage = 2;
  const pages: (number | string)[] = [1, 2, 3, '…', 8];
  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg"
        style={{ background: '#161B22', border: '1px solid #21262D', color: '#8B949E', fontSize: 12, cursor: 'pointer' }}
      >
        <ChevronLeft size={13} /> Prev
      </button>
      {pages.map((n, i) => (
        <button
          key={i}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={n === activePage
            ? { background: 'rgba(163,113,247,0.16)', border: '1px solid rgba(163,113,247,0.4)', color: '#A371F7', fontWeight: 700, fontSize: 13 }
            : { background: 'transparent', color: '#8B949E', fontSize: 13, border: '1px solid transparent' }
          }
        >
          {n}
        </button>
      ))}
      <button
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg"
        style={{ background: '#161B22', border: '1px solid #21262D', color: '#8B949E', fontSize: 12, cursor: 'pointer' }}
      >
        Next <ChevronRight size={13} />
      </button>
    </div>
  );
}

function PopoverPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Button style={{ background: '#161B22', border: '1px solid #21262D', color: '#E6EDF3' }}>Open Popover</Button>
      {/* Static popover preview */}
      <div
        className="rounded-xl p-4 w-full max-w-xs"
        style={{ background: '#1C2128', border: '1px solid #21262D', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
      >
        <h4 style={{ color: '#E6EDF3', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Popover Title</h4>
        <p style={{ color: '#8B949E', fontSize: 13, lineHeight: 1.5 }}>
          This is a popover with some content inside a dark floating panel.
        </p>
      </div>
    </div>
  );
}

function RadioGroupPreview() {
  return (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Option 1</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">Option 2</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">Option 3</Label>
      </div>
    </RadioGroup>
  );
}

function ResizablePreview() {
  return (
    <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border border-border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[100px] items-center justify-center p-4">
          <span className="text-sm font-semibold">Panel A</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[100px] items-center justify-center p-4">
          <span className="text-sm font-semibold">Panel B</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function ScrollAreaPreview() {
  return (
    <div
      className="h-[120px] w-full max-w-sm rounded-xl overflow-auto p-4"
      style={{ background: '#161B22', border: '1px solid #21262D' }}
    >
      <div className="flex flex-col gap-2">
        {Array.from({ length: 15 }, (_, i) => (
          <p key={i} style={{ color: '#8B949E', fontSize: 13 }}>
            Scrollable item {i + 1}
          </p>
        ))}
      </div>
    </div>
  );
}

function SelectPreview() {
  const options = [
    { value: 'stage-1', label: 'Stage 1 \u2014 Discovery', color: '#F39325' },
    { value: 'stage-2', label: 'Stage 2 \u2014 Builder', color: '#4AADE8' },
    { value: 'stage-3', label: 'Stage 3 \u2014 Launch', color: '#A371F7' },
  ];
  const selected = 1; // stage-2
  return (
    <div className="w-full max-w-xs space-y-2">
      <label style={{ color: '#E6EDF3', fontSize: 13, fontWeight: 500 }}>Project stage</label>
      {/* Trigger button */}
      <div
        style={{
          background: '#0D1117',
          border: '1px solid #21262D',
          borderRadius: 12,
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div className="flex items-center gap-2">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: options[selected].color }} />
          <span style={{ color: '#E6EDF3', fontSize: 13 }}>{options[selected].label}</span>
        </div>
        <ChevronDown style={{ color: '#8B949E', width: 16, height: 16 }} />
      </div>
      {/* Floating dropdown (static, always visible for preview) */}
      <div
        style={{
          background: '#1C2128',
          border: '1px solid #21262D',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          padding: '4px 0',
          overflow: 'hidden',
        }}
      >
        {options.map((opt, i) => (
          <div
            key={opt.value}
            className="flex items-center justify-between"
            style={{
              padding: '8px 12px',
              background: i === selected ? 'rgba(74,173,232,0.08)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            <div className="flex items-center gap-2">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: opt.color }} />
              <span style={{ color: i === selected ? '#E6EDF3' : '#C6CDD5', fontSize: 13 }}>{opt.label}</span>
            </div>
            {i === selected && <Check style={{ color: '#4AADE8', width: 16, height: 16 }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function SeparatorPreview() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <p className="text-sm">Content above</p>
      <Separator />
      <p className="text-sm">Content below</p>
    </div>
  );
}

function SheetPreview() {
  return (
    <div className="flex flex-col gap-4">
      <Button style={{ background: '#161B22', border: '1px solid #21262D', color: '#E6EDF3' }}>Open Sheet</Button>
      {/* Static sheet preview */}
      <div
        className="rounded-xl p-5 w-full max-w-xs"
        style={{ background: '#161B22', border: '1px solid #21262D', minHeight: 120 }}
      >
        <h3 style={{ color: '#E6EDF3', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Sheet Panel</h3>
        <p style={{ color: '#8B949E', fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
          Slides in from the side for contextual actions.
        </p>
        <div style={{ borderTop: '1px solid #21262D', paddingTop: 12 }}>
          <p style={{ color: '#C6CDD5', fontSize: 12 }}>Sheet content area</p>
        </div>
      </div>
    </div>
  );
}

function SidebarPreview() {
  return (
    <div className="w-full max-w-sm border border-border rounded-md p-4 bg-muted/10 flex items-center justify-center min-h-[80px]">
      <p className="text-sm text-muted-foreground">Sidebar — interactive layout component, see docs</p>
    </div>
  );
}

function SonnerPreview() {
  const toastDefs = [
    { type: 'success', label: 'Success', icon: CheckCircle2, color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', msg: 'Task approved successfully.' },
    { type: 'error', label: 'Error', icon: XCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', msg: 'Something went wrong. Try again.' },
    { type: 'warning', label: 'Warning', icon: AlertTriangle, color: '#F4C542', bg: 'rgba(244,197,66,0.1)', border: 'rgba(244,197,66,0.3)', msg: 'Submission pending review.' },
    { type: 'info', label: 'Info', icon: Info, color: '#06B6D4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.3)', msg: 'New batch starts Monday.' },
  ];
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2">
        {toastDefs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.type}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ background: t.bg, border: `1px solid ${t.border}`, color: t.color, fontSize: 12, fontWeight: 600, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.04em' }}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </div>
      {/* Sample toast card */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl w-full max-w-xs"
        style={{ background: '#1C2128', border: '1px solid rgba(34,197,94,0.3)', boxShadow: '0 0 24px rgba(34,197,94,0.1)' }}
      >
        <CheckCircle2 size={16} color="#22C55E" className="shrink-0" />
        <p style={{ color: '#E6EDF3', fontSize: 13, flex: 1 }}>Task approved successfully.</p>
        <button style={{ color: '#6B7280' }}>
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

function SwitchPreview() {
  const trackW = 44;
  const trackH = 24;
  const thumbD = 18;
  const pad = 3;
  return (
    <div className="space-y-5">
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8B949E' }}>Toggle States</p>
      {/* On */}
      <div className="flex items-center gap-4">
        <div
          style={{
            width: trackW,
            height: trackH,
            borderRadius: trackH / 2,
            background: 'linear-gradient(135deg, #A371F7, #06B6D4)',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: thumbD,
              height: thumbD,
              borderRadius: '50%',
              background: '#fff',
              position: 'absolute',
              top: pad,
              left: trackW - thumbD - pad,
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
        </div>
        <div className="flex flex-col">
          <span style={{ color: '#E6EDF3', fontSize: 13, fontWeight: 500 }}>Dark mode</span>
          <span style={{ color: '#8B949E', fontSize: 12 }}>Use dark color scheme</span>
        </div>
      </div>
      {/* Off */}
      <div className="flex items-center gap-4">
        <div
          style={{
            width: trackW,
            height: trackH,
            borderRadius: trackH / 2,
            background: '#21262D',
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: thumbD,
              height: thumbD,
              borderRadius: '50%',
              background: '#6B7280',
              position: 'absolute',
              top: pad,
              left: pad,
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }}
          />
        </div>
        <div className="flex flex-col">
          <span style={{ color: '#E6EDF3', fontSize: 13, fontWeight: 500 }}>Beta features</span>
          <span style={{ color: '#8B949E', fontSize: 12 }}>Try experimental functionality</span>
        </div>
      </div>
    </div>
  );
}

function TablePreview() {
  const tableData = [
    { id: 1, name: "João Pessoa", initials: "JP", stage: "Stage 2", status: "Doing", value: "R$ 250" },
    { id: 2, name: "Ana Ferreira", initials: "AF", stage: "Stage 3", status: "Done", value: "R$ 410" },
    { id: 3, name: "Carlos Oliveira", initials: "CO", stage: "Stage 1", status: "In Review", value: "R$ 95" },
    { id: 4, name: "Maria Costa", initials: "MC", stage: "Stage 2", status: "To Do", value: "R$ 180" },
  ];
  const statusColor: Record<string, string> = {
    "Doing": "#4AADE8", "Done": "#22C55E", "In Review": "#F4C542", "To Do": "#8B949E",
  };
  const stageColor: Record<string, string> = {
    "Stage 1": "#F39325", "Stage 2": "#4AADE8", "Stage 3": "#A371F7",
  };
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse" style={{ fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #21262D' }}>
            <th className="pb-2.5 pr-3 text-left" style={{ width: 32 }}>
              <div className="w-4 h-4 rounded" style={{ background: '#161B22', border: '1px solid #21262D' }} />
            </th>
            <th className="pb-2.5 pr-6 text-left" style={{ color: '#8B949E', fontWeight: 600 }}>
              <div className="flex items-center gap-1.5">
                Name <ArrowUpDown size={11} color="#30363D" />
              </div>
            </th>
            {["Stage", "Status", "Earnings"].map((h) => (
              <th key={h} className="pb-2.5 pr-6 text-left" style={{ color: '#8B949E', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row) => (
            <tr key={row.id} style={{ borderBottom: '1px solid #21262D' }}>
              <td className="py-3 pr-3">
                <div className="w-4 h-4 rounded" style={{ background: 'transparent', border: '1.5px solid #21262D' }} />
              </td>
              <td className="py-3 pr-6">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(163,113,247,0.15)', fontSize: 10, fontWeight: 700, color: '#A371F7' }}>
                    {row.initials}
                  </div>
                  <span style={{ color: '#E6EDF3' }}>{row.name}</span>
                </div>
              </td>
              <td className="py-3 pr-6">
                <span style={{ color: stageColor[row.stage] ?? '#8B949E', fontWeight: 600 }}>{row.stage}</span>
              </td>
              <td className="py-3 pr-6">
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{ background: `${statusColor[row.status]}15`, color: statusColor[row.status], fontSize: 11, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.06em' }}
                >
                  {row.status}
                </span>
              </td>
              <td className="py-3">
                <span className="flex items-center gap-1" style={{ color: '#22C55E', fontWeight: 600 }}>
                  <Banknote size={12} />{row.value}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabsPreview() {
  const tabs = [
    { label: 'Overview', active: true },
    { label: 'Sprints', active: false },
    { label: 'Members', active: false },
    { label: 'Settings', active: false },
  ];
  return (
    <div
      className="flex items-center gap-0 rounded-xl overflow-hidden"
      style={{ background: '#0D1117', border: '1px solid #21262D' }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className="px-4 py-2.5 relative"
          style={{
            fontSize: 13,
            fontWeight: tab.active ? 600 : 400,
            color: tab.active ? '#F39325' : '#8B949E',
            background: tab.active ? 'rgba(243,147,37,0.08)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            borderBottom: tab.active ? '2px solid #F39325' : '2px solid transparent',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function TextareaPreview() {
  return (
    <div className="w-full max-w-sm space-y-1.5">
      <label style={{ color: '#E6EDF3', fontSize: 13, fontWeight: 500 }}>Message</label>
      <textarea
        style={{
          background: '#0D1117',
          border: '1px solid #21262D',
          color: '#E6EDF3',
          fontSize: 13,
          borderRadius: 12,
          padding: '10px 12px',
          width: '100%',
          minHeight: 80,
          resize: 'vertical',
          outline: 'none',
          fontFamily: 'inherit',
        }}
        placeholder="Type your message here..."
      />
      <p style={{ color: '#8B949E', fontSize: 12 }}>Focus adds a subtle <span style={{ color: '#A371F7' }}>#A371F7</span> ring glow</p>
    </div>
  );
}

function ToastPreview() {
  return (
    <div
      className="w-full max-w-sm rounded-xl p-4 flex items-center justify-center min-h-[60px]"
      style={{ background: '#161B22', border: '1px solid #21262D' }}
    >
      <p style={{ color: '#8B949E', fontSize: 13 }}>Toast primitive — use with Toaster component</p>
    </div>
  );
}

function ToasterPreview() {
  return (
    <div
      className="w-full max-w-sm rounded-xl p-4 flex items-center justify-center min-h-[60px]"
      style={{ background: '#161B22', border: '1px solid #21262D' }}
    >
      <p style={{ color: '#8B949E', fontSize: 13 }}>Toaster — renders toast notifications globally</p>
    </div>
  );
}

function TogglePreview() {
  return (
    <div className="flex gap-2">
      {[
        { icon: Bold, label: 'Bold', active: true },
        { icon: Italic, label: 'Italic', active: false },
      ].map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.label}
            className="p-2 rounded-lg"
            style={{
              background: t.active ? 'rgba(163,113,247,0.12)' : '#161B22',
              border: `1px solid ${t.active ? 'rgba(163,113,247,0.35)' : '#21262D'}`,
              color: t.active ? '#A371F7' : '#8B949E',
            }}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}

function ToggleGroupPreview() {
  const items = [
    { icon: AlignLeft, value: 'left', active: true },
    { icon: AlignCenter, value: 'center', active: false },
    { icon: AlignRight, value: 'right', active: false },
  ];
  return (
    <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #21262D' }}>
      {items.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.value}
            className="p-2.5"
            style={{
              background: t.active ? 'rgba(163,113,247,0.12)' : '#161B22',
              color: t.active ? '#A371F7' : '#8B949E',
              borderRight: '1px solid #21262D',
            }}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}

function TooltipPreview() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Button style={{ background: '#161B22', border: '1px solid #21262D', color: '#E6EDF3' }}>Hover me</Button>
      {/* Static tooltip preview */}
      <div
        className="rounded-lg px-3 py-1.5"
        style={{ background: '#1C2128', border: '1px solid #21262D', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
      >
        <p style={{ color: '#E6EDF3', fontSize: 12 }}>This is a tooltip</p>
      </div>
    </div>
  );
}

function ProgressPreview() {
  return (
    <div className="w-full max-w-sm flex flex-col gap-2">
      <div className="flex justify-between">
        <span style={{ color: '#8B949E', fontSize: 12 }}>Processing tasks</span>
        <span style={{ color: '#A371F7', fontSize: 12, fontWeight: 700 }}>68%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#21262D' }}>
        <div
          className="h-full rounded-full"
          style={{ width: '68%', background: 'linear-gradient(90deg, #A371F7, #06B6D4)' }}
        />
      </div>
    </div>
  );
}

function SliderPreview() {
  const pct = 62;
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex justify-between" style={{ fontSize: 13 }}>
        <span style={{ color: '#E6EDF3', fontWeight: 500 }}>Completion threshold</span>
        <span style={{ color: '#F39325', fontWeight: 600 }}>{pct}%</span>
      </div>
      {/* Track */}
      <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#21262D', position: 'relative' }}>
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              borderRadius: 3,
              background: 'linear-gradient(90deg, #F39325, #F39325)',
            }}
          />
        </div>
        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            left: `${pct}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#F39325',
            border: '2px solid #0D1117',
            boxShadow: '0 0 0 2px rgba(243,147,37,0.3)',
          }}
        />
      </div>
    </div>
  );
}

function SkeletonPreview() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center space-x-4">
        <div className="ds-shimmer w-10 h-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="ds-shimmer h-4 rounded-md" style={{ width: '60%' }} />
          <div className="ds-shimmer h-4 rounded-md" style={{ width: '40%' }} />
        </div>
      </div>
      <div className="space-y-2">
        <div className="ds-shimmer h-4 rounded-md" style={{ width: '100%' }} />
        <div className="ds-shimmer h-4 rounded-md" style={{ width: '85%' }} />
        <div className="ds-shimmer h-4 rounded-md" style={{ width: '70%' }} />
      </div>
      <div className="ds-shimmer h-20 w-full rounded-xl" />
    </div>
  );
}

function LoadingStatePreview() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex items-center space-x-3">
        <div
          className="animate-spin rounded-full h-5 w-5 border-2 border-[#A371F7]"
          style={{ borderTopColor: 'transparent' }}
        />
        <span style={{ color: '#C9D1D9', fontSize: 14 }}>Loading data...</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between" style={{ fontSize: 13, color: '#8B949E' }}>
          <span>Processing tasks</span>
          <span>68%</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#21262D' }}>
          <div
            className="h-full rounded-full"
            style={{ width: '68%', background: 'linear-gradient(90deg, #A371F7, #06B6D4)' }}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyPlaceholderPreview() {
  return (
    <div className="w-full max-w-sm flex flex-col items-center text-center space-y-4 py-6">
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: 64,
          height: 64,
          border: '1px dashed rgba(163,113,247,0.25)',
          background: 'rgba(163,113,247,0.08)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#A371F7"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <div className="space-y-1">
        <h3 style={{ color: '#C9D1D9', fontSize: 16, fontWeight: 600 }}>No results found</h3>
        <p style={{ color: '#8B949E', fontSize: 13 }}>
          Try adjusting your filters or create a new item to get started.
        </p>
      </div>
      <button
        className="rounded-lg px-4 py-2 text-sm font-medium"
        style={{ background: 'hsl(33, 90%, 55%)', color: '#000' }}
      >
        Create new
      </button>
    </div>
  );
}

function FormPreview() {
  const inputStyle: React.CSSProperties = {
    background: '#0D1117',
    border: '1px solid #21262D',
    color: '#E6EDF3',
    fontSize: 13,
    borderRadius: 12,
    padding: '10px 12px',
    width: '100%',
    outline: 'none',
  };
  const labelStyle: React.CSSProperties = { color: '#E6EDF3', fontSize: 13, fontWeight: 500 };
  const helperStyle: React.CSSProperties = { color: '#8B949E', fontSize: 12 };
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-1.5">
        <label style={labelStyle}>Full name</label>
        <input style={inputStyle} placeholder="e.g. Jo\u00e3o Pessoa" />
        <p style={helperStyle}>As it appears on your ID</p>
      </div>
      <div className="space-y-1.5">
        <label style={labelStyle}>Email</label>
        <input style={inputStyle} placeholder="you@example.com" />
      </div>
      <div className="space-y-1.5">
        <label style={labelStyle}>Project stage</label>
        <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <span style={{ color: '#C6CDD5' }}>Select a stage...</span>
          <ChevronDown style={{ color: '#8B949E', width: 16, height: 16 }} />
        </div>
      </div>
      <button
        style={{
          width: '100%',
          padding: '10px 0',
          borderRadius: 12,
          border: 'none',
          background: '#F39325',
          color: '#000',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Submit
      </button>
    </div>
  );
}

function ListItemsPreview() {
  const items = [
    { icon: Bell, label: "Notifications", sub: "3 unread", badge: "3" },
    { icon: Shield, label: "Permissions", sub: "Admin access", badge: null },
    { icon: Settings, label: "Preferences", sub: "Theme \u00b7 Language", badge: null },
    { icon: User, label: "Profile", sub: "Jo\u00e3o Pessoa", badge: null },
  ];
  return (
    <div className="flex flex-col gap-0 w-full max-w-md" style={{ border: '1px solid #21262D', borderRadius: 12, overflow: 'hidden' }}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer"
            style={{ borderBottom: i < items.length - 1 ? '1px solid #21262D' : 'none' }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(163,113,247,0.12)' }}>
              <Icon size={14} color="#A371F7" />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: '#E6EDF3', fontSize: 13, fontWeight: 600 }}>{item.label}</p>
              <p style={{ color: '#8B949E', fontSize: 11 }}>{item.sub}</p>
            </div>
            {item.badge && (
              <span className="px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444', fontSize: 10, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>{item.badge}</span>
            )}
            <ChevronRight size={13} color="#30363D" />
          </div>
        );
      })}
    </div>
  );
}

function CardGridPreview() {
  const cards = [
    { icon: Layers, label: "Stage 1", sub: "Onboarding", color: '#F39325', done: 80 },
    { icon: GripVertical, label: "Stage 2", sub: "Builder", color: '#4AADE8', done: 45 },
    { icon: Award, label: "Stage 3", sub: "Architect", color: '#A371F7', done: 0 },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex flex-col gap-3 p-4 rounded-xl"
            style={{ background: '#161B22', border: '1px solid #21262D' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${card.color}20` }}>
              <Icon size={16} color={card.color} />
            </div>
            <div>
              <p style={{ color: '#E6EDF3', fontSize: 14, fontWeight: 600 }}>{card.label}</p>
              <p style={{ color: '#8B949E', fontSize: 12 }}>{card.sub}</p>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-1">
                <span style={{ color: '#6B7280', fontSize: 11 }}>Progress</span>
                <span style={{ color: card.color, fontSize: 11, fontWeight: 700 }}>{card.done}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{ background: '#21262D' }}>
                <div className="h-full rounded-full" style={{ width: `${card.done}%`, background: card.color }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ButtonGroupPreview() {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Brand orange variant */}
      <div className="flex items-stretch rounded-xl overflow-hidden" style={{ border: '1px solid rgba(243,147,37,0.4)' }}>
        <button
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ background: 'rgba(243,147,37,0.12)', color: '#F39325', fontSize: 13, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.04em', borderRight: '1px solid rgba(243,147,37,0.3)' }}
        >
          <Plus size={14} />
          New Task
        </button>
        <button
          className="flex items-center px-3 py-2.5"
          style={{ background: 'rgba(243,147,37,0.07)', color: '#F39325' }}
        >
          <ChevronDown size={14} />
        </button>
      </div>
      {/* Stage3 purple variant */}
      <div className="flex items-stretch rounded-xl overflow-hidden" style={{ border: '1px solid rgba(163,113,247,0.4)' }}>
        <button
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ background: 'rgba(163,113,247,0.12)', color: '#A371F7', fontSize: 13, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.04em', borderRight: '1px solid rgba(163,113,247,0.3)' }}
        >
          <Shield size={14} />
          Approve
        </button>
        <button
          className="flex items-center px-3 py-2.5"
          style={{ background: 'rgba(163,113,247,0.07)', color: '#A371F7' }}
        >
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}

// --- Data maps ---

export interface ComponentPreviewData {
  preview: React.ReactNode;
  usage: string;
}

export const componentPreviews: Record<string, ComponentPreviewData> = {
  Accordion: {
    preview: <AccordionPreview />,
    usage: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content for section 1.</AccordionContent>
  </AccordionItem>
</Accordion>`,
  },
  'Alert Dialog': {
    preview: <AlertDialogPreview />,
    usage: `import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
  },
  Alert: {
    preview: <AlertPreview />,
    usage: `import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Important information here.</AlertDescription>
</Alert>
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>`,
  },
  'Aspect Ratio': {
    preview: <AspectRatioPreview />,
    usage: `import { AspectRatio } from '@/components/ui/aspect-ratio';

<AspectRatio ratio={16 / 9}>
  <img src="..." alt="..." className="rounded-md object-cover" />
</AspectRatio>`,
  },
  Avatar: {
    preview: <AvatarPreview />,
    usage: `import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

<Avatar>
  <AvatarImage src="https://example.com/avatar.png" alt="User" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>`,
  },
  Badge: {
    preview: <BadgePreview />,
    usage: `import { Badge } from '@/components/ui/badge';

<Badge>Default</Badge>
<Badge variant="secondary">New</Badge>
<Badge variant="destructive">Error</Badge>`,
  },
  Breadcrumb: {
    preview: <BreadcrumbPreview />,
    usage: `import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="/components">Components</BreadcrumbLink></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
  },
  Button: {
    preview: <ButtonPreview />,
    usage: `import { Button } from '@/components/ui/button';

<Button>Click me</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="sm">Small</Button>`,
  },
  'Button Group': {
    preview: <ButtonGroupPreview />,
    usage: `{/* Split button: primary action + dropdown */}
<div className="flex items-stretch rounded-xl overflow-hidden"
     style={{ border: '1px solid rgba(243,147,37,0.4)' }}>
  <button style={{ background: 'rgba(243,147,37,0.12)', color: '#F39325' }}>
    <Plus size={14} /> New Task
  </button>
  <button style={{ background: 'rgba(243,147,37,0.07)', color: '#F39325' }}>
    <ChevronDown size={14} />
  </button>
</div>`,
  },
  Calendar: {
    preview: <CalendarPreview />,
    usage: `import { Calendar } from '@/components/ui/calendar';

const [date, setDate] = useState<Date | undefined>(new Date());

<Calendar mode="single" selected={date} onSelect={setDate} />`,
  },
  Card: {
    preview: <CardPreview />,
    usage: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`,
  },
  Carousel: {
    preview: <CarouselPreview />,
    usage: `import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

<Carousel>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`,
  },
  Chart: {
    preview: <ChartPreview />,
    usage: `import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// See recharts documentation for full chart configuration
<ChartContainer config={chartConfig}>
  {/* Chart content */}
</ChartContainer>`,
  },
  Checkbox: {
    preview: <CheckboxPreview />,
    usage: `import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>`,
  },
  Collapsible: {
    preview: <CollapsiblePreview />,
    usage: `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';

<Collapsible>
  <CollapsibleTrigger>Toggle</CollapsibleTrigger>
  <CollapsibleContent>
    <p>Hidden content here.</p>
  </CollapsibleContent>
</Collapsible>`,
  },
  Command: {
    preview: <CommandPreview />,
    usage: `import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>`,
  },
  'Context Menu': {
    preview: <ContextMenuPreview />,
    usage: `import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';

<ContextMenu>
  <ContextMenuTrigger>Right click here</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Back</ContextMenuItem>
    <ContextMenuItem>Forward</ContextMenuItem>
    <ContextMenuItem>Reload</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
  },
  Dialog: {
    preview: <DialogPreview />,
    usage: `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description here.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
  },
  Drawer: {
    preview: <DrawerPreview />,
    usage: `import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';

<Drawer>
  <DrawerTrigger asChild><Button>Open Drawer</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Title</DrawerTitle>
      <DrawerDescription>Description.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
  },
  'Dropdown Menu': {
    preview: <DropdownMenuPreview />,
    usage: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
  },
  Form: {
    preview: <FormPreview />,
    usage: `import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const form = useForm();

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField control={form.control} name="email" render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl><Input {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
    <Button type="submit">Submit</Button>
  </form>
</Form>`,
  },
  'Hover Card': {
    preview: <HoverCardPreview />,
    usage: `import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

<HoverCard>
  <HoverCardTrigger>Hover me</HoverCardTrigger>
  <HoverCardContent>
    <p>Content shown on hover.</p>
  </HoverCardContent>
</HoverCard>`,
  },
  'Input OTP': {
    preview: <InputOTPPreview />,
    usage: `import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';

<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>`,
  },
  Input: {
    preview: <InputPreview />,
    usage: `import { Input } from '@/components/ui/input';

<Input placeholder="Type something..." />
<Input type="email" placeholder="Email" />
<Input disabled placeholder="Disabled" />`,
  },
  Label: {
    preview: <LabelPreview />,
    usage: `import { Label } from '@/components/ui/label';

<Label htmlFor="email">Email</Label>
<input id="email" />`,
  },
  Menubar: {
    preview: <MenubarPreview />,
    usage: `import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator } from '@/components/ui/menubar';

<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>New Tab</MenubarItem>
      <MenubarItem>New Window</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Print</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>`,
  },
  'Navigation Menu': {
    preview: <NavigationMenuPreview />,
    usage: `import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu';

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink href="/">Home</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/about">About</NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
  },
  Pagination: {
    preview: <PaginationPreview />,
    usage: `import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@/components/ui/pagination';

<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
    <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationNext href="#" /></PaginationItem>
  </PaginationContent>
</Pagination>`,
  },
  Popover: {
    preview: <PopoverPreview />,
    usage: `import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

<Popover>
  <PopoverTrigger asChild><Button>Open Popover</Button></PopoverTrigger>
  <PopoverContent>
    <p>Popover content here.</p>
  </PopoverContent>
</Popover>`,
  },
  Progress: {
    preview: <ProgressPreview />,
    usage: `import { Progress } from '@/components/ui/progress';

<Progress value={60} />`,
  },
  'Radio Group': {
    preview: <RadioGroupPreview />,
    usage: `import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

<RadioGroup defaultValue="option-1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-1" id="option-1" />
    <Label htmlFor="option-1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-2" id="option-2" />
    <Label htmlFor="option-2">Option 2</Label>
  </div>
</RadioGroup>`,
  },
  Resizable: {
    preview: <ResizablePreview />,
    usage: `import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={50}>Panel A</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>Panel B</ResizablePanel>
</ResizablePanelGroup>`,
  },
  'Scroll Area': {
    preview: <ScrollAreaPreview />,
    usage: `import { ScrollArea } from '@/components/ui/scroll-area';

<ScrollArea className="h-[200px] w-full rounded-md border p-4">
  <p>Scrollable content here...</p>
</ScrollArea>`,
  },
  Select: {
    preview: <SelectPreview />,
    usage: `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Pick one" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
    <SelectItem value="b">Option B</SelectItem>
  </SelectContent>
</Select>`,
  },
  Separator: {
    preview: <SeparatorPreview />,
    usage: `import { Separator } from '@/components/ui/separator';

<Separator />
<Separator orientation="vertical" className="h-6" />`,
  },
  Sheet: {
    preview: <SheetPreview />,
    usage: `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild><Button>Open Sheet</Button></SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
      <SheetDescription>Description.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`,
  },
  Sidebar: {
    preview: <SidebarPreview />,
    usage: `import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>Item</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>`,
  },
  Skeleton: {
    preview: <SkeletonPreview />,
    usage: `import { Skeleton } from '@/components/ui/skeleton';

<Skeleton className="h-4 w-[200px]" />
<Skeleton className="h-12 w-12 rounded-full" />`,
  },
  'Loading State': {
    preview: <LoadingStatePreview />,
    usage: `{/* Spinner */}
<div className="flex items-center space-x-3">
  <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#A371F7]"
       style={{ borderTopColor: 'transparent' }} />
  <span>Loading data...</span>
</div>

{/* Progress bar */}
<div className="w-full h-2 rounded-full" style={{ background: '#21262D' }}>
  <div className="h-full rounded-full"
       style={{ width: '68%', background: 'linear-gradient(90deg, #A371F7, #06B6D4)' }} />
</div>`,
  },
  'Empty Placeholder': {
    preview: <EmptyPlaceholderPreview />,
    usage: `<div className="flex flex-col items-center text-center space-y-4 py-6">
  <div style={{
    width: 64, height: 64,
    border: '1px dashed rgba(163,113,247,0.25)',
    background: 'rgba(163,113,247,0.08)',
  }} className="flex items-center justify-center rounded-2xl">
    <SearchIcon className="h-6 w-6 text-[#A371F7]" />
  </div>
  <h3>No results found</h3>
  <p>Try adjusting your filters or create a new item to get started.</p>
  <Button>Create new</Button>
</div>`,
  },
  Slider: {
    preview: <SliderPreview />,
    usage: `import { Slider } from '@/components/ui/slider';

<Slider defaultValue={[50]} max={100} step={1} />`,
  },
  Sonner: {
    preview: <SonnerPreview />,
    usage: `import { toast } from 'sonner';

// Trigger a toast notification
toast('Event has been created', {
  description: 'Sunday, December 03, 2023 at 9:00 AM',
});`,
  },
  Switch: {
    preview: <SwitchPreview />,
    usage: `import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

<div className="flex items-center space-x-2">
  <Switch id="mode" />
  <Label htmlFor="mode">Dark Mode</Label>
</div>`,
  },
  Table: {
    preview: <TablePreview />,
    usage: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Alice</TableCell>
      <TableCell>Active</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  },
  Tabs: {
    preview: <TabsPreview />,
    usage: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>`,
  },
  Textarea: {
    preview: <TextareaPreview />,
    usage: `import { Textarea } from '@/components/ui/textarea';

<Textarea placeholder="Type your message..." />`,
  },
  Toast: {
    preview: <ToastPreview />,
    usage: `import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastViewport } from '@/components/ui/toast';

<ToastProvider>
  <Toast>
    <ToastTitle>Notification</ToastTitle>
    <ToastDescription>Something happened.</ToastDescription>
  </Toast>
  <ToastViewport />
</ToastProvider>`,
  },
  Toaster: {
    preview: <ToasterPreview />,
    usage: `import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

// In your layout:
<Toaster />

// To trigger:
const { toast } = useToast();
toast({ title: 'Success', description: 'Action completed.' });`,
  },
  'Toggle Group': {
    preview: <ToggleGroupPreview />,
    usage: `import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

<ToggleGroup type="single">
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
  <ToggleGroupItem value="c">C</ToggleGroupItem>
</ToggleGroup>`,
  },
  Toggle: {
    preview: <TogglePreview />,
    usage: `import { Toggle } from '@/components/ui/toggle';
import { Bold } from 'lucide-react';

<Toggle aria-label="Toggle bold">
  <Bold className="h-4 w-4" />
</Toggle>`,
  },
  Tooltip: {
    preview: <TooltipPreview />,
    usage: `import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>Tooltip text</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
  },
  'List Items': {
    preview: <ListItemsPreview />,
    usage: `{/* Settings-style list rows */}
<div style={{ border: '1px solid #21262D', borderRadius: 12, overflow: 'hidden' }}>
  {items.map((item, i, arr) => (
    <div key={item.label} className="flex items-center gap-3 px-4 py-3"
         style={{ borderBottom: i < arr.length - 1 ? '1px solid #21262D' : 'none' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
           style={{ background: 'rgba(163,113,247,0.12)' }}>
        <Icon size={14} color="#A371F7" />
      </div>
      <div className="flex-1">
        <p style={{ color: '#E6EDF3', fontSize: 13, fontWeight: 600 }}>{item.label}</p>
        <p style={{ color: '#8B949E', fontSize: 11 }}>{item.sub}</p>
      </div>
      <ChevronRight size={13} color="#30363D" />
    </div>
  ))}
</div>`,
  },
  'Card Grid': {
    preview: <CardGridPreview />,
    usage: `{/* Responsive card grid with progress */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
  {cards.map((card) => (
    <div key={card.label} className="flex flex-col gap-3 p-4 rounded-xl"
         style={{ background: '#161B22', border: '1px solid #21262D' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
           style={{ background: \`\${card.color}20\` }}>
        <Icon size={16} color={card.color} />
      </div>
      <div>
        <p style={{ color: '#E6EDF3', fontSize: 14, fontWeight: 600 }}>{card.label}</p>
        <p style={{ color: '#8B949E', fontSize: 12 }}>{card.sub}</p>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: '#21262D' }}>
        <div className="h-full rounded-full" style={{ width: \`\${card.done}%\`, background: card.color }} />
      </div>
    </div>
  ))}
</div>`,
  },
};
