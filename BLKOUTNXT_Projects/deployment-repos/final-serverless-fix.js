#!/usr/bin/env node

/**
 * Final serverless deployment fix - remove runtime specification
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES = ['ivor-core', 'ivor-organizing', 'ivor-community', 'ivor-social'];

function createSimpleVercelConfig(serviceName) {
  const servicePath = path.join(__dirname, serviceName);
  
  // Simple vercel.json without runtime specification
  const vercelConfig = {
    "version": 2,
    "rewrites": [
      {
        "source": "/api/(.*)",
        "destination": "/api/index.js"
      },
      {
        "source": "/(.*)",
        "destination": "/api/index.js"
      }
    ],
    "env": {
      "SUPABASE_URL": "https://demo.supabase.co",
      "SUPABASE_ANON_KEY": "demo_anon_key_for_beta_testing",
      "SUPABASE_SERVICE_ROLE_KEY": "demo_service_role_key_for_beta_testing",
      "GROQ_API_KEY": "demo_groq_key_for_beta_testing",
      "REDIS_URL": "redis://demo-redis:6379",
      "NODE_ENV": "production"
    }
  };

  fs.writeFileSync(path.join(servicePath, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
  console.log(`✅ Simplified vercel.json for ${serviceName}`);
}

console.log('🔧 Creating simplified Vercel configurations...\n');

for (const service of SERVICES) {
  createSimpleVercelConfig(service);
}

console.log('\n✅ All configurations simplified!');