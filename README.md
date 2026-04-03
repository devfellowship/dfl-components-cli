
# DevFellowship Component Hub

A dark-themed, minimalist micro-app for browsing, previewing, and copying reusable frontend components within your development team.

## Features

- **Component Browser**: Grid-based layout with category filtering and search
- **Live Preview**: Visual preview of UI components with source code
- **Copy-to-Clipboard**: One-click code copying for rapid development
- **Multi-Page Components**: Support for components with multiple sub-pages
- **Dark Theme**: Professional dark-only interface optimized for developers
- **Embeddable**: Self-contained component ready for integration
- **Observability**: Built-in Sentry error tracking and OpenTelemetry integration
- **Containerized**: Docker and devcontainer support for consistent development environments

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- Lucide React icons
- Vite for development and building
- Vitest for testing
- Sentry (`@sentry/react`) for error tracking
- OpenTelemetry for distributed tracing
- Docker for containerized development and deployment

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Modern web browser
- (Optional) Docker and Docker Compose for containerized development
- (Optional) VS Code with the Dev Containers extension

### Installation

```bash
# Clone the repository
git clone https://github.com/devfellowship/dfl-components-cli.git
cd dfl-components-cli

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the app.

### Running with Docker

You can run the entire application inside a Docker container without installing Node.js locally:

```bash
# Build and start with Docker Compose
docker compose up

# Or build the image directly
docker build -t dfl-components-cli .
docker run -p 8080:8080 dfl-components-cli
```

The app will be available at [http://localhost:8080](http://localhost:8080).

### Using the Dev Container

This project includes a VS Code devcontainer configuration for a fully sandboxed development environment:

1. Open the repository in VS Code.
2. When prompted, click **Reopen in Container** (or run the command **Dev Containers: Reopen in Container** from the command palette).
3. VS Code will build the Docker image, install dependencies via `npm install`, and open a terminal inside the container.
4. The workspace is mounted at `/app` with ESLint and Prettier extensions pre-installed.

The devcontainer uses the same `docker-compose.yml` as the standalone Docker workflow, so behavior is consistent across environments.

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite development server |
| `npm run dev:portless` | Start dev server via the portless proxy |
| `npm run build` | Production build |
| `npm run build:dev` | Development build (unminified) |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_REGISTRY_URL` | Override the component registry URL | GitHub raw URL |
| `VITE_PORT` | Dev server port | `8080` |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking | _(disabled if empty)_ |
| `VITE_OTEL_API_KEY` | API key for the OpenTelemetry collector | _(none)_ |
| `VITE_OTEL_ENABLED` | Enable observability in non-production builds | `false` |
| `VITE_APP_NAME` | Service name reported to collectors | `"unknown"` |
| `VITE_APP_VERSION` | Service version reported to collectors | `"0.0.0"` |

## Observability (Sentry and OpenTelemetry)

The app ships with an `ObservabilityProvider` component that initializes both Sentry and OpenTelemetry when enabled. It is located at `src/components/observability/`.

### What it provides

- **Sentry error tracking** -- automatic capture of uncaught exceptions and unhandled promise rejections.
- **React Error Boundary** -- wraps the component tree so render errors are caught, reported, and displayed gracefully.
- **OpenTelemetry tracing** -- browser spans sent to the DevFellowship collector.
- **Core Web Vitals** -- LCP, FID, CLS metrics collected automatically.
- **Fetch instrumentation** -- outgoing HTTP requests are traced.
- **React Query error reporting** -- failed queries are reported as spans.

### Usage

Wrap your app with `ObservabilityProvider`:

```tsx
import { ObservabilityProvider } from "./components/observability";

function App() {
  return (
    <ObservabilityProvider sentryDsn="https://...@sentry.io/...">
      <YourApp />
    </ObservabilityProvider>
  );
}
```

All configuration props are optional; the provider reads `VITE_*` environment variables as defaults. Set `enabled={false}` or omit the Sentry DSN to disable tracking entirely.

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
