# I Love Lamps - Flashlight Collection Tracker

Welcome to the I Love Lamps project guide. This document serves as the central hub for project documentation and development guidance.

## Quick Links

- [Project Plan](./PROJECT_PLAN.md) - Roadmap, milestones, and development phases
- [Directory Structure](./DIRECTORY_STRUCTURE.md) - File organization and architecture
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Coding standards, git workflow, and best practices
- [UI Style Guide](./UI_STYLE_GUIDE.md) - Visual design patterns and component conventions
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions

## Project Overview

I Love Lamps is a TypeScript-based flashlight collection tracker that helps enthusiasts:

- Catalog detailed flashlight specifications
- Track acquisition status and purchase history
- Visualize collection statistics
- Export and import collection data
- Search through flashlight documentation
- Receive recommendations based on preferences

### Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes + Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Vector Storage**: Supabase pgvector (for AI features)
- **Hosting**: Vercel (frontend) + Supabase (backend)
- **CI/CD**: GitHub Actions

## Current Development Phase

**Phase 2: Core Functionality** - See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed progress

## Key Development Information

### Authentication
- **Dual auth support**: Cookie-based (web UI) and Bearer tokens (API)
- **Auth helper**: `src/lib/auth/api.ts` - `authenticateRequest()` handles both methods
- **API testing**: Use `scripts/get-auth-token.js` to extract JWT tokens for testing

### API Structure
```
GET    /api/flashlights      - List all flashlights (✅ implemented)
POST   /api/flashlights      - Create flashlight (✅ implemented)
GET    /api/flashlights/[id] - Get specific flashlight (❌ not yet)
PUT    /api/flashlights/[id] - Update flashlight (❌ not yet)
DELETE /api/flashlights/[id] - Delete flashlight (❌ not yet)
```

### Testing API Endpoints
- HTTP test file: `http/flashlights.http` (VS Code REST Client)
- Required headers: `Authorization: Bearer <token>` and `Content-Type: application/json`

### Database
- Migrations in `database/migrations/`
- RLS policies applied to all tables
- Supabase project ID: `zvmtqpojnoohrmvygznr`

### Common Commands
```bash
npm run dev          # Start development server
npm run lint         # Run linter
npm run typecheck    # Run TypeScript checks (if available)
```
