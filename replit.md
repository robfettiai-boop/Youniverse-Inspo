# Inspiration of the Day - Motivational Quotes App

## Overview

Inspiration of the Day is a web application that delivers carefully curated motivational quotes to inspire users. The app features a clean, modern interface built with React and TypeScript, displaying random quotes with beautiful typography and smooth animations. Users can get fresh inspiration with each visit, share quotes, and enjoy a responsive design that works across all devices.

The application follows a full-stack architecture with a React frontend, Express.js backend, and PostgreSQL database integration through Drizzle ORM. It's designed to be simple yet engaging, focusing on delivering inspirational content in an aesthetically pleasing way.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Styling**: Tailwind CSS with custom CSS variables for theming and shadcn/ui components for consistent UI elements
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds
- **Component System**: Radix UI primitives with custom styling through shadcn/ui components

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Development**: Hot reload support with Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations and schema management
- **Schema**: Simple relational design with quotes and users tables
- **Migrations**: Drizzle Kit for database schema migrations
- **Fallback**: In-memory storage implementation for development/testing with seeded quote data

### Authentication and Authorization
- **Current State**: Basic user schema defined but authentication not yet implemented
- **Prepared Infrastructure**: User table with username/password fields ready for future authentication features
- **Session Management**: connect-pg-simple package included for PostgreSQL session storage when authentication is implemented

### API Structure
- **GET /api/quotes/random**: Retrieves a random motivational quote
- **GET /api/quotes**: Fetches all available quotes
- **POST /api/quotes**: Creates new quotes (prepared for admin functionality)
- **Response Format**: Consistent JSON responses with proper error handling
- **Validation**: Zod schemas for request/response validation using drizzle-zod integration

### Design System
- **Typography**: Inter font family for modern, readable text
- **Color Scheme**: Custom CSS variables supporting light theme with purple accent colors
- **Components**: Comprehensive UI component library based on Radix UI primitives
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Animations**: CSS animations for floating elements and smooth transitions

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Connection**: @neondatabase/serverless for database connectivity

### UI and Styling
- **Radix UI**: Comprehensive set of low-level UI primitives for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind CSS
- **Lucide React**: Icon library for consistent iconography

### Development and Build Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

### State Management and Data Fetching
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema definition

### Utility Libraries
- **clsx & tailwind-merge**: Conditional CSS class management
- **date-fns**: Date manipulation and formatting
- **wouter**: Lightweight routing solution for React

### Development Environment
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **Runtime Error Overlay**: Enhanced error reporting during development
- **Cartographer**: Development tooling for Replit environment