# Overview

This is a full-stack web application featuring a love-themed shooting game called "My Jero💖 - Tiroteo de Amor". The project is built as a romantic, interactive browser game with a React frontend and Express.js backend. The game includes a cow character that shoots heart-shaped targets with background music, multiple difficulty levels, and a complete scoring system with visual effects.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and optimized builds
- **UI Components**: Comprehensive shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming, including love-themed color palette (purples, pinks, golds)
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Custom React hooks (useGameState, useAudioSystem) for game logic and audio management
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Game Architecture**: Modular component structure with separate systems for:
  - Game canvas rendering with HTML5 Canvas
  - Audio management with Web Audio API
  - Character animations (cow with floating, shooting, celebrating states)
  - UI overlays for score, timer, and game controls
  - Particle effects and visual feedback

## Backend Architecture
- **Runtime**: Node.js with Express.js framework using ESM modules
- **Development**: TypeScript with tsx for development server and esbuild for production builds
- **Storage**: Dual storage strategy with MemStorage for development and PostgreSQL with Drizzle ORM for production
- **API Structure**: RESTful API design with `/api` prefix routing (routes currently empty but infrastructure ready)
- **Middleware**: Comprehensive middleware stack including JSON parsing, URL encoding, request logging with timing, and error handling

## Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL dialect
- **Schema**: User management system with username/password authentication
- **Migrations**: Drizzle Kit for schema migrations and database management
- **Validation**: Zod schemas for type-safe data validation and serialization

## Game Systems
- **Game States**: Menu, difficulty selection, instructions, settings, playing, and game over states
- **Difficulty Levels**: Three levels (easy, medium, hard) with different target sizes, speeds, and spawn rates
- **Audio System**: Background music with fade effects, volume controls, and sound effect generation using Web Audio API
- **Animation System**: CSS-based character animations with multiple cow states and smooth transitions
- **Scoring System**: Combo multipliers, accuracy tracking, floating score displays, and particle effects
- **Canvas Rendering**: Heart-shaped target drawing, bullet trajectories, and visual effects

## Development Configuration
- **Build System**: Vite with React plugin and Replit-specific development enhancements
- **TypeScript**: Strict configuration with path mapping for clean imports (@/, @shared/, @assets/)
- **Code Quality**: ESM module system with proper import/export patterns
- **Asset Management**: Static asset serving with audio file integration

# External Dependencies

## Frontend Dependencies
- **UI Framework**: React 18 ecosystem with @vitejs/plugin-react
- **UI Components**: Complete shadcn/ui component suite including:
  - Radix UI primitives for accessibility (dialogs, buttons, forms, tooltips)
  - Tailwind CSS for styling with custom game-themed variables
  - Lucide React for iconography
- **Game Development**: HTML5 Canvas API and Web Audio API for audio management
- **State Management**: TanStack Query v5 for server state and custom React hooks for game state
- **Routing**: Wouter for lightweight client-side routing
- **Utilities**: clsx and tailwind-merge for conditional styling, date-fns for date handling

## Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **Database**: 
  - Drizzle ORM for type-safe database operations
  - @neondatabase/serverless for PostgreSQL connection
  - connect-pg-simple for session management
- **Development Tools**: tsx for TypeScript execution, esbuild for production builds
- **Form Handling**: React Hook Form with Zod resolvers for validation

## Development Environment
- **Replit Integration**: Custom plugins for development banner, cartographer, and runtime error overlay
- **Build Tools**: PostCSS with Tailwind CSS and Autoprefixer
- **Audio Assets**: MP3 audio file integration for background music