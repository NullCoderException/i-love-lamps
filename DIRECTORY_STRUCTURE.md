# I Love Lamps - Directory Structure

This document outlines the directory structure for the I Love Lamps project and provides guidelines for organizing code.

## Project Structure

```
i-love-lamps/
├── .github/                    # GitHub workflows and CI/CD
├── public/                     # Static assets (images, fonts, etc.)
├── database/                   # Database related files
│   ├── migrations/            # Sequential migration scripts (001_, 002_, etc.)
│   └── seeds/                 # Sample data for development (future)
├── scripts/                    # Utility scripts (auth helpers, data import, etc.)
├── http/                       # HTTP test files for API testing
├── src/
│   ├── app/                   # Next.js App Router pages and API routes
│   │   ├── api/              # API route handlers
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   └── flashlights/  # Flashlight CRUD endpoints
│   │   ├── auth/             # Auth-related pages (signin, signup)
│   │   ├── collection/       # Flashlight collection pages
│   │   ├── stats/            # Statistics and analytics pages
│   │   └── (other pages)/    # Additional feature pages
│   ├── components/            # React components
│   │   ├── flashlights/      # Flashlight-specific components
│   │   │   ├── FlashlightCard.tsx
│   │   │   ├── FlashlightList.tsx
│   │   │   └── AddFlashlightModal.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/               # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       └── Input.tsx
│   ├── lib/                   # Utilities and services
│   │   ├── api/              # API client utilities
│   │   │   └── client.ts     # Fetch wrapper with auth
│   │   ├── auth/             # Authentication helpers
│   │   │   └── api.ts        # Server-side auth helpers
│   │   ├── supabase/         # Supabase configuration
│   │   │   ├── client.ts     # Browser client
│   │   │   ├── server.ts     # Server client
│   │   │   └── middleware.ts # Auth middleware
│   │   ├── hooks/            # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   └── useFlashlights.ts
│   │   └── utils/            # General utilities
│   │       ├── formatters.ts # Date, number formatters
│   │       └── validators.ts # Input validation
│   ├── types/                 # TypeScript type definitions
│   │   ├── flashlight.ts     # Flashlight-related types
│   │   ├── auth.ts           # Auth-related types
│   │   └── api.ts            # API response types
│   └── styles/                # Global styles (if needed beyond Tailwind)
├── .env.example               # Example environment variables
├── .env.local                 # Local environment variables (gitignored)
├── CLAUDE.md                  # Project guide for AI assistants
├── PROJECT_PLAN.md            # Project roadmap and progress
├── DIRECTORY_STRUCTURE.md     # This file
├── DEVELOPMENT_GUIDE.md       # Development guidelines
├── UI_STYLE_GUIDE.md         # UI/UX patterns and component guidelines
├── TROUBLESHOOTING.md        # Common issues and solutions
├── README.md                  # Public-facing documentation
└── [configuration files]      # tsconfig.json, package.json, etc.
```

## Organization Guidelines

### Components (`src/components/`)
- **Domain-specific**: Group by feature (e.g., `flashlights/`, `auth/`)
- **Shared UI**: Place in `ui/` for reusable components
- **One component per file**: Keep components focused
- **Colocate related files**: Keep styles, tests, and stories with components

### API Routes (`src/app/api/`)
- **RESTful structure**: `/api/[resource]/[id]`
- **Consistent naming**: Use plural nouns (e.g., `flashlights`, not `flashlight`)
- **Group related endpoints**: Keep auth endpoints together

### Types (`src/types/`)
- **Domain separation**: Separate files for different domains
- **Shared types**: Put in appropriate domain file
- **API types**: Include request/response types

### Utilities (`src/lib/`)
- **Feature grouping**: Group by functionality
- **Clear naming**: Function names should describe what they do
- **Pure functions**: Prefer pure functions for utilities

## File Naming Conventions

- **Components**: PascalCase (e.g., `FlashlightCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase for interfaces/types
- **API Routes**: lowercase with hyphens if needed
- **Test files**: `*.test.ts` or `*.spec.ts`

## Import Order (recommended)

1. External libraries (`react`, `next`, etc.)
2. Absolute imports from `@/` alias
3. Relative imports from parent directories
4. Relative imports from current directory
5. Style imports

Example:
```typescript
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils/formatters'
import { FlashlightCard } from './FlashlightCard'
```

This structure will be updated as the project evolves.
