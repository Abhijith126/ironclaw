# Design System

## Theme

Dark theme is primary. Light theme is secondary, activated by adding `light` class to `<html>`.
All colors are defined as CSS custom properties in `client/src/index.css` and registered as Tailwind tokens via `@theme`.

## Color Palette

### Dark Theme (default)

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| obsidian | `#080808` | `bg-obsidian` | Page background |
| carbon | `#111111` | `bg-carbon` | Header, bottom nav, tooltips |
| graphite | `#1a1a1a` | `bg-graphite` | Cards |
| steel | `#2a2a2a` | `bg-steel`, `border-steel` | Borders, secondary buttons |
| iron | `#404040` | `bg-iron` | Subtle dividers |
| silver | `#888888` | `text-silver` | Secondary text |
| chalk | `#d4d4d4` | `text-chalk` | Body text |
| white | `#fafafa` | `text-white` | Headings, emphasis |
| muted | `#1f1f1f` | `bg-muted` | Input backgrounds |

### Accent

| Token | Hex | Usage |
|-------|-----|-------|
| lime | `#c6f135` | Primary accent, active states, CTA buttons |
| lime-dim | `#a3cc29` | Hover states |
| lime-glow | `rgba(198,241,53,0.15)` | Glow/shadow effects |

### Semantic

| Token | Hex | Usage |
|-------|-----|-------|
| success | `#22c55e` | Completed states |
| warning | `#f59e0b` | Warnings |
| danger | `#ef4444` | Delete actions, errors |

### Light Theme Overrides

Applied via `html.light` in CSS. Key changes:
- obsidian → `#faf9f7` (warm white)
- carbon → `#ffffff`
- graphite → `#f5f4f1`
- steel → `#e8e6e1`
- chalk → `#2d2c2a` (dark text)
- lime → `#7abf1a` (darker green for contrast)

## Typography

| Role | Font | CSS Variable | Usage |
|------|------|-------------|-------|
| Display | Syne | `font-display` | Headings, app name, hero text |
| Body | DM Sans | `font-body` | Everything else |

Both loaded from Google Fonts in `index.css`.

## Component Patterns

### Cards
```html
<div class="bg-graphite border border-steel rounded-2xl p-5">
```

### Primary Button
```html
<button class="bg-lime text-obsidian rounded-xl font-semibold">
```

### Secondary Button
```html
<button class="bg-steel text-chalk rounded-xl">
```

### Danger Button
```html
<button class="bg-danger text-white rounded-xl">
```

### Text Input
```html
<input class="bg-muted border border-steel rounded-xl px-4 py-3 text-chalk">
```

### Header Bar
```html
<header class="sticky top-0 z-40 bg-carbon/95 backdrop-blur-xl border-b border-steel/50">
```

### Bottom Navigation
```html
<nav class="fixed bottom-0 z-50 bg-carbon/95 backdrop-blur-xl border-t border-steel/50">
```

## Spacing Rules

| Element | Value |
|---------|-------|
| Page horizontal padding | `px-5` |
| Card internal padding | `p-5` |
| Card gap (between cards) | `gap-4` |
| Section spacing | `space-y-6` |
| Max content width | `max-w-150` (600px) |

## Border Radius

| Element | Class |
|---------|-------|
| Cards | `rounded-2xl` |
| Buttons | `rounded-xl` |
| Inputs | `rounded-xl` |
| Badges | `rounded-full` |

## Touch Targets

Minimum interactive element size: `3.5rem` (56px) for mobile-first accessibility.

## Icons

- Library: Lucide React (no other icon libraries)
- Navigation icons: `size={22}`
- Button icons: `size={18}`
- Active nav: `strokeWidth={2.5}`
- Inactive nav: `strokeWidth={1.8}`

## Animations

Defined in `index.css`:

| Class | Effect |
|-------|--------|
| `animate-fade-up` | Fade in + slide up (0.4s) |
| `animate-scale-in` | Fade in + scale from 95% (0.3s) |

Both use `cubic-bezier(0.16, 1, 0.3, 1)` easing.

## Chart Theming

Chart colors defined in `client/src/constants/index.ts`:

```typescript
CHART_CONFIG = {
  COLORS: {
    primary: '#c6f135',     // Line/area color (lime)
    grid: '#2a2a2a',        // Grid lines (steel)
    axis: '#404040',        // Axis lines (iron)
    tick: '#888888',        // Tick labels (silver)
    tooltip: '#111111',     // Tooltip background (carbon)
    background: '#1a1a1a',  // Chart background (graphite)
  }
}
```

## Safe Area Handling

The app uses `env(safe-area-inset-*)` CSS variables for notch/home indicator spacing.
The `useDeviceInsets` hook provides `top` and `bottom` values, applied as inline styles on header and nav.
