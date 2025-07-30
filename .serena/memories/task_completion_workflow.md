# Task Completion Workflow

## Before Making Changes
1. **Run type checking**: `npm run type-check`
2. **Check current lint status**: `npm run lint`
3. **Understand the codebase**: Use Serena's symbolic tools to explore relevant components

## During Development
1. **Follow TypeScript strictly** - No `any` types without justification
2. **Use path aliases** for imports (e.g., `@/components/...`)
3. **Maintain accessibility** - Include proper ARIA labels and semantic HTML
4. **Test responsive design** - Ensure mobile-first approach works
5. **Follow community values** - Every feature should serve collective liberation

## After Completing a Task

### 1. Code Quality Checks (MANDATORY)
```bash
# Fix any TypeScript errors
npm run type-check

# Auto-fix linting issues  
npm run lint

# Format code consistently
npm run format
```

### 2. Build Verification
```bash
# Ensure production build succeeds
npm run build

# Test the built version
npm run preview
```

### 3. Manual Testing
- **Test in development**: `npm run dev`
- **Verify responsive design** on mobile and desktop
- **Check accessibility** with screen reader testing
- **Test slow connections** and older devices

### 4. Git Workflow
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: descriptive commit message"

# Push to repository
git push origin main
```

## Common Issues & Solutions

### TypeScript Errors
- Check path aliases are correctly configured
- Ensure all imports have proper type definitions
- Use explicit types instead of `any`

### Build Failures
- Clear cache: `rm -rf dist/ && npm run build`
- Check for circular dependencies
- Verify all assets exist in `public/` directory

### Styling Issues
- Use Tailwind utility classes consistently  
- Check mobile-first responsive breakpoints
- Verify custom animations are defined in config

## Quality Standards
- **No console.log** in production code
- **Proper error handling** for async operations  
- **Meaningful component and variable names**
- **Comments for complex logic** only
- **Consistent indentation** (2 spaces)
- **Community values reflected** in UX decisions