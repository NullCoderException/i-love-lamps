# I Love Lamps - Development Guide

This document outlines development practices and workflows for the I Love Lamps project.

## Git Workflow

### Branching Strategy

- `main`: Production-ready code
- `develop`: Integration branch for features (optional)
- Feature branches: `feature/description`
- Bug fix branches: `fix/description`
- Documentation branches: `docs/description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Formatting changes
- `refactor:` - Code restructuring without behavior change
- `test:` - Adding or fixing tests
- `chore:` - Maintenance tasks

Example: `feat: add flashlight detail page`

### Pull Request Process

1. Create a feature branch from `main` or `develop`
2. Make changes and commit with descriptive messages
3. Push branch and create PR
4. Ensure tests pass
5. Request review
6. Merge after approval

## Coding Standards

### TypeScript

- Use explicit types (avoid `any`)
- Create interfaces for component props
- Use type guards for runtime type checking
- Leverage generics for reusable components

### React

- Use functional components with hooks
- Break complex components into smaller ones
- Use React Context for state that spans multiple components
- Add meaningful component and prop names

### CSS/Tailwind

- Use Tailwind utility classes
- Create component abstractions for repeated patterns
- Use consistent spacing and sizing scales

## Testing

- Write unit tests for utility functions
- Create component tests for UI components
- Test key user flows with integration tests

## Development Environment

### VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens

### Environment Variables

Required variables for local development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Common Tasks

### Starting Development Server

```bash
npm run dev
# Visit http://localhost:3000
```

### Running Database Migrations

1. **Local development** (using Supabase Dashboard):
   ```bash
   # Navigate to SQL editor in Supabase Dashboard
   # Copy contents of migration file
   # Run in SQL editor
   ```

### Data Migration Scripts

Scripts for migrating legacy data to the dynamic schema:

```bash
# Main migration script - migrates TypeScript flashlight data
node scripts/migrate-real-data.js

# Authentication helper - extracts JWT tokens for API testing
node scripts/get-auth-token.js

# Test migration script - example with sample data
node scripts/migrate-flashlights-fixed.js
```

**Environment Variables for Migration:**
- `LIGHTS_DATA_PATH` (optional): Path to legacy TypeScript data directory
- `MIGRATION_USER_ID`: User ID for migration (from `scripts/get-auth-token.js`)
- `SUPABASE_SERVICE_KEY`: Service role key for direct DB access

**Migration Process:**
1. Reads TypeScript flashlight data from external project
2. Converts enum references to string values
3. Creates missing emitter types automatically
4. Maintains proper foreign key relationships
5. Validates data integrity and cleans duplicates

2. **Via Supabase CLI** (if installed):
   ```bash
   supabase db push
   ```

### Testing API Endpoints

1. **Using the HTTP test file**:
   ```bash
   # Install REST Client extension in VS Code
   # Open http/flashlights.http
   # Click "Send Request" on any endpoint
   ```

2. **Getting auth token for testing**:
   ```bash
   # Make sure you're logged in to the app first
   node scripts/get-auth-token.js
   # Copy the token and use in Authorization header
   ```

3. **Using cURL**:
   ```bash
   # Get token first
   TOKEN=$(node scripts/get-auth-token.js)
   
   # List flashlights
   curl http://localhost:3000/api/flashlights \
     -H "Authorization: Bearer $TOKEN"
   
   # Create flashlight
   curl -X POST http://localhost:3000/api/flashlights \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"manufacturer": "Zebralight", "model": "SC64w HI"}'
   ```

### Adding a New Feature

Example: Adding a new field to flashlights

1. **Update the database**:
   ```sql
   -- Create migration file: database/migrations/004_add_weight_field.sql
   ALTER TABLE flashlights ADD COLUMN weight_grams INTEGER;
   ```

2. **Update TypeScript types**:
   ```typescript
   // src/types/flashlight.ts
   export interface Flashlight {
     // ... existing fields
     weight_grams?: number
   }
   ```

3. **Update UI components**:
   ```typescript
   // src/components/flashlights/AddFlashlightModal.tsx
   <input
     type="number"
     name="weight_grams"
     placeholder="Weight (grams)"
     className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
   />
   ```

4. **Test the feature**:
   - Add a flashlight with the new field
   - Verify it saves to database
   - Check it displays correctly

### Creating a New Component

Example: Creating a reusable Badge component

1. **Create the component**:
   ```typescript
   // src/components/ui/Badge.tsx
   interface BadgeProps {
     variant: 'success' | 'warning' | 'info' | 'error'
     children: React.ReactNode
   }
   
   export function Badge({ variant, children }: BadgeProps) {
     const variants = {
       success: 'bg-green-900 text-green-200',
       warning: 'bg-amber-900 text-amber-200',
       info: 'bg-blue-900 text-blue-200',
       error: 'bg-red-900 text-red-200'
     }
     
     return (
       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
         {children}
       </span>
     )
   }
   ```

2. **Use the component**:
   ```typescript
   import { Badge } from '@/components/ui/Badge'
   
   <Badge variant="success">Owned</Badge>
   ```

### Working with Server vs Client Components

**Server Component** (default in app directory):
```typescript
// src/app/collection/page.tsx
import { createClient } from '@/lib/supabase/server'

export default async function CollectionPage() {
  const supabase = createClient()
  const { data: flashlights } = await supabase
    .from('flashlights')
    .select('*')
  
  return <FlashlightList flashlights={flashlights} />
}
```

**Client Component** (when you need interactivity):
```typescript
// src/components/flashlights/FlashlightCard.tsx
'use client'  // This directive makes it a client component

import { useState } from 'react'

export function FlashlightCard({ flashlight }) {
  const [isEditing, setIsEditing] = useState(false)
  
  // Can use hooks, event handlers, browser APIs
  return (
    <div onClick={() => setIsEditing(true)}>
      {/* ... */}
    </div>
  )
}
```

### Debugging Tips

1. **Enable verbose logging**:
   ```typescript
   // Temporarily add to debug
   console.log('API Response:', JSON.stringify(data, null, 2))
   ```

2. **Check network requests**:
   - Open DevTools → Network tab
   - Look for failed requests (red)
   - Check request/response headers and body

3. **Debug authentication**:
   ```typescript
   // In any component
   import { createClient } from '@/lib/supabase/client'
   
   const supabase = createClient()
   const { data: { user } } = await supabase.auth.getUser()
   console.log('Current user:', user)
   ```

### Performance Optimization

1. **Use dynamic imports for large components**:
   ```typescript
   import dynamic from 'next/dynamic'
   
   const HeavyComponent = dynamic(
     () => import('@/components/HeavyComponent'),
     { 
       loading: () => <p>Loading...</p>,
       ssr: false  // Only if component uses browser APIs
     }
   )
   ```

2. **Optimize images**:
   ```typescript
   import Image from 'next/image'
   
   <Image
     src="/flashlight.jpg"
     alt="Flashlight"
     width={300}
     height={200}
     placeholder="blur"
   />
   ```
