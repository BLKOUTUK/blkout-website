/**
 * Deploy IVOR monitoring checks via Checkly API
 * This bypasses the CLI project initialization issues
 */

const ACCOUNT_ID = "69781a21-8d44-4a43-a99d-33d40c07991f";
const API_KEY = process.env.CHECKLY_API_KEY;

if (!API_KEY) {
  console.error("❌ CHECKLY_API_KEY environment variable not set");
  process.exit(1);
}

const IVOR_API_GATEWAY = 'https://ivor-api-gateway-1yhe12lks-robs-projects-54d653d3.vercel.app';

// Define IVOR monitoring checks
const checks = [
  {
    name: "IVOR API Gateway Health",
    checkType: "API",
    frequency: 5,
    locations: ["eu-west-1", "us-east-1"],
    request: {
      method: "GET",
      url: `${IVOR_API_GATEWAY}/health`
    },
    assertions: [
      {
        source: "STATUS_CODE",
        comparison: "EQUALS",
        target: "200"
      },
      {
        source: "RESPONSE_TIME",
        comparison: "LESS_THAN",
        target: 5000
      }
    ]
  },
  {
    name: "IVOR System Disruptor Response",
    checkType: "API", 
    frequency: 5,
    locations: ["eu-west-1", "us-east-1"],
    request: {
      method: "POST",
      url: `${IVOR_API_GATEWAY}/api/chat`,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "I need help organizing community action around housing justice",
        context: { pathway: "System Disruptor", focus: "housing justice" }
      })
    },
    assertions: [
      {
        source: "STATUS_CODE",
        comparison: "EQUALS",
        target: "200"
      },
      {
        source: "RESPONSE_TIME", 
        comparison: "LESS_THAN",
        target: 8000
      },
      {
        source: "JSON_BODY",
        property: "$.response",
        comparison: "NOT_EMPTY"
      }
    ]
  },
  {
    name: "IVOR Monitoring Dashboard",
    checkType: "API",
    frequency: 5,
    locations: ["eu-west-1", "us-east-1"], 
    request: {
      method: "GET",
      url: "https://ivor-monitoring-service.vercel.app/"
    },
    assertions: [
      {
        source: "STATUS_CODE",
        comparison: "EQUALS",
        target: "200"
      },
      {
        source: "RESPONSE_TIME",
        comparison: "LESS_THAN", 
        target: 5000
      }
    ]
  }
];

async function createCheck(check) {
  try {
    const response = await fetch('https://api.checklyhq.com/v1/checks', {
      method: 'POST',
      headers: {
        'X-Checkly-Account': ACCOUNT_ID,
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(check)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Created check: ${check.name} (ID: ${result.id})`);
      return result;
    } else {
      const error = await response.text();
      console.error(`❌ Failed to create ${check.name}: ${error}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error creating ${check.name}:`, error.message);
    return null;
  }
}

async function deployChecks() {
  console.log("🚀 Deploying IVOR monitoring checks...");
  console.log(`📍 Account: ${ACCOUNT_ID}`);
  console.log(`📊 Checks: ${checks.length}`);
  console.log("");

  const results = [];
  for (const check of checks) {
    console.log(`⏳ Creating: ${check.name}`);
    const result = await createCheck(check);
    if (result) {
      results.push(result);
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("");
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log(`✅ Successfully created ${results.length}/${checks.length} checks`);
  console.log("");
  console.log("🔍 View your monitoring at:");
  console.log(`   Checkly: https://app.checklyhq.com/checks`);
  console.log(`   IVOR:    https://ivor-monitoring-service.vercel.app/`);
  console.log("");
  console.log("🎯 IVOR platform is now beta launch ready!");
}

deployChecks().catch(console.error);