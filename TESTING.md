# BLKOUTNXT Testing Strategy & Documentation

## Overview

This document outlines the comprehensive testing strategy for the BLKOUTNXT Supabase integration, ensuring robust, secure, and performant database operations while maintaining data integrity throughout development and production deployments.

## Testing Philosophy

Our testing approach is built on **values-first development** principles:

- **Community Safety**: Rigorous security testing protects user data
- **Reliability**: Comprehensive test coverage ensures platform stability  
- **Accessibility**: Tests verify inclusive design and functionality
- **Transparency**: Clear documentation enables community participation
- **Liberation-Focused**: Testing supports our mission of collective empowerment

## Test Architecture

### Test Pyramid Structure

```
         /\
        /E2E\      ← Few, high-value user journey tests
       /------\
      /Integr.\   ← Database operations & API integration
     /----------\
    /   Unit     \ ← Component logic & utility functions  
   /--------------\
  /   Security    \ ← RLS policies, data validation, auth
 /------------------\
```

### Testing Environments

1. **Development**: Local Supabase instance (`localhost:54321`)
2. **CI/CD**: GitHub Actions with containerized services
3. **Staging**: Production-like environment for final validation
4. **Production**: Monitoring and synthetic tests

## Test Categories

### 1. Unit Tests (`tests/unit/`)

**Purpose**: Test individual components and functions in isolation

**Tools**: Vitest, React Testing Library, MSW

**Coverage**: 
- Supabase client configuration
- Utility functions
- React components
- Service layer logic

**Example**:
```typescript
// tests/unit/lib/supabase.test.ts
describe('Supabase Client', () => {
  it('should handle authentication correctly', async () => {
    const result = await supabaseHelpers.signIn('test@example.com', 'password')
    expect(result.error).toBeNull()
  })
})
```

**Run Commands**:
```bash
npm run test                    # Run all unit tests
npm run test:coverage          # With coverage report
npm run test:watch             # Watch mode for development
npm run test:ui                # Visual test interface
```

### 2. Integration Tests (`tests/integration/`)

**Purpose**: Test database operations and API interactions

**Tools**: Vitest, Local Supabase instance

**Coverage**:
- CRUD operations for all tables
- Complex queries and joins
- JSON field handling
- Array field operations
- Data validation constraints

**Example**:
```typescript
// tests/integration/database/events.test.ts
describe('Events Database Integration', () => {
  it('should create and retrieve events correctly', async () => {
    const event = await testSupabase.from('events').insert(eventData)
    expect(event.data).toBeDefined()
  })
})
```

**Run Commands**:
```bash
npm run test:integration       # Run integration tests
supabase start                 # Start local instance first
```

### 3. Security Tests (`tests/security/`)

**Purpose**: Validate Row Level Security policies and data protection

**Tools**: Vitest, Custom security utilities

**Coverage**:
- RLS policy enforcement
- SQL injection prevention
- XSS protection
- Data validation
- Authentication flows
- Authorization levels

**Example**:
```typescript
// tests/security/rls-policies.test.ts
describe('RLS Policies', () => {
  it('should deny anonymous users from creating events', async () => {
    const result = await anonClient.from('events').insert(eventData)
    expect(result.error).toBeDefined()
  })
})
```

**Run Commands**:
```bash
npm run test:security          # Run security tests
```

### 4. End-to-End Tests (`tests/e2e/`)

**Purpose**: Test complete user journeys and workflows

**Tools**: Playwright

**Coverage**:
- User authentication flows
- Event browsing and interaction
- Community gateway integration
- Responsive design validation
- Offline functionality
- Performance metrics

**Example**:
```typescript
// tests/e2e/events-flow.test.ts
test('should display events list', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="events-section"]')).toBeVisible()
})
```

**Run Commands**:
```bash
npm run test:e2e               # Run E2E tests
npm run test:e2e:ui            # Interactive mode
```

### 5. Performance & Load Tests (`tests/load/`)

**Purpose**: Validate system performance under various loads

**Tools**: k6

