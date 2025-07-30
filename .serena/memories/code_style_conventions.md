# Code Style & Conventions

## TypeScript Configuration
- **Strict mode enabled** for type safety
- **ES2017 target** for broad compatibility
- **Path aliases configured**:
  - `@/*` → `./src/*`
  - `@/components/*` → `./src/components/*`
  - `@/lib/*` → `./src/lib/*`
  - `@/content/*` → `./src/content/*`
  - `@/app/*` → `./app/*`

## Prettier Configuration
```json
{
  "semi": false,           // No semicolons
  "singleQuote": true,     // Single quotes
  "tabWidth": 2,           // 2-space indentation
  "trailingComma": "es5",  // Trailing commas where valid
  "printWidth": 80,        // 80 character line width
  "plugins": ["prettier-plugin-tailwindcss"]  // Auto-sort Tailwind classes
}
```

## ESLint Configuration
- Uses **Next.js core web vitals** config
- **TypeScript integration** enabled
- **Flat config format** (modern ESLint)

## Component Conventions
- **PascalCase** for component names
- **camelCase** for props and variables
- **SCREAMING_SNAKE_CASE** for constants
- **TypeScript interfaces** for prop types
- **Default exports** for components

## File Naming
- **PascalCase** for component files (e.g., `CommunityGateway.tsx`)
- **camelCase** for utility files (e.g., `mediaAssets.ts`)
- **kebab-case** for configuration files (e.g., `tailwind.config.js`)

## CSS/Styling Conventions
- **Tailwind utility classes** preferred over custom CSS
- **Mobile-first** responsive design approach
- **Semantic color names** using brand palette
- **Custom animations** defined in Tailwind config
- **Accessibility-first** approach (WCAG 2.1 AA)

## Component Structure
```tsx
interface ComponentProps {
  // Props definition
}

export default function Component({ prop }: ComponentProps) {
  // Component logic
  
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  )
}
```

## Import Order
1. React and external libraries
2. Internal components (using path aliases)
3. Types and interfaces
4. Constants and utilities