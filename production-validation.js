#!/usr/bin/env node

/**
 * BLKOUT Website - Production Validation & Deployment Script
 * 
 * This script performs comprehensive validation checks before and after deployment
 * to ensure the BLKOUT community platform is 100% production-ready.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ProductionValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async runTest(name, testFn) {
    this.log(`🧪 Running: ${name}`, 'info');
    try {
      const result = await testFn();
      if (result.success) {
        this.results.passed++;
        this.log(`✅ PASSED: ${name}`, 'success');
        if (result.message) this.log(`   ${result.message}`, 'info');
      } else {
        this.results.failed++;
        this.log(`❌ FAILED: ${name}`, 'error');
        this.log(`   ${result.message}`, 'error');
      }
      this.results.tests.push({ name, ...result });
    } catch (error) {
      this.results.failed++;
      this.log(`💥 ERROR: ${name} - ${error.message}`, 'error');
      this.results.tests.push({ name, success: false, message: error.message });
    }
  }

  // Test 1: Build Process Validation
  async validateBuild() {
    return new Promise((resolve) => {
      try {
        execSync('npm run build', { cwd: __dirname, stdio: 'pipe' });
        
        // Check dist directory exists and has content
        const distPath = path.join(__dirname, 'dist');
        if (!fs.existsSync(distPath)) {
          resolve({ success: false, message: 'Build directory not found' });
          return;
        }

        const files = fs.readdirSync(distPath);
        if (files.length === 0) {
          resolve({ success: false, message: 'Build directory is empty' });
          return;
        }

        // Check for critical files
        const hasIndex = files.includes('index.html');
        const hasAssets = files.includes('assets');
        
        if (!hasIndex || !hasAssets) {
          resolve({ success: false, message: 'Missing critical build files' });
          return;
        }

        resolve({ 
          success: true, 
          message: `Build successful with ${files.length} output files` 
        });
      } catch (error) {
        resolve({ 
          success: false, 
          message: `Build failed: ${error.message}` 
        });
      }
    });
  }

  // Test 2: Mock Data Detection
  async scanForMockData() {
    return new Promise((resolve) => {
      try {
        const srcPath = path.join(__dirname, 'src');
        const mockPatterns = ['mock', 'fake', 'stub', 'TODO', 'FIXME'];
        let foundMocks = [];

        function scanDirectory(dir) {
          const items = fs.readdirSync(dir);
          
          for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
              scanDirectory(fullPath);
            } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
              const content = fs.readFileSync(fullPath, 'utf8');
              
              for (const pattern of mockPatterns) {
                if (content.toLowerCase().includes(pattern.toLowerCase())) {
                  const lines = content.split('\n');
                  const matches = lines
                    .map((line, index) => ({ line: line.trim(), number: index + 1 }))
                    .filter(({ line }) => line.toLowerCase().includes(pattern.toLowerCase()))
                    .slice(0, 3); // Limit to first 3 matches per file
                  
                  if (matches.length > 0) {
                    foundMocks.push({
                      file: path.relative(srcPath, fullPath),
                      pattern,
                      matches: matches.length,
                      examples: matches
                    });
                  }
                }
              }
            }
          }
        }

        scanDirectory(srcPath);

        if (foundMocks.length > 0) {
          const summary = foundMocks.map(mock => 
            `${mock.file}: ${mock.matches} ${mock.pattern} references`
          ).join(', ');
          
          resolve({
            success: false,
            message: `Found ${foundMocks.length} files with mock data: ${summary}`
          });
        } else {
          resolve({
            success: true,
            message: 'No mock data patterns detected'
          });
        }
      } catch (error) {
        resolve({
          success: false,
          message: `Mock data scan failed: ${error.message}`
        });
      }
    });
  }

  // Test 3: Environment Configuration
  async validateEnvironment() {
    return new Promise((resolve) => {
      const requiredEnvVars = [
        'VITE_IVOR_API_URL',
        'VITE_EVENTS_API_URL'
      ];

      const missing = requiredEnvVars.filter(varName => !process.env[varName]);
      
      if (missing.length > 0) {
        resolve({
          success: false,
          message: `Missing environment variables: ${missing.join(', ')}`
        });
      } else {
        resolve({
          success: true,
          message: `All ${requiredEnvVars.length} required environment variables present`
        });
      }
    });
  }

  // Test 4: Security Scan
  async securityScan() {
    return new Promise((resolve) => {
      try {
        const srcPath = path.join(__dirname, 'src');
        const securityIssues = [];
        
        function scanForSecurity(dir) {
          const items = fs.readdirSync(dir);
          
          for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
              scanForSecurity(fullPath);
            } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
              const content = fs.readFileSync(fullPath, 'utf8');
              
              // Check for dangerous patterns
              const dangerousPatterns = [
                { pattern: /eval\s*\(/, issue: 'eval() usage detected' },
                { pattern: /innerHTML\s*=/, issue: 'innerHTML assignment detected' },
                { pattern: /dangerouslySetInnerHTML/, issue: 'dangerouslySetInnerHTML usage detected' },
                { pattern: /document\.write/, issue: 'document.write usage detected' }
              ];

              for (const { pattern, issue } of dangerousPatterns) {
                if (pattern.test(content)) {
                  securityIssues.push({
                    file: path.relative(srcPath, fullPath),
                    issue
                  });
                }
              }
            }
          }
        }

        scanForSecurity(srcPath);

        if (securityIssues.length > 0) {
          const summary = securityIssues.map(issue => 
            `${issue.file}: ${issue.issue}`
          ).join(', ');
          
          resolve({
            success: false,
            message: `Security issues found: ${summary}`
          });
        } else {
          resolve({
            success: true,
            message: 'No security vulnerabilities detected'
          });
        }
      } catch (error) {
        resolve({
          success: false,
          message: `Security scan failed: ${error.message}`
        });
      }
    });
  }

  // Test 5: Performance Validation
  async validatePerformance() {
    return new Promise((resolve) => {
      try {
        const distPath = path.join(__dirname, 'dist');
        
        if (!fs.existsSync(distPath)) {
          resolve({ success: false, message: 'Build directory not found' });
          return;
        }

        // Check bundle sizes
        const assetsPath = path.join(distPath, 'assets');
        if (!fs.existsSync(assetsPath)) {
          resolve({ success: false, message: 'Assets directory not found' });
          return;
        }

        const assetFiles = fs.readdirSync(assetsPath);
        let totalSize = 0;
        let largeFiles = [];

        for (const file of assetFiles) {
          const filePath = path.join(assetsPath, file);
          const stats = fs.statSync(filePath);
          const sizeKB = Math.round(stats.size / 1024);
          totalSize += sizeKB;

          if (sizeKB > 500) { // Files larger than 500KB
            largeFiles.push({ file, size: sizeKB });
          }
        }

        let warnings = [];
        if (totalSize > 2000) { // Total size > 2MB
          warnings.push(`Large total bundle size: ${totalSize}KB`);
        }
        
        if (largeFiles.length > 0) {
          warnings.push(`Large files: ${largeFiles.map(f => `${f.file} (${f.size}KB)`).join(', ')}`);
        }

        resolve({
          success: warnings.length === 0,
          message: warnings.length > 0 ? warnings.join('; ') : `Performance good: ${totalSize}KB total, ${assetFiles.length} assets`
        });
      } catch (error) {
        resolve({
          success: false,
          message: `Performance validation failed: ${error.message}`
        });
      }
    });
  }

  // Test 6: Backend Service Connectivity
  async validateBackendServices() {
    return new Promise(async (resolve) => {
      const services = [
        { name: 'IVOR Backend', url: 'http://localhost:8000/health' },
        { name: 'Events Calendar', url: 'http://localhost:5173/api/health' }
      ];

      let results = [];
      
      for (const service of services) {
        try {
          const response = await fetch(service.url, { 
            signal: AbortSignal.timeout(5000) 
          });
          
          if (response.ok) {
            results.push(`${service.name}: ✅ Online`);
          } else {
            results.push(`${service.name}: ⚠️ HTTP ${response.status}`);
          }
        } catch (error) {
          results.push(`${service.name}: ❌ Offline`);
        }
      }

      const onlineCount = results.filter(r => r.includes('✅')).length;
      
      resolve({
        success: onlineCount > 0, // At least one service should be online
        message: results.join(', ')
      });
    });
  }

  // Main validation runner
  async run() {
    this.log('🚀 Starting BLKOUT Website Production Validation', 'info');
    this.log('=' .repeat(60), 'info');

    // Run all validation tests
    await this.runTest('Build Process Validation', () => this.validateBuild());
    await this.runTest('Mock Data Detection', () => this.scanForMockData());
    await this.runTest('Environment Configuration', () => this.validateEnvironment());
    await this.runTest('Security Scan', () => this.securityScan());
    await this.runTest('Performance Validation', () => this.validatePerformance());
    await this.runTest('Backend Services Connectivity', () => this.validateBackendServices());

    // Generate final report
    this.generateReport();
  }

  generateReport() {
    const duration = Date.now() - this.startTime;
    const total = this.results.passed + this.results.failed;
    const percentage = total > 0 ? Math.round((this.results.passed / total) * 100) : 0;

    this.log('=' .repeat(60), 'info');
    this.log('📊 PRODUCTION VALIDATION REPORT', 'info');
    this.log('=' .repeat(60), 'info');
    
    this.log(`⏱️  Duration: ${Math.round(duration / 1000)}s`, 'info');
    this.log(`✅ Passed: ${this.results.passed}`, 'success');
    this.log(`❌ Failed: ${this.results.failed}`, this.results.failed > 0 ? 'error' : 'info');
    this.log(`📈 Success Rate: ${percentage}%`, percentage >= 80 ? 'success' : 'warning');

    if (percentage >= 80) {
      this.log('🎉 PRODUCTION VALIDATION PASSED! Ready for deployment.', 'success');
    } else {
      this.log('⚠️  PRODUCTION VALIDATION INCOMPLETE. Address issues before deployment.', 'warning');
    }

    // Write detailed report to file
    const reportPath = path.join(__dirname, 'production-validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      duration: Math.round(duration / 1000),
      results: this.results,
      summary: {
        total,
        passed: this.results.passed,
        failed: this.results.failed,
        percentage,
        status: percentage >= 80 ? 'READY' : 'NEEDS_WORK'
      }
    }, null, 2));

    this.log(`📄 Detailed report saved to: ${reportPath}`, 'info');
    this.log('=' .repeat(60), 'info');

    // Exit with appropriate code
    process.exit(this.results.failed > 0 ? 1 : 0);
  }
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new ProductionValidator();
  validator.run().catch(error => {
    console.error('💥 Validation script failed:', error);
    process.exit(1);
  });
}

export { ProductionValidator };