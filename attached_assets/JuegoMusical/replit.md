# Overview

This is a full-stack web application featuring a love-themed shooting game called "My Jero💖 - Tiroteo de Amor". The project is built as a romantic, interactive browser game with a React frontend and Express backend, designed as a personalized gift application. The game includes features like difficulty selection, audio management, score tracking, and animated characters, all wrapped in a love-themed Spanish interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Components**: Comprehensive shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming, including game-specific color palette
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with custom game logic hooks (useGame, useAudio)
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Game Components**: Modular game architecture with separate components for audio management, character animation, UI, and canvas rendering

## Backend Architecture
- **Runtime**: Node.js with Express.js framework using ESM modules
- **Development**: TypeScript with tsx for development server and esbuild for production builds
- **Storage**: Dual storage strategy with in-memory storage (MemStorage) for development and PostgreSQL with Drizzle ORM for production
- **API Structure**: RESTful API design with `/api` prefix routing
- **Middleware**: JSON parsing, URL encoding, logging, and error handling middleware

## Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: User management with username/password authentication
- **Migrations**: Drizzle Kit for schema migrations and database management
- **Validation**: Zod schemas for type-safe data validation

## Game Architecture
- **Game States**: Menu, playing, paused, and game over states
- **Difficulty System**: Three difficulty levels (easy, medium, hard) with different time limits and point multipliers
- **Audio System**: Background music with fade in/out effects, volume control, and music toggle
- **Animation System**: CSS-based character animations with cow character states (floating, shooting, celebrating)
- **Canvas Integration**: HTML5 Canvas setup for future game rendering features

## Development Configuration
- **Build System**: Vite with React plugin and development enhancements for Replit environment
- **TypeScript**: Strict configuration with path mapping for clean imports
- **Code Quality**: ESM module system with proper import/export patterns
- **Asset Management**: Static asset serving with proper path resolution

# External Dependencies

## Frontend Dependencies
- **UI Framework**: React 18 ecosystem with @vitejs/plugin-react
- **UI Components**: Complete shadcn/ui component suite with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with PostCSS and Autoprefixer
- **State Management**: @tanstack/react-query for server state, React Hook Form with @hookform/resolvers
- **Utilities**: clsx and class-variance-authority for conditional styling, date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography
- **Carousels**: Embla Carousel React for UI carousels

## Backend Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm with drizzle-zod for schema validation
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: tsx for TypeScript execution, esbuild for production builds

## Development Tools
- **Build Tools**: Vite with TypeScript support and React Fast Refresh
- **Database Tools**: drizzle-kit for migrations and schema management
- **Replit Integration**: Custom Vite plugins for Replit development environment (@replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer, @replit/vite-plugin-dev-banner)

## Game-Specific Assets
- **Audio**: Background music support with HTML5 Audio API
- **Fonts**: Google Fonts integration (Georgia, DM Sans, Fira Code, Geist Mono, Architects Daughter)
- **Theming**: Custom CSS variables for game-specific color schemes and responsive design