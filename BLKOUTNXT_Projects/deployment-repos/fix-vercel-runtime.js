#!/usr/bin/env node

/**
 * Fix Vercel runtime configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES = ['ivor-core', 'ivor-organizing', 'ivor-community', 'ivor-social'];

function fixVercelConfig(serviceName) {
  const servicePath = path.join(__dirname, serviceName);
  
  // Create proper serverless vercel.json
  const vercelConfig = {
    "version": 2,
    "functions": {
      "api/*.js": {
        "runtime": "nodejs18.x"
      }
    },
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
  console.log(`✅ Fixed vercel.json runtime for ${serviceName}`);
}

console.log('🔧 Fixing Vercel runtime configurations...\n');

for (const service of SERVICES) {
  fixVercelConfig(service);
}

console.log('\n✅ All runtime configurations fixed!');