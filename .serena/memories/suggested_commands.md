# Essential Commands for BLKOUT Website Development

## Development Commands
```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview
```

## Code Quality Commands
```bash
# Type checking
npm run type-check

# Linting (with auto-fix)
npm run lint

# Code formatting
npm run format

# Check formatting only
npm run format:check
```

## System Commands (Linux)
```bash
# File operations
ls -la                    # List files with details
find . -name "*.tsx"      # Find TypeScript React files
grep -r "searchterm" src/ # Search in source code

# Git operations
git status               # Check repository status
git add .               # Stage changes
git commit -m "message" # Commit changes
git push origin main    # Push to main branch

# Process management
ps aux | grep node      # Find Node.js processes
kill -9 <PID>          # Kill specific process
```

## Package Management
```bash
# Install dependencies
npm install

# Add new dependency
npm install <package-name>

# Add dev dependency  
npm install -D <package-name>

# Update packages
npm update

# Check for outdated packages
npm outdated
```

## Debugging & Maintenance
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist/
npm run build

# Check bundle size
npm run build && ls -lh dist/

# View running processes on ports
lsof -i :3000           # Development server
lsof -i :3001           # Newsroom backend  
lsof -i :8000           # IVOR backend
```

## Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env               # or vim .env
```