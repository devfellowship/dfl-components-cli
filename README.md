
# DevFellowship Component Hub

A dark-themed, minimalist micro-app for browsing, previewing, and copying reusable frontend components within your development team.

## Features

- **Component Browser**: Grid-based layout with category filtering and search
- **Live Preview**: Visual preview of UI components with source code
- **Copy-to-Clipboard**: One-click code copying for rapid development
- **Multi-Page Components**: Support for components with multiple sub-pages
- **Dark Theme**: Professional dark-only interface optimized for developers
- **Embeddable**: Self-contained component ready for integration

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- Lucide React icons
- Vite for development and building

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd devfellowship-component-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the app.

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Embedding the Component Hub

The entire app is encapsulated in a single `ComponentHubApp` component that can be embedded in larger applications:

```tsx
import ComponentHubApp from './components/ComponentHubApp';

function SuperApp() {
  return (
    <div className="app-container">
      {/* Your existing app content */}
      
      {/* Embed the Component Hub */}
      <ComponentHubApp />
    </div>
  );
}
```

### CSS Isolation

The component hub uses Tailwind CSS classes that are scoped to avoid conflicts:
- All content is wrapped in a container with `bg-gray-950` for dark theme
- No global styles that would affect parent applications
- Self-contained styling using shadcn/ui components

## Component Structure

### Component Data Model

Each component in the hub follows this structure:

```typescript
interface Component {
  id: string;
  name: string;
  description: string;
  category: 'UI' | 'Hooks' | 'Providers' | 'Pages';
  tags: string[];
  version: string;
  code: string;
  previewComponent?: React.ComponentType;
  subPages?: {
    name: string;
    code: string;
    previewComponent?: React.ComponentType;
  }[];
}
```

### Adding New Components

To add new components to the hub:

1. **Update Mock Data**: Add your component to the `mockComponents` array in `ComponentHubApp.tsx`
2. **Create Preview Component**: Build a preview version for the modal
3. **Add Source Code**: Include the complete source code as a string
4. **Set Metadata**: Define category, tags, version, and description

Example:

```typescript
{
  id: 'new-component',
  name: 'MyComponent',
  description: 'A useful component that does something great',
  category: 'UI',
  tags: ['button', 'interactive'],
  version: '1.0.0',
  code: `// Your component source code here`,
  previewComponent: MyComponentPreview
}
```

## Authentication Integration

The hub includes placeholder authentication pages ready for integration:

### Future Auth Integration Points

Located in `/src/components/auth/`:

- `LoginPage.tsx` - Complete login form with validation
- `RegisterPage.tsx` - Registration form with password confirmation

**Integration Comments**: Look for `// TODO: Replace with actual auth service call` throughout the codebase for integration points.

### Planned Auth Features

- Role-based component access control
- User session management
- Integration with existing auth providers
- Component usage tracking per user

## Architecture Decisions

### Why Mock Data?

The current implementation uses hard-coded component data to:
- Provide immediate functionality without backend dependencies
- Allow rapid prototyping and UI development
- Make the component hub embeddable in any environment

### Component Preview Strategy

- **UI Components**: Live React component previews
- **Hooks/Providers**: Code-only display with usage examples
- **Pages**: Full page component rendering in modal

### Search and Filter Logic

- **Search**: Case-insensitive matching on component name and tags
- **Filter**: Category-based filtering with "All" option
- **Real-time**: Instant results as you type

## Customization

### Theme Customization

The dark theme can be customized by modifying Tailwind classes:

```css
/* Main background */
bg-gray-950

/* Card backgrounds */
bg-gray-900

/* Border colors */
border-gray-800

/* Accent colors */
bg-blue-600 (primary actions)
text-blue-400 (links and highlights)
```

### Layout Modifications

- **Grid Layout**: Modify `grid-cols-*` classes in the component grid
- **Modal Size**: Adjust `max-w-6xl` in the detail modal
- **Responsive Breakpoints**: Update `md:`, `lg:`, `xl:` prefixes

## Roadmap

### Immediate Enhancements
- [ ] Component dependency visualization
- [ ] Bulk copy functionality
- [ ] Advanced search (by code content)
- [ ] Component usage examples

### Future Features
- [ ] Real authentication integration
- [ ] Component versioning UI
- [ ] Usage analytics dashboard
- [ ] Team collaboration features
- [ ] Integration with design systems

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is intended for internal use within DevFellowship. All rights reserved.

---

**Need Help?** Check the component source code for detailed implementation examples and integration patterns.
