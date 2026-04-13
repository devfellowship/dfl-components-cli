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
  Bold,
  Check,
  ChevronDown,
  ChevronsUpDown,
  Italic,
  Minus,
  Terminal,
  Bell,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
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
  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full max-w-sm">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is the DFL Design System?</AccordionTrigger>
        <AccordionContent>
          A unified set of tokens, components, and patterns used across all DevFellowship products to ensure visual consistency.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I install components?</AccordionTrigger>
        <AccordionContent>
          Use the CLI tool to copy components directly into your project. Run <code className="text-xs bg-muted px-1 py-0.5 rounded">npx dfl-components add button</code>.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I customize the theme?</AccordionTrigger>
        <AccordionContent>
          Yes. Override the CSS variables in your root stylesheet to match your brand palette.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function AlertPreview() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the CLI.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function AlertDialogPreview() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the selected item and remove all associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Sizes &amp; Fallbacks</p>
      <div className="flex items-end gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">SM</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-lg bg-[#F39325] text-black">TF</AvatarFallback>
        </Avatar>
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-lg bg-[#A371F7] text-black">JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

function BreadcrumbPreview() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Stage 2</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span className="text-foreground font-medium">Sprint 4</span>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function CalendarPreview() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border border-border"
    />
  );
}

function CarouselPreview() {
  const colors = ['bg-[#F39325]/20', 'bg-[#A371F7]/20', 'bg-[#4AADE8]/20'];
  const labels = ['Design', 'Develop', 'Deploy'];
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent>
        {[0, 1, 2].map((i) => (
          <CarouselItem key={i}>
            <div className="p-1">
              <div className={`flex aspect-square items-center justify-center rounded-md border border-border ${colors[i]}`}>
                <div className="text-center">
                  <span className="text-3xl font-bold">{i + 1}</span>
                  <p className="text-sm text-muted-foreground mt-1">{labels[i]}</p>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
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
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between space-x-4">
        <h4 className="text-sm font-semibold">3 items</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border border-border px-4 py-2 text-sm">Item 1</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border border-border px-4 py-2 text-sm">Item 2</div>
        <div className="rounded-md border border-border px-4 py-2 text-sm">Item 3</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function CommandPreview() {
  return (
    <Command className="rounded-lg border border-border shadow-md w-full max-w-sm">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem>Create new project</CommandItem>
          <CommandItem>Deploy to production</CommandItem>
          <CommandItem>View analytics</CommandItem>
        </CommandGroup>
        <CommandGroup heading="Navigation">
          <CommandItem>Dashboard</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

function ContextMenuPreview() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[80px] w-full max-w-sm items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuItem>Reload</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Modal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed? This will apply changes to all selected items in the current workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">Review the changes carefully before confirming. This operation may take a few seconds to complete.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DrawerPreview() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>Make changes to your profile here.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="drawer-name">Display name</Label>
            <Input id="drawer-name" defaultValue="Tainan Fidelis" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="drawer-bio">Bio</Label>
            <Textarea id="drawer-bio" placeholder="Tell us about yourself..." />
          </div>
        </div>
        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function DropdownMenuPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Open Menu <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function HoverCardPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@devfellowship</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-72">
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback className="bg-[#F39325] text-black">DF</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">DevFellowship</h4>
            <p className="text-sm text-muted-foreground">Building the next generation of developer tools and design systems.</p>
            <p className="text-xs text-muted-foreground">Joined April 2024</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
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
  return (
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
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function NavigationMenuPreview() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground" href="#">
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground" href="#">
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground" href="#">
            Contact
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function PaginationPreview() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItemComp>
          <PaginationPrevious href="#" />
        </PaginationItemComp>
        <PaginationItemComp>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItemComp>
        <PaginationItemComp>
          <PaginationLink href="#" isActive>2</PaginationLink>
        </PaginationItemComp>
        <PaginationItemComp>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItemComp>
        <PaginationItemComp>
          <PaginationEllipsis />
        </PaginationItemComp>
        <PaginationItemComp>
          <PaginationLink href="#">8</PaginationLink>
        </PaginationItemComp>
        <PaginationItemComp>
          <PaginationNext href="#" />
        </PaginationItemComp>
      </PaginationContent>
    </Pagination>
  );
}

function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Popover Title</h4>
          <p className="text-sm text-muted-foreground">
            This is a popover with some content inside.
          </p>
        </div>
      </PopoverContent>
    </Popover>
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
    <ScrollArea className="h-[120px] w-full max-w-sm rounded-md border border-border p-4">
      <div className="space-y-2">
        {Array.from({ length: 15 }, (_, i) => (
          <p key={i} className="text-sm text-muted-foreground">
            Scrollable item {i + 1}
          </p>
        ))}
      </div>
    </ScrollArea>
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet Title</SheetTitle>
          <SheetDescription>
            This is a sheet panel that slides in from the side.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">Sheet content goes here.</p>
        </div>
      </SheetContent>
    </Sheet>
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
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Toast Notifications</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => {
            import('sonner').then(({ toast }) => {
              toast.success('Task completed successfully');
            });
          }}
        >
          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
          Success
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            import('sonner').then(({ toast }) => {
              toast.error('Something went wrong');
            });
          }}
        >
          <XCircle className="mr-1 h-3.5 w-3.5" />
          Error
        </Button>
        <Button
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-black"
          onClick={() => {
            import('sonner').then(({ toast }) => {
              toast.warning('Please review before continuing');
            });
          }}
        >
          <AlertTriangle className="mr-1 h-3.5 w-3.5" />
          Warning
        </Button>
        <Button
          size="sm"
          className="bg-[#4AADE8] hover:bg-[#4AADE8]/80 text-black"
          onClick={() => {
            import('sonner').then(({ toast }) => {
              toast.info('New version available');
            });
          }}
        >
          <Info className="mr-1 h-3.5 w-3.5" />
          Info
        </Button>
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
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Alice Johnson</TableCell>
          <TableCell><Badge className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/20 border-0">Active</Badge></TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bob Smith</TableCell>
          <TableCell><Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/20 border-0">Pending</Badge></TableCell>
          <TableCell className="text-right">$1,250.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Carol Davis</TableCell>
          <TableCell><Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/20 border-0">Overdue</Badge></TableCell>
          <TableCell className="text-right">$890.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function TabsPreview() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-sm">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-3 pt-2">
        <div className="space-y-1.5">
          <Label htmlFor="tab-name">Name</Label>
          <Input id="tab-name" defaultValue="Tainan Fidelis" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tab-email">Email</Label>
          <Input id="tab-email" defaultValue="tainan@devfellowship.com" />
        </div>
      </TabsContent>
      <TabsContent value="password" className="text-sm text-muted-foreground pt-2">
        Change your password here.
      </TabsContent>
      <TabsContent value="settings" className="text-sm text-muted-foreground pt-2">
        Manage notification and display preferences.
      </TabsContent>
    </Tabs>
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
    <div className="w-full max-w-sm border border-border rounded-md p-4 bg-muted/10 flex items-center justify-center min-h-[60px]">
      <p className="text-sm text-muted-foreground">Toast primitive — use with Toaster component</p>
    </div>
  );
}

function ToasterPreview() {
  return (
    <div className="w-full max-w-sm border border-border rounded-md p-4 bg-muted/10 flex items-center justify-center min-h-[60px]">
      <p className="text-sm text-muted-foreground">Toaster — renders toast notifications globally</p>
    </div>
  );
}

function TogglePreview() {
  return (
    <div className="flex gap-2">
      <Toggle aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

function ToggleGroupPreview() {
  return (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

function TooltipPreview() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ProgressPreview() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex justify-between text-sm">
        <Label>Processing tasks</Label>
        <span className="text-muted-foreground font-medium">68%</span>
      </div>
      <Progress value={68} />
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
};
