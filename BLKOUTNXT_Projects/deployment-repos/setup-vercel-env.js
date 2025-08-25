#!/usr/bin/env node

/**
 * Setup Vercel Environment Variables for IVOR Platform Beta
 * Creates development/demo environment variables for testing
 */

import { execSync } from 'child_process';
import path from 'path';

// Demo environment variables for beta testing
const ENV_VARS = {
  // Supabase (using demo/development values)
  SUPABASE_URL: 'https://demo.supabase.co',
  SUPABASE_ANON_KEY: 'demo_anon_key_for_beta_testing',
  SUPABASE_SERVICE_ROLE_KEY: 'demo_service_role_key_for_beta_testing',
  
  // GROQ API (demo key)
  GROQ_API_KEY: 'demo_groq_key_for_beta_testing',
  
  // Redis (using a demo Redis URL)
  REDIS_URL: 'redis://demo-redis:6379'
};

// Production URLs for cross-domain coordination
const PRODUCTION_URLS = {
  IVOR_CORE_URL: 'https://ivor-core.vercel.app',
  IVOR_ORGANIZING_URL: 'https://ivor-organizing.vercel.app',
  IVOR_COMMUNITY_URL: 'https://ivor-community.vercel.app',
  IVOR_SOCIAL_URL: 'https://ivor-social.vercel.app',
  VITE_API_BASE_URL: 'https://ivor-api-gateway.vercel.app'
};

function execCommand(command, description) {
  try {
    console.log(`⏳ ${description}...`);
    const result = execSync(command, { encoding: 'utf8' });
    console.log(`✅ ${description} complete`);
    return result;
  } catch (error) {
    console.log(`⚠️ ${description} (may already exist): ${error.message.split('\n')[0]}`);
    return null;
  }
}

function setupEnvForProject(projectName, additionalVars = {}) {
  console.log(`\n🔧 Setting up environment for ${projectName}...`);
  
  const allVars = { ...ENV_VARS, ...PRODUCTION_URLS, ...additionalVars };
  
  for (const [key, value] of Object.entries(allVars)) {
    const command = `vercel env add ${key} production --value="${value}" --yes`;
    execCommand(command, `Adding ${key} to ${projectName}`);
  }
}

function deployWithRetry(projectPath, projectName) {
  console.log(`\n🚀 Deploying ${projectName}...`);
  
  try {
    const result = execSync(`vercel --prod --yes --cwd="${projectPath}"`, { encoding: 'utf8' });
    console.log(`✅ ${projectName} deployed successfully!`);
    return result;
  } catch (error) {
    console.log(`❌ ${projectName} deployment failed: ${error.message}`);
    throw error;
  }
}

async function deployAllServices() {
  console.log('🚀 Setting up IVOR Platform Beta on Vercel...\n');
  
  const services = [
    { name: 'ivor-api-gateway', path: '/home/robbe/BLKOUTNXT_Projects/deployment-repos/ivor-api-gateway' },
    { name: 'ivor-core', path: '/home/robbe/BLKOUTNXT_Projects/deployment-repos/ivor-core' },
    { name: 'ivor-organizing', path: '/home/robbe/BLKOUTNXT_Projects/deployment-repos/ivor-organizing' },
    { name: 'ivor-community', path: '/home/robbe/BLKOUTNXT_Projects/deployment-repos/ivor-community' },
    { name: 'ivor-social', path: '/home/robbe/BLKOUTNXT_Projects/deployment-repos/ivor-social' },
    { 
      name: 'ivor-frontend', 
      path: '/home/robbe/BLKOUTNXT_Projects/deployment-repos/ivor-frontend',
      additionalVars: {
        VITE_SUPABASE_URL: ENV_VARS.SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: ENV_VARS.SUPABASE_ANON_KEY
      }
    }
  ];
  
  // Deploy each service
  for (const service of services) {
    try {
      // Change to service directory
      process.chdir(service.path);
      
      // Setup environment variables
      setupEnvForProject(service.name, service.additionalVars || {});
      
      // Deploy to Vercel
      deployWithRetry(service.path, service.name);
      
      console.log(`🔗 ${service.name}: https://${service.name}.vercel.app`);
      
    } catch (error) {
      console.error(`💥 Failed to deploy ${service.name}:`, error.message);
      // Continue with next service
    }
  }
  
  // Setup frontend alias
  try {
    console.log('\n🎯 Setting up ivor-beta.vercel.app alias...');
    process.chdir('/home/robbe/BLKOUTNXT_Projects/deployment-repos/ivor-frontend');
    execCommand('vercel alias set https://ivor-frontend.vercel.app ivor-beta.vercel.app', 'Setting up beta alias');
  } catch (error) {
    console.log(`⚠️ Alias setup failed: ${error.message}`);
  }
  
  console.log('\n🎉 IVOR Platform Beta Deployment Complete!');
  console.log('\n🔗 Production URLs:');
  console.log('   • Frontend: https://ivor-beta.vercel.app');
  console.log('   • API Gateway: https://ivor-api-gateway.vercel.app');
  console.log('   • Core Services: https://ivor-core.vercel.app');
  console.log('   • Organizing: https://ivor-organizing.vercel.app');
  console.log('   • Community: https://ivor-community.vercel.app');
  console.log('   • Social: https://ivor-social.vercel.app');
  console.log('\n📋 Next Steps:');
  console.log('   1. Update environment variables with real API keys');
  console.log('   2. Test cross-domain coordination');
  console.log('   3. Verify end-to-end functionality');
}

deployAllServices().catch(console.error);