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
```tsx
<input
  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter value..."
/>
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

## Component States

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

## Accessibility Guidelines

1. **Color Contrast**: Maintain WCAG AA standards (4.5:1 for normal text)
2. **Focus States**: Always visible, use `focus:ring-2 focus:ring-blue-500`
3. **Alt Text**: Provide for all images
4. **ARIA Labels**: Use for icon-only buttons
5. **Keyboard Navigation**: Ensure all interactive elements are reachable

## Do's and Don'ts

### Do's ✅
- Use consistent spacing
- Maintain visual hierarchy
- Keep interactions predictable
- Test on multiple screen sizes
- Use semantic HTML

### Don'ts ❌
- Mix different button styles in the same context
- Use pure black (#000000) backgrounds
- Rely on color alone to convey information
- Create custom breakpoints
- Override Tailwind's default scale

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