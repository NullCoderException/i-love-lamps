# I Love Lamps - UI Style Guide

This guide outlines the visual design patterns, component conventions, and UI/UX principles for the I Love Lamps project.

## Design Principles

1. **Dark-First Design**: Our primary theme is dark to reduce eye strain during extended use
2. **Information Density**: Show relevant flashlight details without overwhelming the user
3. **Responsive**: Works seamlessly from mobile to desktop
4. **Accessible**: Follow WCAG guidelines for contrast and usability

## Color Palette

### Dark Theme (Primary)
```css
/* Background Colors */
--bg-primary: #0a0a0a;      /* Main background */
--bg-secondary: #171717;    /* Cards, modals */
--bg-tertiary: #262626;     /* Hover states, inputs */

/* Text Colors */
--text-primary: #fafafa;    /* Main text */
--text-secondary: #a3a3a3;  /* Secondary text */
--text-tertiary: #737373;   /* Muted text */

/* Brand Colors */
--brand-primary: #3b82f6;   /* Primary blue */
--brand-secondary: #1d4ed8; /* Darker blue for hover */

/* Status Colors */
--status-owned: #10b981;    /* Green - Owned items */
--status-wanted: #f59e0b;   /* Amber - Wishlist items */
--status-ordered: #3b82f6;  /* Blue - On order */
--status-sold: #ef4444;     /* Red - Sold items */

/* Utility Colors */
--border: #262626;          /* Borders */
--divider: #404040;         /* Dividers */
--error: #ef4444;           /* Error states */
--success: #10b981;         /* Success states */
```

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes (Using Tailwind Classes)
- **Headings**:
  - h1: `text-4xl font-bold` (36px)
  - h2: `text-3xl font-semibold` (30px)
  - h3: `text-2xl font-semibold` (24px)
  - h4: `text-xl font-medium` (20px)
- **Body**: `text-base` (16px)
- **Small**: `text-sm` (14px)
- **Tiny**: `text-xs` (12px)

## Spacing System

Use Tailwind's spacing scale consistently:
- **Tight**: `space-y-2` (8px)
- **Normal**: `space-y-4` (16px)
- **Relaxed**: `space-y-6` (24px)
- **Loose**: `space-y-8` (32px)

## Component Patterns

### Cards
```tsx
<div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
  {/* Card content */}
</div>
```

### Buttons

#### Primary Button
```tsx
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  Action
</button>
```

#### Secondary Button
```tsx
<button className="bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors">
  Secondary
</button>
```

#### Ghost Button
```tsx
<button className="hover:bg-gray-800 text-gray-300 hover:text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors">
  Ghost
</button>
```

### Form Inputs

#### Text Input
```tsx
<input
  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter value..."
/>
```

#### Select Dropdown
```tsx
<select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  <option value="">Select option...</option>
  <option value="value">Option</option>
</select>
```

### Modals
```tsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
  <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
    <h2 className="text-2xl font-semibold mb-4">Modal Title</h2>
    {/* Modal content */}
  </div>
</div>
```

## Status Indicators

### Ownership Status Colors
- **Owned**: Green badge/text (`text-green-500`)
- **Wanted**: Amber badge/text (`text-amber-500`)
- **Ordered**: Blue badge/text (`text-blue-500`)
- **Sold**: Red badge/text (`text-red-500`)

### Badge Component
```tsx
<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
  Owned
</span>
```

## Icons and Imagery

- Use lucide-react icons for consistency
- Keep icons at 16-24px for most uses
- Use subtle animations for interactions

## Responsive Breakpoints

Follow Tailwind's default breakpoints:
- **Mobile**: < 640px (default)
- **Tablet**: `sm:` 640px+
- **Laptop**: `md:` 768px+
- **Desktop**: `lg:` 1024px+
- **Wide**: `xl:` 1280px+

## Animation Guidelines

- Use `transition-colors` for color changes
- Use `transition-all` sparingly (prefer specific properties)
- Keep animations under 200ms for responsiveness
- Add `hover:scale-105` for interactive elements