**Coverage**:
- Database query performance
- API response times
- Concurrent user simulation
- Memory usage patterns
- Resource consumption

**Example**:
```javascript
// tests/load/events-load.js
export default function () {
  const response = http.get(`${API_BASE_URL}/events`)
  check(response, {
    'events API responds quickly': (r) => r.timings.duration < 500
  })
}
```

**Run Commands**:
```bash
npm run test:load              # Run load tests
```

### 6. Migration Tests (`tests/migration/`)

**Purpose**: Ensure safe data migrations and rollback capabilities

**Tools**: Vitest, Custom migration utilities

**Coverage**:
- Data backup and restore
- Schema migration simulation
- Foreign key constraint validation
- Data integrity verification
- Rollback procedures

**Example**:
```typescript
// tests/migration/data-migration.test.ts
describe('Data Migration', () => {
  it('should backup and restore data correctly', async () => {
    const backup = await migrationUtils.createBackup('events')
    await migrationUtils.restoreFromBackup(backup)
    expect(backup.count).toBeGreaterThan(0)
  })
})
```

**Run Commands**:
```bash
npm run test:migration         # Run migration tests
```

## Database Setup for Testing

### Local Development

1. **Start Supabase**:
   ```bash
   npm run supabase:start
   ```

2. **Apply Migrations**:
   ```bash
   npm run db:migrate
   ```

3. **Seed Test Data**:
   ```bash
   npm run db:seed
   ```

### CI/CD Environment

The GitHub Actions workflow automatically:
- Starts Supabase containers
- Applies database schema
- Seeds test data
- Runs all test suites
- Generates coverage reports

## Test Data Management

### Test Data Factories

Located in `tests/utils/test-utils.tsx`:

```typescript
export const createMockEvent = (overrides = {}) => ({
  id: 'test-event-1',
  name: 'Test Event',
  description: 'Test event description',
  // ... other fields
  ...overrides
})
```

### Data Cleanup

Tests automatically clean up data using:
- `beforeEach` hooks for isolation
- Test-specific prefixes (e.g., "Test%", "Migration Test%")
- Automated cleanup in CI/CD teardown

## Security Testing Details

### Row Level Security (RLS) Validation

Tests verify that:
- Anonymous users can only read published content
- Authenticated users can create draft content
- Moderators can update content status
- Admins have full access
- Cross-user data access is prevented

### SQL Injection Protection

Tests include payloads like:
- `'; DROP TABLE events; --`
- `1' OR '1'='1`
- `admin'--`

### XSS Prevention

Tests validate sanitization of:
- `<script>alert("XSS")</script>`
- `<img src="x" onerror="alert(1)">`
- `javascript:alert("XSS")`

## Performance Standards

### Response Time Targets

- **Database Queries**: < 200ms (95th percentile)
- **API Endpoints**: < 500ms (95th percentile)  
- **Page Load**: < 2s (initial load)
- **Interactive Elements**: < 100ms (user feedback)

### Load Testing Scenarios

- **Normal Load**: 10-25 concurrent users
- **Peak Load**: 50-100 concurrent users
- **Stress Test**: 200+ concurrent users
- **Endurance**: 30+ minutes sustained load

## CI/CD Integration

### GitHub Actions Workflow

The `.github/workflows/test.yml` defines:

1. **Parallel Test Execution**: Unit, integration, security, and E2E tests run in parallel
2. **Environment Setup**: Automated Supabase container and database seeding
3. **Artifact Collection**: Test results, coverage reports, and screenshots
4. **Status Reporting**: Comprehensive test summary with pass/fail status

### Quality Gates

Tests must pass these criteria for deployment:

- ✅ Unit test coverage > 80%
- ✅ Integration tests pass 100%
- ✅ Security tests detect no vulnerabilities
- ✅ E2E tests complete user journeys
- ✅ Performance tests meet response time targets
- ✅ Migration tests validate data integrity

## Running Tests Locally

### Prerequisites

