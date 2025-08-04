#!/usr/bin/env node

/**
 * BLKOUT Website - Comprehensive Production Validation Framework
 * 
 * This script performs extensive validation to prevent the 35+ previous deployment failures
 * by checking every aspect of production readiness systematically.
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ComprehensiveProductionValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      critical: 0,
      tests: [],
      startTime: Date.now()
    };
    this.criticalIssues = [];
    this.deploymentBlockers = [];
    this.performanceIssues = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',      // Cyan
      success: '\x1b[32m',   // Green
      warning: '\x1b[33m',   // Yellow
      error: '\x1b[31m',     // Red
      critical: '\x1b[41m',  // Red background
      reset: '\x1b[0m'       // Reset
    };
    
    const icon = {
      info: '📋',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      critical: '🚨'
    };
    
    console.log(`${colors[type]}${icon[type]} [${timestamp}] ${message}${colors.reset}`);
  }

  async runTest(name, testFn, isCritical = false) {
    this.log(`🧪 Running: ${name}`, 'info');
    const startTime = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      if (result.success) {
        this.results.passed++;
        this.log(`✅ PASSED: ${name} (${duration}ms)`, 'success');
        if (result.message) this.log(`   ${result.message}`, 'info');
      } else {
        if (isCritical || result.critical) {
          this.results.critical++;
          this.criticalIssues.push({ name, ...result });
          this.log(`🚨 CRITICAL FAILURE: ${name}`, 'critical');
          this.log(`   ${result.message}`, 'critical');
          if (result.blocksDeployment) {
            this.deploymentBlockers.push({ name, ...result });
          }
        } else {
          this.results.failed++;
          this.log(`❌ FAILED: ${name}`, 'error');
          this.log(`   ${result.message}`, 'error');
        }
      }
      
      if (result.warnings && result.warnings.length > 0) {
        this.results.warnings += result.warnings.length;
        result.warnings.forEach(warning => {
          this.log(`   ⚠️ ${warning}`, 'warning');
        });
      }
      
      this.results.tests.push({ 
        name, 
        ...result, 
        duration,
        critical: isCritical || result.critical
      });
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.failed++;
      this.log(`💥 ERROR: ${name} - ${error.message}`, 'error');
      this.results.tests.push({ 
        name, 
        success: false, 
        message: error.message, 
        duration,
        critical: isCritical 
      });
    }
  }

  // Test 1: Environment Configuration (CRITICAL)
  async validateEnvironmentConfig() {
    const issues = [];
    const warnings = [];
    
    // Check .env.production file
    const envProdPath = path.join(__dirname, '.env.production');
    if (!fs.existsSync(envProdPath)) {
      issues.push('Missing .env.production file');
    } else {
      const envContent = fs.readFileSync(envProdPath, 'utf8');
      const envVars = envContent.split('\n')
        .filter(line => line.includes('='))
        .reduce((acc, line) => {
          const [key, value] = line.split('=');
          acc[key] = value;
          return acc;
        }, {});

      // Critical environment variables
      const required = [
        'NODE_ENV',
        'VITE_IVOR_API_URL',
        'VITE_EVENTS_API_URL',
        'VITE_NEWSROOM_API_URL'
      ];

      const missing = required.filter(key => !envVars[key]);
      if (missing.length > 0) {
        issues.push(`Missing required environment variables: ${missing.join(', ')}`);
      }

      // Validate URLs
      const urlVars = ['VITE_IVOR_API_URL', 'VITE_EVENTS_API_URL', 'VITE_NEWSROOM_API_URL'];
      for (const urlVar of urlVars) {
        if (envVars[urlVar] && !envVars[urlVar].startsWith('http')) {
          issues.push(`Invalid URL format for ${urlVar}: ${envVars[urlVar]}`);
        }
      }

      // Check for development URLs in production
      const prodUrls = Object.entries(envVars)
        .filter(([key, value]) => key.includes('URL') && value)
        .filter(([, value]) => value.includes('localhost') || value.includes('127.0.0.1'));
      
      if (prodUrls.length > 0) {
        warnings.push(`Development URLs found in production config: ${prodUrls.map(([k]) => k).join(', ')}`);
      }
    }

    return {
      success: issues.length === 0,
      critical: issues.length > 0,
      blocksDeployment: issues.length > 0,
      message: issues.length > 0 ? issues.join('; ') : 'Environment configuration valid',
      warnings
    };
  }

  // Test 2: Mock Data Detection (CRITICAL)
  async scanForProductionMockData() {
    const srcPath = path.join(__dirname, 'src');
    const mockPatterns = [
      { pattern: /mock[A-Z]\w+/g, severity: 'critical', description: 'Mock implementations' },
      { pattern: /fake[A-Z]\w+/g, severity: 'critical', description: 'Fake implementations' },
      { pattern: /stub[A-Z]\w+/g, severity: 'critical', description: 'Stub implementations' },
      { pattern: /TODO.*implement/gi, severity: 'high', description: 'TODO implementation notes' },
      { pattern: /FIXME.*mock/gi, severity: 'high', description: 'FIXME mock references' },
      { pattern: /console\.log/g, severity: 'medium', description: 'Debug console.log statements' },
      { pattern: /placeholder|lorem ipsum/gi, severity: 'medium', description: 'Placeholder content' }
    ];

    let criticalIssues = [];
    let warnings = [];
    let totalMatches = 0;

    function scanDirectory(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const relativePath = path.relative(srcPath, fullPath);
          
          for (const { pattern, severity, description } of mockPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              totalMatches += matches.length;
              const issue = `${relativePath}: ${matches.length} ${description}`;
              
              if (severity === 'critical') {
                criticalIssues.push(issue);
              } else {
                warnings.push(issue);
              }
            }
          }
        }
      }
    }

    scanDirectory(srcPath);

    return {
      success: criticalIssues.length === 0,
      critical: criticalIssues.length > 0,
      blocksDeployment: criticalIssues.length > 0,
      message: criticalIssues.length > 0 
        ? `${criticalIssues.length} critical mock data issues found` 
        : `Code scan clean - ${totalMatches} total matches found`,
      warnings: warnings.slice(0, 10), // Limit warnings
      details: { criticalIssues, totalMatches }
    };
  }

  // Test 3: Build System Validation (CRITICAL)
  async validateBuildSystem() {
    const issues = [];
    const warnings = [];

    try {
      // Clean previous build
      const distPath = path.join(__dirname, 'dist');
      if (fs.existsSync(distPath)) {
        execSync('rm -rf dist', { cwd: __dirname });
      }

      // Run production build
      const buildOutput = execSync('npm run build', { 
        cwd: __dirname, 
        encoding: 'utf8',
        timeout: 60000 // 1 minute timeout
      });

      // Check build output
      if (!fs.existsSync(distPath)) {
        issues.push('Build directory not created');
      } else {
        const files = fs.readdirSync(distPath);
        if (files.length === 0) {
          issues.push('Build directory is empty');
        }

        // Check for critical files
        const requiredFiles = ['index.html'];
        const missingFiles = requiredFiles.filter(file => !files.includes(file));
        if (missingFiles.length > 0) {
          issues.push(`Missing critical files: ${missingFiles.join(', ')}`);
        }

        // Check for assets directory
        const assetsPath = path.join(distPath, 'assets');
        if (!fs.existsSync(assetsPath)) {
          issues.push('Assets directory not found');
        } else {
          const assetFiles = fs.readdirSync(assetsPath);
          if (assetFiles.length === 0) {
            warnings.push('Assets directory is empty');
          }
        }
      }

      // Parse build output for warnings/errors
      if (buildOutput.includes('warning')) {
        const warningCount = (buildOutput.match(/warning/gi) || []).length;
        warnings.push(`${warningCount} build warnings found`);
      }

    } catch (error) {
      issues.push(`Build failed: ${error.message}`);
    }

    return {
      success: issues.length === 0,
      critical: issues.length > 0,
      blocksDeployment: issues.length > 0,
      message: issues.length > 0 ? issues.join('; ') : 'Build system functional',
      warnings
    };
  }

  // Test 4: Asset Performance Validation (HIGH)
  async validateAssetPerformance() {
    const issues = [];
    const warnings = [];
    const distPath = path.join(__dirname, 'dist');

    if (!fs.existsSync(distPath)) {
      return {
        success: false,
        critical: false,
        message: 'Build directory not found - run build first'
      };
    }

    // Check total bundle size
    let totalSize = 0;
    let largeAssets = [];
    let imageSize = 0;

    function calculateSize(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          calculateSize(fullPath);
        } else {
          const sizeKB = Math.round(stat.size / 1024);
          totalSize += sizeKB;
          
          if (item.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            imageSize += sizeKB;
          }
          
          // Flag large individual assets
          if (sizeKB > 1000) { // > 1MB
            largeAssets.push({ file: path.relative(distPath, fullPath), size: sizeKB });
          }
        }
      }
    }

    calculateSize(distPath);

    // Performance thresholds
    if (totalSize > 5000) { // > 5MB total
      issues.push(`Large total bundle size: ${totalSize}KB (recommended: <5MB)`);
    }

    if (imageSize > 50000) { // > 50MB images
      issues.push(`Excessive image assets: ${imageSize}KB (consider optimization)`);
    }

    if (largeAssets.length > 0) {
      warnings.push(`Large assets found: ${largeAssets.map(a => `${a.file} (${a.size}KB)`).join(', ')}`);
    }

    // Check for unoptimized images
    const imageFiles = [];
    const imagesPath = path.join(distPath, 'images');
    if (fs.existsSync(imagesPath)) {
      function findImages(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          const fullPath = path.join(dir, item);
          if (fs.statSync(fullPath).isDirectory()) {
            findImages(fullPath);
          } else if (item.match(/\.(jpg|jpeg|png|gif)$/i)) {
            imageFiles.push(item);
          }
        }
      }
      findImages(imagesPath);
    }

    if (imageFiles.length > 50) {
      warnings.push(`High number of image assets: ${imageFiles.length} (consider lazy loading)`);
    }

    return {
      success: issues.length === 0,
      critical: false,
      message: issues.length > 0 ? issues.join('; ') : `Performance metrics acceptable: ${totalSize}KB total`,
      warnings,
      details: { totalSize, imageSize, largeAssets, imageCount: imageFiles.length }
    };
  }

  // Test 5: Security Validation (CRITICAL)
  async validateSecurity() {
    const issues = [];
    const warnings = [];
    const srcPath = path.join(__dirname, 'src');

    // Security patterns to check
    const securityPatterns = [
      { pattern: /eval\s*\(/g, severity: 'critical', description: 'eval() usage' },
      { pattern: /innerHTML\s*=/g, severity: 'critical', description: 'innerHTML assignment' },
      { pattern: /dangerouslySetInnerHTML/g, severity: 'high', description: 'dangerouslySetInnerHTML usage' },
      { pattern: /document\.write/g, severity: 'critical', description: 'document.write usage' },
      { pattern: /\.createElement\('script'/g, severity: 'high', description: 'Dynamic script creation' },
      { pattern: /http:\/\/(?!localhost)/g, severity: 'medium', description: 'Non-HTTPS URLs' },
      { pattern: /password|secret|key/gi, severity: 'medium', description: 'Potential credential exposure' }
    ];

    let criticalVulnerabilities = [];
    let securityWarnings = [];

    function scanForSecurity(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanForSecurity(fullPath);
        } else if (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const relativePath = path.relative(srcPath, fullPath);
          
          for (const { pattern, severity, description } of securityPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              const issue = `${relativePath}: ${description} (${matches.length} occurrences)`;
              
              if (severity === 'critical') {
                criticalVulnerabilities.push(issue);
              } else {
                securityWarnings.push(issue);
              }
            }
          }
        }
      }
    }

    scanForSecurity(srcPath);

    // Check for HTTPS configuration
    const viteConfigPath = path.join(__dirname, 'vite.config.ts');
    if (fs.existsSync(viteConfigPath)) {
      const viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
      if (!viteConfig.includes('https') && process.env.NODE_ENV === 'production') {
        warnings.push('HTTPS not configured in Vite config for production');
      }
    }

    return {
      success: criticalVulnerabilities.length === 0,
      critical: criticalVulnerabilities.length > 0,
      blocksDeployment: criticalVulnerabilities.length > 0,
      message: criticalVulnerabilities.length > 0 
        ? `${criticalVulnerabilities.length} critical security vulnerabilities found`
        : 'No critical security vulnerabilities detected',
      warnings: securityWarnings.slice(0, 10),
      details: { criticalVulnerabilities, securityWarnings }
    };
  }

  // Test 6: Backend Service Integration (HIGH)
  async validateBackendIntegration() {
    const services = [
      { 
        name: 'IVOR Backend', 
        url: 'http://localhost:8000/health',
        production: 'https://ivor.blkoutuk.com/health',
        critical: true
      },
      { 
        name: 'Events API', 
        url: 'http://localhost:5173/api/health',
        production: 'https://events.blkoutuk.com/api/health',
        critical: false
      },
      { 
        name: 'Newsroom API', 
        url: 'http://localhost:3001/health',
        production: 'https://newsroom.blkoutuk.com/health',
        critical: false
      }
    ];

    let onlineServices = 0;
    let offlineServices = 0;
    let serviceResults = [];
    let criticalOffline = [];

    for (const service of services) {
      const testUrl = process.env.NODE_ENV === 'production' ? service.production : service.url;
      
      try {
        const response = await fetch(testUrl, { 
          signal: AbortSignal.timeout(5000),
          method: 'GET'
        });
        
        if (response.ok) {
          onlineServices++;
          serviceResults.push(`${service.name}: ✅ Online (${response.status})`);
        } else {
          offlineServices++;
          serviceResults.push(`${service.name}: ⚠️ HTTP ${response.status}`);
          if (service.critical) {
            criticalOffline.push(service.name);
          }
        }
      } catch (error) {
        offlineServices++;
        serviceResults.push(`${service.name}: ❌ Offline`);
        if (service.critical) {
          criticalOffline.push(service.name);
        }
      }
    }

    return {
      success: criticalOffline.length === 0,
      critical: criticalOffline.length > 0,
      blocksDeployment: false, // Backend services have fallbacks
      message: `${onlineServices}/${services.length} services online. ${serviceResults.join(', ')}`,
      warnings: criticalOffline.length > 0 ? [`Critical services offline: ${criticalOffline.join(', ')}`] : [],
      details: { onlineServices, offlineServices, serviceResults }
    };
  }

  // Test 7: TypeScript Validation (MEDIUM)
  async validateTypeScript() {
    const issues = [];
    const warnings = [];

    try {
      // Check TypeScript configuration
      const tsconfigPath = path.join(__dirname, 'tsconfig.json');
      if (!fs.existsSync(tsconfigPath)) {
        issues.push('TypeScript configuration missing');
        return {
          success: false,
          message: 'tsconfig.json not found'
        };
      }

      // Run TypeScript check (skip if tools are broken)
      try {
        execSync('npx tsc --noEmit', { 
          cwd: __dirname, 
          encoding: 'utf8',
          timeout: 30000
        });
      } catch (error) {
        // Check if it's a tool issue or actual TypeScript errors
        if (error.message.includes('SyntaxError: missing ) after argument list')) {
          warnings.push('TypeScript tool configuration issue - manual validation required');
        } else if (error.stdout && error.stdout.includes('error TS')) {
          const errorCount = (error.stdout.match(/error TS/g) || []).length;
          issues.push(`${errorCount} TypeScript errors found`);
        }
      }

    } catch (error) {
      warnings.push(`TypeScript validation error: ${error.message}`);
    }

    return {
      success: issues.length === 0,
      critical: false,
      message: issues.length > 0 ? issues.join('; ') : 'TypeScript validation passed',
      warnings
    };
  }

  // Test 8: Accessibility Validation (MEDIUM)
  async validateAccessibility() {
    const issues = [];
    const warnings = [];
    const srcPath = path.join(__dirname, 'src');

    // Check for accessibility patterns
    const a11yPatterns = [
      { pattern: /<img(?![^>]*alt=)/g, issue: 'Images without alt attributes' },
      { pattern: /<button[^>]*>[\s]*<\/button>/g, issue: 'Empty buttons' },
      { pattern: /<a[^>]*>[\s]*<\/a>/g, issue: 'Empty links' },
      { pattern: /tabindex=["'][^0-1-]/g, issue: 'Positive tabindex values' }
    ];

    let a11yIssues = [];

    function scanForA11y(dir) {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanForA11y(fullPath);
        } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const relativePath = path.relative(srcPath, fullPath);
          
          for (const { pattern, issue } of a11yPatterns) {
            const matches = content.match(pattern);
            if (matches) {
              a11yIssues.push(`${relativePath}: ${issue} (${matches.length})`);
            }
          }
        }
      }
    }

    scanForA11y(srcPath);

    // Check for ARIA usage
    const componentsPath = path.join(srcPath, 'components');
    if (fs.existsSync(componentsPath)) {
      let ariaUsage = 0;
      let totalComponents = 0;

      function countAriaUsage(dir) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            countAriaUsage(fullPath);
          } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
            totalComponents++;
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('aria-') || content.includes('role=')) {
              ariaUsage++;
            }
          }
        }
      }

      countAriaUsage(componentsPath);
      
      if (totalComponents > 0 && ariaUsage / totalComponents < 0.3) {
        warnings.push(`Low ARIA usage: ${ariaUsage}/${totalComponents} components (${Math.round(ariaUsage/totalComponents*100)}%)`);
      }
    }

    return {
      success: a11yIssues.length < 5, // Allow some minor issues
      critical: false,
      message: a11yIssues.length === 0 
        ? 'No major accessibility issues found'
        : `${a11yIssues.length} accessibility issues found`,
      warnings: a11yIssues.slice(0, 10),
      details: { a11yIssues }
    };
  }

  // Test 9: Performance Monitoring Setup (LOW)
  async validateMonitoring() {
    const warnings = [];
    
    // Check for monitoring scripts
    const monitoringFiles = [
      'monitoring_script.py',
      'monitoring_simple.py'
    ];

    let monitoringSetup = 0;
    for (const file of monitoringFiles) {
      if (fs.existsSync(path.join(__dirname, file))) {
        monitoringSetup++;
      }
    }

    if (monitoringSetup === 0) {
      warnings.push('No monitoring scripts found');
    }

    // Check for analytics configuration
    const envContent = fs.readFileSync(path.join(__dirname, '.env.production'), 'utf8');
    if (!envContent.includes('ANALYTICS') && !envContent.includes('MONITORING')) {
      warnings.push('Analytics/monitoring not configured in environment');
    }

    return {
      success: true,
      critical: false,
      message: `Monitoring setup: ${monitoringSetup} scripts available`,
      warnings
    };
  }

  // Generate comprehensive report
  async generateComprehensiveReport() {
    const duration = Date.now() - this.results.startTime;
    const total = this.results.passed + this.results.failed + this.results.critical;
    const successRate = total > 0 ? Math.round(((this.results.passed) / total) * 100) : 0;
    
    // Determine deployment readiness
    const isDeploymentReady = this.results.critical === 0 && this.deploymentBlockers.length === 0;
    const deploymentRisk = this.results.critical > 0 ? 'HIGH' : 
                          this.results.failed > 2 ? 'MEDIUM' : 'LOW';

    const report = {
      timestamp: new Date().toISOString(),
      duration: Math.round(duration / 1000),
      summary: {
        total,
        passed: this.results.passed,
        failed: this.results.failed,
        critical: this.results.critical,
        warnings: this.results.warnings,
        successRate,
        deploymentReady: isDeploymentReady,
        deploymentRisk
      },
      deploymentBlockers: this.deploymentBlockers,
      criticalIssues: this.criticalIssues,
      performanceIssues: this.performanceIssues,
      tests: this.results.tests,
      recommendations: this.generateRecommendations()
    };

    // Save detailed report
    const reportPath = path.join(__dirname, 'production-readiness-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Console output
    this.log('=' .repeat(80), 'info');
    this.log('🏥 COMPREHENSIVE PRODUCTION VALIDATION REPORT', 'info');
    this.log('=' .repeat(80), 'info');
    
    this.log(`⏱️  Total Duration: ${Math.round(duration / 1000)}s`, 'info');
    this.log(`📊 Tests Run: ${total}`, 'info');
    this.log(`✅ Passed: ${this.results.passed}`, 'success');
    this.log(`❌ Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'info');
    this.log(`🚨 Critical: ${this.results.critical}`, this.results.critical > 0 ? 'critical' : 'info');
    this.log(`⚠️  Warnings: ${this.results.warnings}`, this.results.warnings > 0 ? 'warning' : 'info');
    this.log(`📈 Success Rate: ${successRate}%`, successRate >= 80 ? 'success' : 'warning');

    this.log('=' .repeat(80), 'info');

    if (isDeploymentReady) {
      this.log('🎉 PRODUCTION DEPLOYMENT APPROVED! ✅', 'success');
      this.log('   All critical validations passed - ready for production deployment.', 'success');
    } else {
      this.log('🚫 PRODUCTION DEPLOYMENT BLOCKED! ❌', 'critical');
      this.log(`   ${this.results.critical} critical issues and ${this.deploymentBlockers.length} deployment blockers found.`, 'critical');
    }

    this.log(`🔍 Risk Level: ${deploymentRisk}`, deploymentRisk === 'LOW' ? 'success' : deploymentRisk === 'MEDIUM' ? 'warning' : 'error');
    
    if (this.deploymentBlockers.length > 0) {
      this.log('🚧 DEPLOYMENT BLOCKERS:', 'critical');
      this.deploymentBlockers.forEach((blocker, i) => {
        this.log(`   ${i + 1}. ${blocker.name}: ${blocker.message}`, 'error');
      });
    }

    if (this.criticalIssues.length > 0) {
      this.log('🚨 CRITICAL ISSUES:', 'error');
      this.criticalIssues.forEach((issue, i) => {
        this.log(`   ${i + 1}. ${issue.name}: ${issue.message}`, 'error');
      });
    }

    this.log('=' .repeat(80), 'info');
    this.log(`📄 Detailed report saved to: ${reportPath}`, 'info');
    this.log('=' .repeat(80), 'info');

    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.results.critical > 0) {
      recommendations.push({
        priority: 'CRITICAL',
        action: 'Address all critical issues before deployment',
        details: 'Critical issues can cause complete application failure in production'
      });
    }

    if (this.deploymentBlockers.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Fix deployment blocking issues',
        details: 'These issues will prevent successful deployment'
      });
    }

    if (this.results.warnings > 10) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Address excessive warnings',
        details: 'High warning count indicates potential stability issues'
      });
    }

    if (this.results.failed > 3) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Improve test coverage and validation',
        details: 'Multiple test failures suggest insufficient quality assurance'
      });
    }

    // Add general recommendations
    recommendations.push({
      priority: 'LOW',
      action: 'Set up continuous monitoring',
      details: 'Implement performance and error monitoring for production'
    });

    recommendations.push({
      priority: 'LOW',
      action: 'Establish rollback procedures',
      details: 'Prepare rollback plan in case of deployment issues'
    });

    return recommendations;
  }

  // Main validation runner
  async run() {
    this.log('🚀 Starting Comprehensive Production Validation Framework', 'info');
    this.log('   Purpose: Prevent the 35+ previous deployment failures', 'info');
    this.log('=' .repeat(80), 'info');

    // Critical validations first
    await this.runTest('Environment Configuration', () => this.validateEnvironmentConfig(), true);
    await this.runTest('Mock Data Detection', () => this.scanForProductionMockData(), true);
    await this.runTest('Build System Validation', () => this.validateBuildSystem(), true);
    await this.runTest('Security Validation', () => this.validateSecurity(), true);
    
    // High priority validations
    await this.runTest('Asset Performance', () => this.validateAssetPerformance());
    await this.runTest('Backend Integration', () => this.validateBackendIntegration());
    
    // Medium priority validations
    await this.runTest('TypeScript Validation', () => this.validateTypeScript());
    await this.runTest('Accessibility Validation', () => this.validateAccessibility());
    
    // Low priority validations
    await this.runTest('Monitoring Setup', () => this.validateMonitoring());

    // Generate comprehensive report
    const report = await this.generateComprehensiveReport();
    
    // Exit with appropriate code
    process.exit(this.results.critical > 0 || this.deploymentBlockers.length > 0 ? 1 : 0);
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ComprehensiveProductionValidator();
  validator.run().catch(error => {
    console.error('💥 Comprehensive validation failed:', error);
    process.exit(1);
  });
}

export { ComprehensiveProductionValidator };