## Interactive Components (Phase 5 Track A)

### FilterBar Component

A comprehensive filtering interface combining search, dropdowns, and sorting:

```tsx
<div className="mb-6 space-y-4">
  {/* Search Bar */}
  <div className="flex flex-col sm:flex-row gap-4">
    <input
      type="text"
      placeholder="Search flashlights..."
      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition-colors">
      Clear Filters (2)
    </button>
  </div>

  {/* Filter Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      <option value="all">All Manufacturers</option>
    </select>
  </div>

  {/* Results Count */}
  <div className="text-sm text-gray-400">
    Showing 24 of 55 flashlights
  </div>
</div>
```

**Styling Guidelines:**
- Use responsive grid layout (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- Consistent form input styling across all dropdowns
- Clear visual hierarchy with spacing (`space-y-4`)
- Subtle result count styling (`text-gray-400`)

### SortControl Component

Compact inline sorting control:

```tsx
<div className="flex items-center gap-2 text-sm">
  <label className="text-gray-300 whitespace-nowrap">Sort by:</label>
  <select className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-0">
    <option value="model-asc">Model (A-Z)</option>
    <option value="price-desc">Price (High to Low)</option>
  </select>
</div>
```

**Key Features:**
- Compact design with `text-sm` sizing
- Non-wrapping label (`whitespace-nowrap`)
- Flexible width select (`min-w-0`)
- Consistent focus states

### Pagination Component

Multi-feature pagination with items-per-page control:

```tsx
<div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-gray-800 rounded-lg">
  {/* Items per page */}
  <div className="flex items-center gap-2 text-sm text-gray-300">
    <span>Show:</span>
    <select className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-gray-100 text-sm">
      <option value="24">24</option>
      <option value="48">48</option>
    </select>
    <span>per page</span>
  </div>

  {/* Page info */}
  <div className="text-sm text-gray-300">
    Showing 1-24 of 55 items
  </div>

  {/* Page navigation */}
  <div className="flex items-center gap-1">
    <button className="px-3 py-1 rounded bg-gray-700 text-gray-100 text-sm hover:bg-gray-600 disabled:opacity-50 transition-colors">
      Previous
    </button>
    <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm">
      1
    </button>
    <button className="px-3 py-1 rounded bg-gray-700 text-gray-100 text-sm hover:bg-gray-600">
      2
    </button>
    <span className="px-2 text-gray-500 text-sm">...</span>
    <button className="px-3 py-1 rounded bg-gray-700 text-gray-100 text-sm hover:bg-gray-600">
      5
    </button>
    <button className="px-3 py-1 rounded bg-gray-700 text-gray-100 text-sm hover:bg-gray-600">
      Next
    </button>
  </div>
</div>
```

**Styling Patterns:**
- Container: `bg-gray-800 rounded-lg p-4` for elevated appearance
- Active page: `bg-blue-600 text-white` (brand primary color)
- Inactive pages: `bg-gray-700 text-gray-100 hover:bg-gray-600`
- Disabled states: `disabled:opacity-50 disabled:cursor-not-allowed`
- Ellipsis: `text-gray-500` for lower emphasis

## Component States

### Interactive States

#### Button States
```tsx
{/* Default */}
<button className="px-3 py-1 rounded bg-gray-700 text-gray-100 text-sm transition-colors">
  Default
</button>

{/* Hover */}
<button className="px-3 py-1 rounded bg-gray-700 text-gray-100 text-sm hover:bg-gray-600 transition-colors">
  Hover
</button>

{/* Active/Selected */}
<button className="px-3 py-1 rounded bg-blue-600 text-white text-sm">
  Active
</button>

{/* Disabled */}
<button className="px-3 py-1 rounded bg-gray-700 text-gray-100 text-sm opacity-50 cursor-not-allowed">
  Disabled
</button>
```

#### Form Control States
```tsx
{/* Default */}
<select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100">
  <option>Default</option>
</select>

{/* Focus */}
<select className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
  <option>Focus</option>
</select>
```

### Loading States
```tsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-800 rounded w-1/2"></div>
</div>
```

### Empty States
```tsx
<div className="text-center py-12">
  <p className="text-gray-500 mb-4">No flashlights in your collection yet</p>
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
    Add Your First Flashlight
  </button>
</div>
```

### Error States
```tsx
<div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
  <p className="text-red-400">Something went wrong. Please try again.</p>
</div>
```

## Responsive Design Patterns

### Layout Breakpoints and Behavior

The new interactive components follow mobile-first responsive patterns:

#### FilterBar Responsive Layout
```tsx
{/* Search bar: stacked on mobile, horizontal on sm+ */}
<div className="flex flex-col sm:flex-row gap-4">
  <input className="flex-1" />
  <button>Clear Filters</button>
</div>

{/* Filter grid: 1 column mobile, 2 tablet, 3 desktop */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <select>Manufacturer</select>
  <select>Emitter Type</select>  
  <select>Status</select>
</div>

{/* Sort control: separate row on mobile, inline on lg+ */}
<div className="flex flex-col lg:flex-row gap-4">
  <div className="flex-1">Filter dropdowns...</div>
  <div className="flex-shrink-0">Sort control...</div>
</div>
```

#### Pagination Responsive Layout
```tsx
{/* Stack on mobile, horizontal on sm+ */}
<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
  <div>Items per page control</div>
  <div>Page info</div>
  <div>Navigation buttons</div>
</div>
```

### Mobile-First Guidelines

1. **Start with mobile layout** (no prefix)
2. **Add larger breakpoints progressively** (`sm:`, `md:`, `lg:`, `xl:`)
3. **Use flex direction changes** (`flex-col sm:flex-row`)
4. **Adjust grid columns** (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
5. **Control element sizing** (`flex-1`, `flex-shrink-0`)

## TypeScript Patterns and Conventions

### Component Interface Design

#### Comprehensive Props Interface
```typescript
interface FilterBarProps {
  // State props (controlled component pattern)
  searchTerm: string
  selectedManufacturer: string
  selectedEmitterType: string
  selectedStatus: string
  sortBy: SortOption
  
  // Event handler props (callback pattern)
  onSearchChange: (term: string) => void
  onManufacturerChange: (manufacturer: string) => void
  onEmitterTypeChange: (type: string) => void
  onStatusChange: (status: string) => void
  onSortChange: (sort: SortOption) => void
  onClearFilters: () => void
  
  // Data props (lookup data)
  manufacturers: Manufacturer[]
  emitterTypes: EmitterType[]
  
  // Computed props (derived state)
  activeFilterCount: number
  resultCount: number
  totalCount: number
}
```

#### Type-Safe Sort Options
```typescript
export type SortField = 'model' | 'manufacturer' | 'purchase_date' | 'price' | 'status' | 'created_at'
export type SortDirection = 'asc' | 'desc'

export interface SortOption {
  field: SortField
  direction: SortDirection
}
```

#### Union Types for Status
```typescript
type FlashlightStatus = 'Wanted' | 'Ordered' | 'Owned' | 'Sold'
type ShippingStatus = 'Received' | 'Shipped' | 'Ordered'
```

### Component Export Patterns

```typescript
// Named export for components that may be imported with others
export default FilterBar

// Named export for types/interfaces that need to be imported
export type { SortOption, SortField, SortDirection }

// Default export for main component
const SortControl: FC<SortControlProps> = ({ sortBy, onSortChange }) => {
  // Component logic
}

export default SortControl
```

### Performance-Oriented TypeScript

#### Callback Memoization Types
```typescript
// Memoized callbacks with proper typing
const handleSortChange = useCallback((newSort: SortOption) => {
  setSortBy(newSort)
  setCurrentPage(1)
}, [])

const handlePageChange = useCallback((page: number) => {
  setCurrentPage(page)
}, [])
```

#### Memoized Computation Types
```typescript
const filteredFlashlights = useMemo((): Flashlight[] => {
  // Explicit return type for complex computations
  let filtered = flashlights
  // Filtering logic...
  return sorted
}, [flashlights, debouncedSearchTerm, selectedManufacturer, selectedEmitterType, selectedStatus, sortBy])
```

## Accessibility Guidelines

1. **Color Contrast**: Maintain WCAG AA standards (4.5:1 for normal text)
2. **Focus States**: Always visible, use `focus:ring-2 focus:ring-blue-500`
3. **Alt Text**: Provide for all images
4. **ARIA Labels**: Use for icon-only buttons
5. **Keyboard Navigation**: Ensure all interactive elements are reachable

## Do's and Don'ts

### Do's ✅
- Use consistent spacing (`space-y-4`, `gap-4`)
- Maintain visual hierarchy with typography scale
- Keep interactions predictable and responsive
- Test on multiple screen sizes (mobile-first)
- Use semantic HTML (`<label>`, `<select>`, proper buttons)
- Implement proper TypeScript interfaces for component props
- Use controlled components with explicit state management
- Apply consistent focus states (`focus:ring-2 focus:ring-blue-500`)
- Debounce search inputs for performance (`useDebounce`)
- Memoize expensive computations (`useMemo`, `useCallback`)
- Reset pagination when filters change
- Provide clear visual feedback (active states, disabled states)

### Don'ts ❌
- Mix different button styles in the same context
- Use pure black (#000000) backgrounds
- Rely on color alone to convey information
- Create custom breakpoints (stick to Tailwind defaults)
- Override Tailwind's default scale
- Use uncontrolled components for complex state
- Forget to handle loading and error states
- Skip TypeScript types for component interfaces
- Implement filtering without debouncing
- Ignore responsive design on interactive components
- Use hardcoded values in place of dynamic lookup data
- Create pagination without proper math calculations
- Skip accessibility attributes (`aria-label`, `htmlFor`)

### Interactive Component Guidelines ✅

#### FilterBar Best Practices
- Always provide clear filter count feedback
- Use responsive grid layouts for filter dropdowns
- Implement a clear filters button when filters are active
- Show result count to provide immediate feedback
- Group related filters logically (manufacturer, type, status)

#### Pagination Best Practices  
- Include items-per-page control for user preference
- Show current page range ("Showing 1-24 of 55")
- Implement smart page number display with ellipsis
- Disable navigation buttons at boundaries
- Reset to page 1 when filters change

#### Sorting Best Practices
- Provide intuitive sort options (A-Z, newest first, etc.)
- Use clear labels that indicate direction
- Maintain sort state when other filters change
- Consider default sort that makes sense for your data

## Example Component

Here's a complete example following our style guide:

```tsx
export function FlashlightCard({ flashlight }: { flashlight: Flashlight }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-100">
            {flashlight.manufacturer} {flashlight.model}
          </h3>
          <p className="text-sm text-gray-500">{flashlight.emitters.length} emitters</p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          flashlight.status === 'owned' ? 'bg-green-900 text-green-200' :
          flashlight.status === 'wanted' ? 'bg-amber-900 text-amber-200' :
          flashlight.status === 'ordered' ? 'bg-blue-900 text-blue-200' :
          'bg-red-900 text-red-200'
        }`}>
          {flashlight.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <p className="text-gray-400">
          <span className="font-medium text-gray-300">Battery:</span> {flashlight.battery_type}
        </p>
        {flashlight.purchase_price && (
          <p className="text-gray-400">
            <span className="font-medium text-gray-300">Price:</span> ${flashlight.purchase_price}
          </p>
        )}
      </div>
      
      <div className="mt-4 flex gap-2">
        <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors">
          Edit
        </button>
        <button className="hover:bg-gray-800 text-gray-300 hover:text-gray-100 font-medium py-2 px-4 rounded-lg transition-colors">
          Delete
        </button>
      </div>
    </div>
  )
}
```

This style guide is a living document and will evolve as the project grows.