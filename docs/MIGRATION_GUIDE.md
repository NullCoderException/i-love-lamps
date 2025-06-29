# Flashlight Data Migration Guide

This guide explains how to migrate your flashlight data from the old hard-coded array to the new dynamic database schema.

## Prerequisites

1. Ensure you have your Supabase project set up with the latest schema
2. Have your `.env.local` file configured with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY` (for direct migration)

## Migration Options

### Option 1: Direct Database Migration (Recommended)

This method uses the Supabase service key to directly insert data, bypassing RLS policies.

1. **Get your User ID:**
   ```bash
   node scripts/get-auth-token.js
   ```
   Follow the prompts and save the `MIGRATION_USER_ID` to your `.env.local`

2. **Run the migration:**
   ```bash
   npm run migrate:flashlights
   ```

### Option 2: API-Based Migration

This method uses the bulk import API endpoint with JWT authentication.

1. **Get your Auth Token:**
   ```bash
   node scripts/get-auth-token.js
   ```
   Follow the prompts and save the `AUTH_TOKEN` to your `.env.local`

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Run the API migration:**
   ```bash
   npm run migrate:flashlights:api
   ```

## Migration Details

The migration scripts will:

1. Read the flashlight data from `/Users/christopherthomas/Code/lights/packages/shared/src/data/lights.ts`
2. Transform enum values to match the new schema
3. Map manufacturers to their database IDs
4. Create new emitter types if they don't exist
5. Handle status mappings (e.g., `NEW`/`ACTIVE` → `Owned`)
6. Properly link emitters to flashlights through the junction table

## Status Mappings

| Old Status | New Status |
|------------|------------|
| NEW        | Owned      |
| ACTIVE     | Owned      |
| STORAGE    | Owned      |
| GIFTED     | Sold       |
| RETIRED    | Owned      |

| Old Shipping Status | New Shipping Status |
|---------------------|---------------------|
| RECEIVED            | Received            |
| IN_TRANSIT          | Shipped             |
| ORDERED             | Ordered             |

## Troubleshooting

### Missing Manufacturer
If you see "Manufacturer not found" errors, ensure all manufacturers from your data exist in the `manufacturers` table.

### Authentication Failed
- For direct migration: Ensure `SUPABASE_SERVICE_KEY` is set correctly
- For API migration: Ensure your auth token is valid (tokens expire after 1 hour)

### Emitter Type Creation Failed
The scripts will attempt to create missing emitter types automatically. If this fails, check your database permissions.

## Post-Migration

After successful migration:

1. Verify data integrity by checking the flashlights in your app
2. Review any failed imports in the migration summary
3. Consider removing the bulk import endpoint if no longer needed
4. Update your TypeScript types to use the dynamic data

## Next Steps

Once migration is complete, you can:
- Remove hard-coded enum dependencies
- Generate TypeScript types from your database schema
- Implement dynamic lookup tables in your UI