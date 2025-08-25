# IVOR Knowledge Base Environment Setup

## Required Environment Variables

Create a `.env` file in your deployment directory with:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# PostgreSQL Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database_name

# Alternative database connection parameters (if not using DATABASE_URL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ivor_health
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Content Ingestion Configuration
MENRUS_BASE_URL=https://menrus.co.uk
SCRAPE_DELAY_MS=1000
MAX_CONCURRENT_REQUESTS=5

# Vector Search Configuration
EMBEDDING_MODEL=text-embedding-ada-002
SIMILARITY_THRESHOLD=0.75
MAX_SEARCH_RESULTS=5

# Production Configuration
NODE_ENV=production
PORT=3000
```

## Database Setup Steps

1. **Install PostgreSQL with pgvector extension:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. **Create database:**
   ```sql
   CREATE DATABASE ivor_health;
   ```

3. **Run schema setup:**
   ```bash
   psql -d ivor_health -f health-knowledge-system.sql
   ```

## Content Ingestion Process

1. **Install dependencies:**
   ```bash
   npm install puppeteer pg openai crypto cheerio
   ```

2. **Run content ingestion pipeline:**
   ```bash
   node content-ingestion-pipeline.js
   ```

3. **Monitor ingestion progress:**
   The pipeline will output progress logs showing:
   - Pages discovered and processed
   - Content categorization and tagging
   - Embedding generation status
   - Health services extraction

## Integration with IVOR Core

Replace the existing health response logic in `ivor-core/api/index.js` with:

```javascript
import { getIntelligentHealthResponse } from '../../../intelligent-health-responses.js';

// In your message processing logic:
if (messageLower.includes('hiv') || messageLower.includes('sexual health')) {
  try {
    const healthResponse = await getIntelligentHealthResponse(message, userLocation);
    return res.status(200).json({
      response: healthResponse.response,
      sources: healthResponse.sources,
      confidence: healthResponse.confidence,
      service: 'ivor-core',
      knowledgeBase: 'menrus.co.uk'
    });
  } catch (error) {
    // Fallback to existing response pattern
    return res.status(200).json({
      response: "For comprehensive HIV and sexual health support, please visit menrus.co.uk...",
      service: 'ivor-core'
    });
  }
}
```

## Knowledge Base Coverage

The system now recognizes and categorizes the full spectrum of HIV support:

- **Testing**: Where to get tested, window periods, types of tests
- **Prevention**: PrEP access, safer sex practices, risk reduction  
- **New Diagnosis**: Immediate support, starting treatment, emotional support
- **Long-term Care**: Treatment adherence, viral load monitoring, CD4 management
- **Support Groups**: Peer support, community groups, counselling
- **Mental Health**: Stigma support, disclosure guidance, therapy resources
- **Advocacy**: Rights protection, discrimination support, legal resources

## Query Examples

The enhanced system can now handle queries like:

- "I just tested positive for HIV, what do I do next?"
- "Support groups for Black gay men living with HIV in London"  
- "Help with HIV medication adherence"
- "Where can I get undetectable viral load monitoring?"
- "Counselling for HIV-related stigma"
- "PrEP access for prevention"
- "HIV testing locations in South London"

Each will receive specific, actionable information from menrus.co.uk content rather than generic referrals.