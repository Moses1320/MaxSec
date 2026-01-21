/**
 * README - MaxSec Frontend UI
 */

# MaxSec Frontend

Advanced security monitoring dashboard built with React, Electron, and TypeScript.

## Features

- 🎯 **Real-time Process Monitoring** - Live threat detection and risk scoring
- 🔒 **Advanced Security Controls** - Terminate, quarantine, and block malicious processes
- 📊 **Data Visualization** - Risk trends, process metrics, threat distribution
- 🌙 **Dark Mode** - Full dark mode support with system preference detection
- ♿ **Accessible** - WCAG AA compliant with keyboard navigation
- 📱 **Responsive** - Works on desktop, tablet, and mobile displays
- 🚀 **Cross-Platform** - Runs on Windows and Linux

## Project Structure

```
ui/
├── src/
│   ├── components/
│   │   ├── atoms/           # Base components (Button, Input, Card, etc.)
│   │   ├── molecules/       # Composite components (SearchBox, StatusBar, etc.)
│   │   └── organisms/       # Complex components (ProcessTable, AlertCard, etc.)
│   ├── pages/               # Page-level components (Dashboard, etc.)
│   ├── hooks/               # React hooks (useProcesses, useAlerts, etc.)
│   ├── services/            # API and WebSocket clients
│   ├── config/              # Configuration (environment, themes, etc.)
│   ├── theme/               # Design tokens and theme config
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component
│   ├── Layout.tsx           # Main layout with navigation
│   ├── index.tsx            # React entry point
│   └── index.css            # Global styles
├── public/
│   ├── electron.js          # Electron main process
│   ├── preload.ts           # Electron preload script
│   └── index.html           # HTML template
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS theme
├── postcss.config.js        # PostCSS configuration
└── vite.config.ts           # Vite build configuration

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Python 3.11+ (for backend)

### Installation

1. Install dependencies:

```bash
cd ui
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Package Electron app:

```bash
npm run electron:build
```

## Technology Stack

- **Framework**: React 18.2 with TypeScript
- **Desktop**: Electron 25.3
- **Styling**: Tailwind CSS 3.3
- **State Management**: Zustand
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Vite

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run electron:dev` - Run Electron in development
- `npm run electron:build` - Build Electron installers
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run test suite

## Component System

Uses Atomic Design pattern:

- **Atoms**: Button, Input, Badge, Card, Modal, Spinner
- **Molecules**: SearchBox, StatusBar, AlertCard
- **Organisms**: ProcessTable, Layout, Dashboard
- **Pages**: Dashboard, Incidents, Settings

All components include:
- Full TypeScript typing
- WCAG AA accessibility support
- Dark mode support
- Responsive design
- Keyboard navigation

## Accessibility Features

- ♿ WCAG AA compliant
- ⌨️ Full keyboard navigation
- 🔊 Screen reader support
- 🎨 High contrast mode ready
- 👁️ Focus indicators

## Contributing

1. Follow the atomic design pattern
2. Include accessibility attributes
3. Support dark mode
4. Write TypeScript types
5. Add unit tests

## License

MIT - See LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.
