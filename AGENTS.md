# Workout Tracker — Agent Guidelines

This document provides guidelines for AI agents working on this codebase. Read before making changes.

---

## Project Overview

| Layer | Technology |
|-------|------------|
| Framework | React 19.x + TypeScript |
| Build tool | Vite 7.x |
| Styling | Tailwind CSS v4 |
| Charts | Recharts 3.x |
| Icons | Lucide React |
| i18n | i18next + react-i18next |

---

## Commands

### Frontend
```bash
cd client && npm run dev      # Start dev server
cd client && npm run build     # Production build
cd client && npm run lint     # Run ESLint
cd client && npm run format   # Format with Prettier
```

### Backend
```bash
cd server && npm run dev      # Start server (nodemon)
cd server && npm run start    # Production server
```

---

## Code Style

### TypeScript
- Use `.ts`/`.tsx` for all new files
- Avoid `any` — use `unknown` or proper generic types
- Use `interface` for object shapes
- Export types in `src/types/index.ts`

### Naming
| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `WorkoutChecklist` |
| Hooks | camelCase + `use` prefix | `useTheme` |
| Utils | camelCase | `formatDate` |
| Constants | UPPER_SNAKE_CASE | `STORAGE_KEYS` |
| Types | PascalCase | `User`, `Exercise` |

### Import Order
1. React/framework (`react`, `react-router-dom`)
2. External libraries (`lucide-react`, `recharts`)
3. Internal absolute (`@/components/ui`)
4. Relative (`./utils`)
5. Type imports

### Formatting (Prettier)
- Single quotes for JS/TS, double quotes for JSX
- Semicolons always
- 2-space indent, 100 char max line width
- Trailing commas in ES5 contexts

### ESLint
- `no-unused-vars`: Error except vars starting with `_` or uppercase
- React Hooks rules enabled
- React Refresh for Vite HMR

### Component Patterns
```tsx
const MyComponent = forwardRef<HTMLDivElement, MyProps>(function MyComponent(
  { className = '', children, ...props },
  ref
) {
  return <div ref={ref} className={className} {...props}>{children}</div>;
});

export default MyComponent;
```

- Use `forwardRef` when refs needed
- Destructure props with defaults in signature
- Use `function ComponentName` (not arrow functions)
- Export default for single-export files

### Error Handling
- API errors: try/catch with user-friendly messages
- Async: always handle errors, show loading states
- Validate inputs before API calls

---

## UI/Design System

### Colors (Tailwind)
Use these token classes: `bg-obsidian`, `bg-graphite`, `bg-steel`, `bg-lime`, `text-white`, `text-lime`, `border-steel`, etc.

| Token | Hex | Usage |
|-------|-----|-------|
| obsidian | `#080808` | Page background |
| carbon | `#111111` | Headers, tooltips |
| graphite | `#1a1a1a` | Cards |
| steel | `#2a2a2a` | Borders |
| lime | `#c6f135` | Primary accent |
| success | `#22c55e` | Completed |
| danger | `#ef4444` | Delete actions |

### Typography
- Display font: Syne (headings)
- Body font: DM Sans (everything else)

### Component Patterns
- Cards: `bg-graphite border border-steel rounded-2xl p-5`
- Primary button: `bg-lime text-obsidian rounded-xl`
- Secondary button: `bg-steel text-chalk rounded-xl`
- Inputs: `bg-muted border border-steel rounded-xl`

### Spacing
- Page padding: `px-5`
- Card gap: `gap-4`
- Border radius: `rounded-2xl` (cards), `rounded-xl` (buttons/inputs)
- Min touch target: `3.5rem` (56px)

### Icons
- Use Lucide React only
- Default size: `22px` (nav), `18px` (buttons)

---

## Architecture

### Project Structure
```
client/src/
├── components/ui/     # Global UI components
├── features/         # Feature modules
├── hooks/            # Global hooks
├── utils/            # Utility functions
├── constants/        # App constants
├── types/            # TypeScript types
├── services/         # API services
└── i18n/            # Translations
```

### Feature Structure
Each feature in `src/features/<name>/`:
- Main component (`<Name>.tsx`)
- `index.ts` barrel export

```tsx
import { Dashboard } from '@/features/dashboard';
import { useTheme } from '@/hooks';
```

### Global Components
```tsx
import { Button, Input, Card, Modal, StatCard, Badge, PageHeader, ExerciseItem } from '@/components/ui';
```

### Global Hooks
- `useDeviceInsets`: Safe area insets for notch/nav
- `useTheme`: Dark/light theme toggle

---

## i18n (Required)

All user-facing text must use `useTranslation`:

```tsx
const { t } = useTranslation();
return <h1>{t('dashboard.title')}</h1>;
```

Add keys to `src/i18n/locales/en.json` and other locale files.

---

## Rules for AI Agents

1. **Read this file first** before any changes
2. **Use Tailwind token classes** — no new hex colors
3. **i18n required** — never hardcode display text
4. **DRY** — reuse global components/hooks/utils
5. **Feature organization** — put feature code in `src/features/<name>/`
6. **Barrel exports** — use `index.ts` in each directory
7. **Maintain dark theme** — dark is primary, light is secondary
8. **Respect touch targets** — minimum 56px for interactive elements