```bash
# Install dependencies
npm install

# Install Supabase CLI
npm install -g @supabase/cli

# Install Playwright browsers
npx playwright install
```

### Full Test Suite

```bash
# Run all tests (recommended before commits)
npm run test:all

# Run specific test categories
npm run test                    # Unit tests only
npm run test:integration        # Integration tests
npm run test:security          # Security tests  
npm run test:e2e               # End-to-end tests
npm run test:load              # Performance tests
npm run test:migration         # Migration tests
```

### Development Workflow

```bash
# Start development environment
npm run supabase:start
npm run dev

# Run tests in watch mode (separate terminal)
npm run test:watch

# Run specific test file
npm run test -- events.test.ts

# Run tests with coverage
npm run test:coverage
```

## Debugging Tests

### Unit/Integration Tests

```bash
# Run with verbose output
npm run test -- --reporter=verbose

# Run specific test pattern
npm run test -- --grep "should create event"

# Debug with Node inspector
npm run test -- --inspect-brk
```

### E2E Tests

```bash
# Run with UI mode for debugging
npm run test:e2e:ui

# Run in headed mode
npx playwright test --headed

# Debug specific test
npx playwright test --debug events-flow.test.ts
```

### Database Issues

```bash
# Check Supabase status
supabase status

# View logs
supabase logs

# Reset database
npm run supabase:reset
npm run db:seed
```

## Test Maintenance

### Regular Updates

- **Weekly**: Review test coverage and add tests for new features
- **Monthly**: Update test data and validate performance benchmarks  
- **Quarterly**: Review and update security test scenarios
- **Before Major Releases**: Full test suite validation and performance analysis

### Adding New Tests

1. **Identify Test Category**: Determine which test suite is appropriate
2. **Create Test Data**: Use existing factories or create new ones
3. **Write Tests**: Follow existing patterns and naming conventions
4. **Update Documentation**: Add test descriptions and run commands
5. **Verify CI/CD**: Ensure tests run correctly in automated pipeline

## Community Contribution Guidelines

### Writing Tests for Community Features

When contributing features that serve the community:

1. **Accessibility Tests**: Ensure screen reader compatibility and keyboard navigation
2. **Multi-language Support**: Test internationalization features  
3. **Low-bandwidth Scenarios**: Validate functionality on slower connections
4. **Mobile-first Design**: Test responsive behavior across devices

### Security Considerations

Community contributions must include:

- Tests for any new database schema changes
- RLS policy validation for new tables/columns
- Input validation tests for user-generated content
- XSS and injection protection verification

## Troubleshooting Common Issues

### Database Connection Issues

```bash
# Check if Supabase is running
curl http://localhost:54321/rest/v1/

# Restart Supabase
supabase stop
supabase start
```

### Test Failures

1. **Flaky Tests**: Check for timing issues and add appropriate waits
2. **Data Conflicts**: Ensure proper cleanup between tests
3. **Environment Variables**: Verify all required env vars are set
4. **Port Conflicts**: Check that test ports (54321, 5173) are available

### CI/CD Issues

1. **Timeout Errors**: Increase timeout values for slower operations
2. **Resource Limits**: Check GitHub Actions runner capacity
3. **Secret Configuration**: Verify all required secrets are configured
4. **Dependency Conflicts**: Update package versions and clear caches

## Resources

### Documentation
- [Supabase Testing Guide](https://supabase.com/docs/guides/testing)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [k6 Documentation](https://k6.io/docs/)

### Community Support
- **GitHub Discussions**: Technical questions and feature requests
- **Discord**: Real-time community support
- **Documentation Issues**: Improvements to testing guides

---

## Values-First Testing Commitment

This testing strategy reflects our commitment to **Black queer liberation through technology**. Every test serves our community's safety, empowerment, and collective ownership of the platforms we build together.

**Quality is Community Care** - Rigorous testing protects our community's data, ensures reliable access to resources, and maintains the integrity of our shared digital spaces.

---

*For questions about testing procedures or to contribute improvements to this documentation, please open an issue or join our community discussions.*