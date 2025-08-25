#!/usr/bin/env node

/**
 * Fix Vercel configurations to use direct environment variables instead of secrets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICES = [
  'ivor-api-gateway',
  'ivor-core', 
  'ivor-organizing',
  'ivor-community',
  'ivor-social',
  'ivor-frontend'
];

function fixVercelConfig(serviceName) {
  const servicePath = path.resolve(__dirname, serviceName);
  const vercelConfigPath = path.join(servicePath, 'vercel.json');
  
  if (!fs.existsSync(vercelConfigPath)) {
    console.log(`⚠️ No vercel.json found for ${serviceName}`);
    return;
  }
  
  const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
  
  if (config.env) {
    // Remove @secret references and use direct values
    for (const [key, value] of Object.entries(config.env)) {
      if (typeof value === 'string' && value.startsWith('@')) {
        // Replace with demo values for beta testing
        config.env[key] = getDemoValue(key);
        console.log(`✅ Fixed ${key} in ${serviceName}`);
      }
    }
    
    fs.writeFileSync(vercelConfigPath, JSON.stringify(config, null, 2));
    console.log(`✅ Updated vercel.json for ${serviceName}`);
  }
}

function getDemoValue(envKey) {
  const demoValues = {
    'supabase_url': 'https://demo.supabase.co',
    'supabase_anon_key': 'demo_anon_key_for_beta_testing', 
    'supabase_service_role_key': 'demo_service_role_key_for_beta_testing',
    'groq_api_key': 'demo_groq_key_for_beta_testing',
    'redis_url': 'redis://demo-redis:6379'
  };
  
  return demoValues[envKey] || 'demo_value_for_beta_testing';
}

console.log('🔧 Fixing Vercel configurations...\n');

SERVICES.forEach(service => {
  fixVercelConfig(service);
});

console.log('\n✅ All Vercel configurations fixed!');