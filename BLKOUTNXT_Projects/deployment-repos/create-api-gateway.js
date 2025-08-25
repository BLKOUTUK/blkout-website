#!/usr/bin/env node

/**
 * Create proper API Gateway with cross-domain coordination
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const gatewayPath = '/home/robbe/BLKOUTNXT_Projects/deployment-repos/ivor-api-gateway';

// Service URLs (latest deployments)
const SERVICE_URLS = {
  'ivor-core': 'https://ivor-core-kjyavxu7a-robs-projects-54d653d3.vercel.app',
  'ivor-organizing': 'https://ivor-organizing-9t33lgm08-robs-projects-54d653d3.vercel.app',
  'ivor-community': 'https://ivor-community-2on12k82l-robs-projects-54d653d3.vercel.app',
  'ivor-social': 'https://ivor-social-2yysm13l8-robs-projects-54d653d3.vercel.app'
};

function createAPIGateway() {
  // Create api directory
  const apiDir = path.join(gatewayPath, 'api');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }

  // Enhanced API Gateway with orchestration
  const gatewayFunction = `// IVOR API Gateway - Cross-Domain Orchestration
export default async function handler(req, res) {
  const { method, url } = req;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  const serviceUrls = ${JSON.stringify(SERVICE_URLS, null, 4)};

  try {
    // Health check endpoint
    if (url.includes('/health')) {
      return res.status(200).json({
        status: 'healthy',
        service: 'ivor-api-gateway',
        timestamp: new Date().toISOString(),
        environment: 'production',
        services: Object.keys(serviceUrls),
        capabilities: ['orchestration', 'routing', 'coordination']
      });
    }

    // Status endpoint - check all services
    if (url.includes('/status')) {
      const serviceStatuses = {};
      
      for (const [service, serviceUrl] of Object.entries(serviceUrls)) {
        try {
          const response = await fetch(\`\${serviceUrl}/api/health\`);
          serviceStatuses[service] = {
            status: response.ok ? 'healthy' : 'unhealthy',
            url: serviceUrl
          };
        } catch (error) {
          serviceStatuses[service] = {
            status: 'error',
            error: error.message,
            url: serviceUrl
          };
        }
      }

      return res.status(200).json({
        service: 'ivor-api-gateway',
        name: 'IVOR API Gateway',
        description: 'Cross-domain coordination and routing',
        status: 'operational',
        version: '1.0.0',
        services: serviceStatuses,
        endpoints: ['/api/health', '/api/status', '/api/chat', '/api/chat/orchestrated']
      });
    }

    // Orchestrated chat endpoint - coordinates responses from multiple services
    if (url.includes('/chat/orchestrated') && method === 'POST') {
      const { message, services, userId, sessionId } = req.body || {};
      
      if (!message) {
        return res.status(400).json({
          error: 'Message is required',
          service: 'ivor-api-gateway'
        });
      }

      // Determine which services to query based on message content
      const messageLower = message.toLowerCase();
      let targetServices = services || [];
      
      if (targetServices.length === 0) {
        // Auto-determine services based on message content
        if (messageLower.includes('wellness') || messageLower.includes('health') || messageLower.includes('personal')) {
          targetServices.push('ivor-core');
        }
        if (messageLower.includes('organize') || messageLower.includes('campaign') || messageLower.includes('mutual aid')) {
          targetServices.push('ivor-organizing');
        }
        if (messageLower.includes('trend') || messageLower.includes('community') || messageLower.includes('data')) {
          targetServices.push('ivor-community');
        }
        if (messageLower.includes('social') || messageLower.includes('viral') || messageLower.includes('amplify')) {
          targetServices.push('ivor-social');
        }
        
        // Default: query core service
        if (targetServices.length === 0) {
          targetServices = ['ivor-core'];
        }
      }

      // Query selected services
      const responses = [];
      
      for (const service of targetServices) {
        if (serviceUrls[service]) {
          try {
            const response = await fetch(\`\${serviceUrls[service]}/api/chat\`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ message, userId, sessionId })
            });
            
            if (response.ok) {
              const data = await response.json();
              responses.push(data);
            }
          } catch (error) {
            console.error(\`Error querying \${service}:\`, error);
          }
        }
      }

      return res.status(200).json({
        orchestratedResponse: responses,
        message: 'Orchestrated response from multiple IVOR services',
        queriedServices: targetServices,
        totalResponses: responses.length,
        timestamp: new Date().toISOString(),
        sessionId: sessionId || 'default',
        userId: userId || 'anonymous'
      });
    }

    // Single service chat endpoint - routes to primary service
    if (url.includes('/chat') && method === 'POST') {
      const { message, service, userId, sessionId } = req.body || {};
      
      if (!message) {
        return res.status(400).json({
          error: 'Message is required',
          service: 'ivor-api-gateway'
        });
      }

      // Route to specified service or default to ivor-core
      const targetService = service || 'ivor-core';
      const serviceUrl = serviceUrls[targetService];
      
      if (!serviceUrl) {
        return res.status(400).json({
          error: \`Service '\${targetService}' not found\`,
          availableServices: Object.keys(serviceUrls)
        });
      }

      try {
        const response = await fetch(\`\${serviceUrl}/api/chat\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, userId, sessionId })
        });
        
        if (response.ok) {
          const data = await response.json();
          return res.status(200).json({
            ...data,
            routedVia: 'ivor-api-gateway',
            targetService
          });
        } else {
          return res.status(response.status).json({
            error: 'Service responded with error',
            status: response.status,
            targetService
          });
        }
      } catch (error) {
        return res.status(500).json({
          error: 'Failed to reach target service',
          message: error.message,
          targetService
        });
      }
    }

    // Default response
    return res.status(200).json({
      message: 'IVOR API Gateway - Cross-Domain Coordination Hub',
      service: 'ivor-api-gateway',
      availableServices: Object.keys(serviceUrls),
      endpoints: [
        '/api/health - Gateway health check',
        '/api/status - All services status', 
        '/api/chat - Route to single service',
        '/api/chat/orchestrated - Query multiple services'
      ],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Gateway error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      service: 'ivor-api-gateway',
      message: error.message
    });
  }
}`;

  fs.writeFileSync(path.join(apiDir, 'index.js'), gatewayFunction);
  console.log('✅ Created enhanced API Gateway with orchestration');

  // Create proper vercel.json for gateway
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
      "NODE_ENV": "production"
    }
  };

  fs.writeFileSync(path.join(gatewayPath, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
  console.log('✅ Updated API Gateway vercel.json');

  // Create public directory
  const publicDir = path.join(gatewayPath, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const indexHtml = `<!DOCTYPE html>
<html>
<head>
    <title>IVOR API Gateway</title>
</head>
<body>
    <h1>IVOR API Gateway - Cross-Domain Coordination Hub</h1>
    <p>API endpoints available at /api/*</p>
    <ul>
        <li>/api/health - Gateway health check</li>
        <li>/api/status - All services status</li>
        <li>/api/chat - Route to single service</li>
        <li>/api/chat/orchestrated - Query multiple services</li>
    </ul>
</body>
</html>`;

  fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);
  console.log('✅ Created API Gateway public page');
}

console.log('🚀 Creating enhanced IVOR API Gateway...\n');
createAPIGateway();
console.log('\n🎯 API Gateway created with full orchestration capabilities!');
console.log('\n📝 Next step: Deploy with vercel --prod --yes');