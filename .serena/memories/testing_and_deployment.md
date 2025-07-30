# Testing & Deployment Information

## Testing Status
**Currently NO formal testing framework configured**
- No Jest, Vitest, or Cypress found in dependencies
- No test files (*.test.*, *.spec.*) in codebase
- Testing is currently manual through development server

## Manual Testing Approach
1. **Development testing**: `npm run dev` on localhost:3000
2. **Production testing**: `npm run build && npm run preview`
3. **Cross-browser testing**: Manual verification across browsers
4. **Mobile testing**: Manual responsive design testing
5. **Accessibility testing**: Manual screen reader testing

## Build Process
- **Build command**: `npm run build`
- **Output directory**: `dist/`
- **Build time**: ~6.7 seconds
- **Bundle size**: 551.93 kB (compressed: 173.30 kB)
- **Vite handles**: Code splitting, asset optimization, TypeScript compilation

## Deployment Setup
- **Platform**: Vercel (auto-deployment configured)
- **Repository**: Connected to GitHub main branch
- **Branch**: `main` 
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Node version**: 18+

## Environment Variables
- **Template**: `.env.example` provided
- **Local**: `.env` (not committed)
- **Production**: Configured in Vercel dashboard

## Performance Considerations
- **Mobile-first**: Optimized for 3G connections
- **Older devices**: Works on lower-spec hardware
- **Bundle optimization**: Consider code splitting for large components
- **Asset optimization**: Images use appropriate formats and sizes

## Backend Integrations
- **Newsroom Backend**: Port 3001 (external service)
- **IVOR AI Backend**: Port 8000 (external service) 
- **Events Calendar**: External integration ready
- **BLKOUTHUB**: Community gateway integration

## Monitoring & Analytics
- **Current**: No analytics configured
- **Planned**: Liberation-focused metrics (not surveillance-based)
- **Performance**: Built-in Vite bundler analytics
- **Errors**: Browser console monitoring

## Recommended Testing Setup (Future)
```bash
# Suggested additions for comprehensive testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D playwright  # for e2e testing
```