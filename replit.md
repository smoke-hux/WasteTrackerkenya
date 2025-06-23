# YUGI - Smart Waste Management Platform

## Overview

YUGI is a mobile-first web application that connects residents with waste collectors to enable efficient waste pickup and recycling services. The platform features a dual-role system where residents can request waste pickups and collectors can manage their collection routes and jobs.

## System Architecture

The application follows a modern full-stack architecture with:

- **Frontend**: React with TypeScript using Vite as the build tool
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: TailwindCSS with shadcn/ui components
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Mobile-First Design**: Responsive design optimized for mobile devices

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Comprehensive schema including users, pickup requests, collections, illegal dumping reports, and waste metrics
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Migrations**: Managed through Drizzle Kit

### Authentication & Authorization
- **Role-Based Access**: Supports two user roles (resident and collector)
- **Simple Authentication**: Username/password based authentication
- **Session Management**: Local storage for session persistence
- **Demo Users**: Preset demo users for quick testing

### Frontend Architecture
- **Component Library**: shadcn/ui components for consistent UI
- **Styling**: TailwindCSS with custom color scheme for eco-friendly branding
- **Icons**: Lucide React icon library
- **Forms**: React Hook Form with Zod validation
- **Mobile Navigation**: Bottom navigation for mobile-first experience

### Backend Architecture
- **RESTful API**: Express.js routes for all CRUD operations
- **Storage Interface**: Abstract storage interface for database operations
- **Middleware**: Request logging and error handling
- **Development**: Hot reloading with Vite integration

### Core Features
- **Waste Pickup Requests**: Residents can request pickups with waste type selection
- **Collection Management**: Collectors can view and accept pickup jobs
- **Analytics Dashboard**: Waste metrics and environmental impact tracking
- **Illegal Dumping Reports**: Community reporting system
- **Map Integration**: Visual representation of pickup locations and routes
- **Real-time Updates**: Live status updates for pickup requests

## Data Flow

1. **User Authentication**: Users select their role and authenticate
2. **Resident Flow**: Create pickup requests → Track status → View analytics
3. **Collector Flow**: View available jobs → Accept jobs → Complete collections
4. **Data Persistence**: All interactions stored in PostgreSQL database
5. **Real-time Updates**: UI updates reflect database changes through React Query

## External Dependencies

- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **Drizzle ORM**: Type-safe database operations
- **TanStack Query**: Server state management and caching
- **Radix UI**: Accessible component primitives
- **Zod**: Runtime type validation
- **Express**: Backend web framework
- **Vite**: Frontend build tool and development server

## Deployment Strategy

- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Development**: Hot reloading with Vite dev server
- **Production**: Static frontend served by Express backend
- **Database**: Serverless PostgreSQL on Neon platform
- **Hosting**: Configured for Replit deployment with autoscale target

## Changelog

Changelog:
- June 23, 2025. Initial setup
- June 23, 2025. Added comprehensive dark/light mode theme system with toggle functionality
- June 23, 2025. Rebranded application from "EcoCollect" to "YUGI"

## User Preferences

Preferred communication style: Simple, everyday language.