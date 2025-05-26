# I Love Lamps - Troubleshooting Guide

This guide helps resolve common issues encountered during development.

## Table of Contents
- [Authentication Issues](#authentication-issues)
- [Database/Supabase Issues](#databasesupabase-issues)
- [API Issues](#api-issues)
- [Development Environment](#development-environment)
- [Build and Deploy Issues](#build-and-deploy-issues)

## Authentication Issues

### Problem: "User is not authenticated" error on API calls
**Symptoms**: 401 errors when calling API endpoints

**Solutions**:
1. Check if you're logged in:
   ```bash
   # In browser console
   localStorage.getItem('supabase.auth.token')
   ```

2. For API testing, get a fresh token:
   ```bash
   node scripts/get-auth-token.js
   ```

3. Ensure cookies are being sent:
   ```typescript
   // Client-side API calls should use the apiFetch wrapper
   import { apiFetch } from '@/lib/api/client'
   const data = await apiFetch('/api/flashlights')
   ```

### Problem: Authentication redirects not working
**Symptoms**: User stays on auth pages after login

**Solutions**:
1. Check middleware configuration in `src/middleware.ts`
2. Ensure client-side navigation is used:
   ```typescript
   // Use router.push() not window.location
   import { useRouter } from 'next/navigation'
   const router = useRouter()
   router.push('/collection')
   ```

### Problem: Session expires too quickly
**Symptoms**: Users logged out after short period

**Solutions**:
1. Check Supabase JWT expiry settings in dashboard
2. Implement token refresh in middleware
3. Consider implementing "remember me" functionality

## Database/Supabase Issues

### Problem: RLS policies blocking access
**Symptoms**: Empty results when data should exist, or permission denied errors

**Solutions**:
1. Check RLS policies in Supabase dashboard
2. Test with service role key (bypasses RLS):
   ```bash
   # In .env.local
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   ```
3. Verify user ID matches:
   ```sql
   -- Run in Supabase SQL editor
   SELECT * FROM flashlights WHERE user_id = 'your-user-id';
   ```

### Problem: Database migrations not applying
**Symptoms**: Missing tables or columns

**Solutions**:
1. Apply migrations manually via Supabase dashboard
2. Check migration syntax:
   ```sql
   -- Ensure proper PostgreSQL syntax
   -- Check for missing semicolons
   ```
3. Verify you're connected to the right project:
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```

### Problem: Foreign key constraints failing
**Symptoms**: Cannot insert emitters, "violates foreign key constraint"

**Solutions**:
1. Ensure parent record exists first
2. Check ID types match (uuid vs integer)
3. Insert in transaction:
   ```typescript
   // Insert flashlight first, then emitters
   const { data: flashlight } = await supabase
     .from('flashlights')
     .insert({...})
     .select()
     .single()
   
   if (flashlight) {
     await supabase
       .from('emitters')
       .insert({ flashlight_id: flashlight.id, ... })
   }
   ```

## API Issues

### Problem: CORS errors in development
**Symptoms**: "Access-Control-Allow-Origin" errors

**Solutions**:
1. Ensure you're using the correct URL:
   ```typescript
   // Use relative URLs in production
   fetch('/api/flashlights')
   // Not: fetch('http://localhost:3000/api/flashlights')
   ```

2. Check Next.js API route headers:
   ```typescript
   // In API route
   return NextResponse.json(data, {
     headers: {
       'Access-Control-Allow-Origin': '*',
       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
     }
   })
   ```

### Problem: API returns 500 errors
**Symptoms**: "Internal Server Error" responses

**Solutions**:
1. Check server logs:
   ```bash
   # In terminal running dev server
   # Look for error stack traces
   ```

2. Add error logging to API routes:
   ```typescript
   try {
     // ... your code
   } catch (error) {
     console.error('API Error:', error)
     return NextResponse.json(
       { error: 'Internal server error', details: error.message },
       { status: 500 }
     )
   }
   ```

3. Verify environment variables are loaded

### Problem: Request body is empty
**Symptoms**: `undefined` when accessing `request.json()`

**Solutions**:
1. Ensure Content-Type header is set:
   ```typescript
   fetch('/api/flashlights', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(data)
   })
   ```

2. Check if body was already consumed:
   ```typescript
   // Only call request.json() once
   const body = await request.json()
   ```

## Development Environment

### Problem: "Module not found" errors
**Symptoms**: Import errors after pulling changes

**Solutions**:
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check TypeScript paths in `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

### Problem: Hot reload not working
**Symptoms**: Changes don't appear without manual refresh

**Solutions**:
1. Check for syntax errors in code
2. Restart dev server:
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```
3. Clear Next.js cache:
   ```bash
   rm -rf .next
   ```

### Problem: TypeScript errors that shouldn't exist
**Symptoms**: Red squiggles in editor but code runs

**Solutions**:
1. Restart TypeScript server in VS Code:
   - Cmd+Shift+P → "TypeScript: Restart TS Server"
2. Check for duplicate type definitions
3. Ensure `node_modules/@types` is up to date

## Build and Deploy Issues

### Problem: Build fails with "window is not defined"
**Symptoms**: Build error referencing browser-only APIs

**Solutions**:
1. Wrap browser code in useEffect:
   ```typescript
   useEffect(() => {
     // Browser-only code here
     if (typeof window !== 'undefined') {
       // Safe to use window
     }
   }, [])
   ```

2. Use dynamic imports for client-only components:
   ```typescript
   const ClientOnlyComponent = dynamic(
     () => import('@/components/ClientOnly'),
     { ssr: false }
   )
   ```

### Problem: Environment variables not available in production
**Symptoms**: API calls fail, auth doesn't work

**Solutions**:
1. Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side
2. Add variables to Vercel/hosting platform
3. Check `.env.local` is not committed to git

### Problem: "Hydration mismatch" errors
**Symptoms**: Console errors about server/client mismatch

**Solutions**:
1. Ensure consistent rendering:
   ```typescript
   // Bad: Date will differ between server and client
   <p>{new Date().toLocaleString()}</p>
   
   // Good: Use state for client-side values
   const [date, setDate] = useState<string>()
   useEffect(() => {
     setDate(new Date().toLocaleString())
   }, [])
   ```

2. Check for browser-only code in initial render

## Getting Help

If you encounter issues not covered here:

1. Check the browser console for errors
2. Look at Network tab for failed requests
3. Review Supabase logs in dashboard
4. Search error messages in project dependencies' issues
5. Ask in the project discussions with:
   - Error message
   - Steps to reproduce
   - What you've already tried

## Common Commands for Debugging

```bash
# Check Node version
node --version  # Should be 18+

# Clear all caches
rm -rf .next node_modules package-lock.json
npm install
npm run dev

# Check environment variables
npm run env:check  # If script exists

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

Remember: Most issues can be solved by carefully reading error messages and checking logs!