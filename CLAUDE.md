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
- Search and filter collections with real-time results
- Sort by multiple criteria (model, manufacturer, price, date)
- Navigate large collections with smart pagination
- Track acquisition status and purchase history
- Manage dynamic manufacturers and emitter types
- Export and import collection data (planned)
- Visualize collection statistics (planned)
- Receive AI recommendations based on preferences (planned)

### Technology Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes + Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Vector Storage**: Supabase pgvector (for AI features)
- **Hosting**: Vercel (frontend) + Supabase (backend)
- **CI/CD**: GitHub Actions

## Current Development Phase

**Phase 5 Track A: UI/UX Enhancements Complete ✅** - See [PROJECT_PLAN.md](./PROJECT_PLAN.md) for detailed progress

### 🎉 Phase 5 Track A Achievement: Professional Collection Management
- **Search & Filtering System**: Real-time search with debounced input and dynamic filter dropdowns
- **Smart Pagination**: Configurable items per page (12-96) with intelligent navigation controls
- **Comprehensive Sorting**: Sort by model, manufacturer, price, dates with ascending/descending options
- **Filter Management**: Active filter count display, one-click clear filters, automatic pagination reset
- **Performance Optimized**: Memoized calculations, efficient state management, and responsive updates
- **Modular Components**: Reusable FilterBar, Pagination, and SortControl components with full TypeScript support

### 🎯 Previous Migration Milestones
- **Frontend Migration**: Full dynamic schema integration with API-driven dropdowns
- **55 flashlights** successfully migrated from legacy TypeScript collection
- **78 emitters** with proper type relationships established  
- **34 emitter types** automatically created during migration
- All data validated and duplicates cleaned up
- Migration infrastructure ready for future data imports

## Key Development Information

### Authentication
- **Dual auth support**: Cookie-based (web UI) and Bearer tokens (API)
- **Auth helper**: `src/lib/auth/api.ts` - `authenticateRequest()` handles both methods
- **API testing**: Use `scripts/get-auth-token.js` to extract JWT tokens for testing

### API Structure
```
# Core Flashlight APIs
GET    /api/flashlights         - List all flashlights (✅ implemented)
POST   /api/flashlights         - Create flashlight (✅ implemented)
POST   /api/flashlights/bulk    - Bulk import flashlights (✅ implemented)
GET    /api/flashlights/[id]    - Get specific flashlight (✅ implemented)
PUT    /api/flashlights/[id]    - Update flashlight (✅ implemented)
DELETE /api/flashlights/[id]    - Delete flashlight (✅ implemented)

# Lookup Data APIs (NEW)
GET    /api/manufacturers       - List all manufacturers (✅ implemented)
GET    /api/emitter-types       - List all emitter types (✅ implemented)
```

### Testing API Endpoints
- HTTP test file: `http/flashlights.http` (VS Code REST Client)
- Required headers: `Authorization: Bearer <token>` and `Content-Type: application/json`

### Database
- Migrations in `database/migrations/` (`.pgsql` extension for PostgreSQL-specific features)
- RLS policies applied to all tables
- **NEW Supabase project ID: `gpveyngmqmmwhluaaror`** ("I Love Lamps v2")
- **OLD project (inactive): `zvmtqpojnoohrmvygznr`**
- **Dynamic Schema**: 
  - Lookup tables: `manufacturers`, `emitter_types` (with proper FKs)
  - String-based fields: `finish`, `battery_type`, `driver`, `ui`, `ip_rating`
  - Status constraints: `Wanted`, `Ordered`, `Owned`, `Sold`
  - Shipping Status: `Received`, `Shipped`, `Ordered`

### Migration Scripts
- **Data Migration**: `scripts/migrate-real-data.js` - Migrates TypeScript data to dynamic schema
- **Auth Helper**: `scripts/get-auth-token.js` - Extracts JWT tokens for API testing
- **Working Reference**: `scripts/migrate-flashlights-fixed.js` - Example with test data

### Common Commands
```bash
npm run dev          # Start development server
npm run lint         # Run linter
npm run typecheck    # Run TypeScript checks (if available)
```
