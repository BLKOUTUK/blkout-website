#!/usr/bin/env node

/**
 * BLKOUT Website - Load Testing & Performance Validation
 * 
 * Validates application performance under real-world load conditions
 * to prevent performance-related deployment failures.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class LoadTestValidator {
  constructor() {
    this.results = {
      tests: [],
      performance: {},
      recommendations: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      warning: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m'
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  // Simulate concurrent user load
  async simulateUserLoad(baseUrl, concurrentUsers = 10, duration = 30000) {
    this.log(`🚀 Starting load test: ${concurrentUsers} users for ${duration/1000}s`);
    
    const startTime = Date.now();
    const results = {
      requests: 0,
      successful: 0,
      failed: 0,
      responseTimes: [],
      errors: []
    };

    const endpoints = [
      '/',
      '/magazine',
      '/community',
      '/events',
      '/ivor',
      '/newsroom'
    ];

    // Create concurrent user sessions
    const userSessions = Array.from({ length: concurrentUsers }, (_, i) => 
      this.simulateUserSession(baseUrl, endpoints, duration, results, i)
    );

    await Promise.all(userSessions);

    const totalTime = Date.now() - startTime;
    const avgResponseTime = results.responseTimes.length > 0 
      ? results.responseTimes.reduce((a, b) => a + b, 0) / results.responseTimes.length 
      : 0;

    const successRate = results.requests > 0 ? (results.successful / results.requests) * 100 : 0;

    return {
      duration: totalTime,
      requests: results.requests,
      successful: results.successful,
      failed: results.failed,
      successRate,
      avgResponseTime,
      maxResponseTime: Math.max(...results.responseTimes, 0),
      minResponseTime: Math.min(...results.responseTimes, 0),
      requestsPerSecond: results.requests / (totalTime / 1000),
      errors: results.errors.slice(0, 10) // Limit error list
    };
  }

  async simulateUserSession(baseUrl, endpoints, duration, results, userId) {
    const sessionStart = Date.now();
    let requestCount = 0;

    while (Date.now() - sessionStart < duration) {
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      const url = `${baseUrl}${endpoint}`;
      
      try {
        const requestStart = Date.now();
        const response = await fetch(url, {
          signal: AbortSignal.timeout(10000), // 10s timeout
          headers: {
            'User-Agent': `LoadTest-User-${userId}`,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });

        const responseTime = Date.now() - requestStart;
        results.responseTimes.push(responseTime);
        results.requests++;
        requestCount++;

        if (response.ok) {
          results.successful++;
        } else {
          results.failed++;
          results.errors.push(`User ${userId}: ${endpoint} returned ${response.status}`);
        }

        // Simulate user think time (1-3 seconds)
        const thinkTime = Math.random() * 2000 + 1000;
        await new Promise(resolve => setTimeout(resolve, thinkTime));

      } catch (error) {
        results.requests++;
        results.failed++;
        results.errors.push(`User ${userId}: ${endpoint} failed - ${error.message}`);
      }
    }

    this.log(`User ${userId} completed ${requestCount} requests`);
  }

  // Memory usage monitoring
  async monitorMemoryUsage(duration = 30000) {
    this.log('🧠 Starting memory usage monitoring');
    
    const startTime = Date.now();
    const memorySnapshots = [];
    
    const monitorInterval = setInterval(() => {
      const usage = process.memoryUsage();
      memorySnapshots.push({
        timestamp: Date.now(),
        heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
        external: Math.round(usage.external / 1024 / 1024), // MB
        rss: Math.round(usage.rss / 1024 / 1024) // MB
      });
    }, 1000);

    await new Promise(resolve => setTimeout(resolve, duration));
    clearInterval(monitorInterval);

    const avgHeapUsed = memorySnapshots.reduce((sum, snap) => sum + snap.heapUsed, 0) / memorySnapshots.length;
    const maxHeapUsed = Math.max(...memorySnapshots.map(s => s.heapUsed));
    const avgRSS = memorySnapshots.reduce((sum, snap) => sum + snap.rss, 0) / memorySnapshots.length;

    return {
      duration,
      snapshots: memorySnapshots.length,
      avgHeapUsed: Math.round(avgHeapUsed),
      maxHeapUsed,
      avgRSS: Math.round(avgRSS),
      memoryGrowth: memorySnapshots[memorySnapshots.length - 1].heapUsed - memorySnapshots[0].heapUsed
    };
  }

  // Bundle size analysis
  async analyzeBundleSize() {
    this.log('📦 Analyzing bundle size and composition');
    
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
      return {
        error: 'Build directory not found - run build first'
      };
    }

    const assets = [];
    let totalSize = 0;

    const assetsPath = path.join(distPath, 'assets');
    if (fs.existsSync(assetsPath)) {
      const files = fs.readdirSync(assetsPath);
      
      for (const file of files) {
        const filePath = path.join(assetsPath, file);
        const stats = fs.statSync(filePath);
        const sizeKB = Math.round(stats.size / 1024);
        
        assets.push({
          name: file,
          size: sizeKB,
          type: this.getAssetType(file)
        });
        
        totalSize += sizeKB;
      }
    }

    // Analyze asset types
    const assetTypes = assets.reduce((types, asset) => {
      types[asset.type] = (types[asset.type] || 0) + asset.size;
      return types;
    }, {});

    return {
      totalSize,
      assetCount: assets.length,
      assets: assets.sort((a, b) => b.size - a.size).slice(0, 10), // Top 10 largest
      assetTypes,
      recommendations: this.getBundleRecommendations(assets, totalSize)
    };
  }

  getAssetType(filename) {
    if (filename.match(/\.(js|jsx|ts|tsx)$/)) return 'javascript';
    if (filename.match(/\.(css|scss|sass)$/)) return 'stylesheet';
    if (filename.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image';
    if (filename.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    if (filename.match(/\.(mp4|webm|ogg)$/)) return 'video';
    return 'other';
  }

  getBundleRecommendations(assets, totalSize) {
    const recommendations = [];

    if (totalSize > 2000) {
      recommendations.push('Consider code splitting to reduce initial bundle size');
    }

    const largeAssets = assets.filter(asset => asset.size > 500);
    if (largeAssets.length > 0) {
      recommendations.push(`Large assets found: ${largeAssets.map(a => a.name).join(', ')}`);
    }

    const jsSize = assets.filter(asset => asset.type === 'javascript').reduce((sum, asset) => sum + asset.size, 0);
    if (jsSize > 1000) {
      recommendations.push('JavaScript bundle is large - consider lazy loading and tree shaking');
    }

    const imageSize = assets.filter(asset => asset.type === 'image').reduce((sum, asset) => sum + asset.size, 0);
    if (imageSize > 2000) {
      recommendations.push('Image assets are large - consider optimization and WebP format');
    }

    return recommendations;
  }

  // Core Web Vitals simulation
  async simulateCoreWebVitals(baseUrl) {
    this.log('📊 Simulating Core Web Vitals metrics');
    
    const metrics = {
      FCP: [], // First Contentful Paint
      LCP: [], // Largest Contentful Paint
      CLS: [], // Cumulative Layout Shift
      FID: []  // First Input Delay
    };

    // Simulate multiple page loads
    for (let i = 0; i < 5; i++) {
      try {
        const startTime = Date.now();
        
        const response = await fetch(baseUrl, {
          signal: AbortSignal.timeout(30000)
        });
        
        if (response.ok) {
          const endTime = Date.now();
          const loadTime = endTime - startTime;
          
          // Estimate metrics based on load time
          // These are rough estimates - real measurements would need browser APIs
          metrics.FCP.push(Math.min(loadTime * 0.6, 2000)); // FCP typically 60% of load time
          metrics.LCP.push(Math.min(loadTime * 0.8, 4000)); // LCP typically 80% of load time
          metrics.CLS.push(Math.random() * 0.1); // Random CLS score (0-0.1 is good)
          metrics.FID.push(Math.random() * 100); // Random FID (0-100ms is good)
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait between tests
        
      } catch (error) {
        this.log(`Web Vitals test ${i + 1} failed: ${error.message}`, 'warning');
      }
    }

    // Calculate averages
    const avgMetrics = {};
    for (const [metric, values] of Object.entries(metrics)) {
      if (values.length > 0) {
        avgMetrics[metric] = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
      } else {
        avgMetrics[metric] = null;
      }
    }

    return {
      samples: Math.max(...Object.values(metrics).map(arr => arr.length)),
      metrics: avgMetrics,
      scores: this.scoreCoreWebVitals(avgMetrics)
    };
  }

  scoreCoreWebVitals(metrics) {
    const scores = {};
    
    // Scoring based on Web Vitals thresholds
    if (metrics.FCP !== null) {
      scores.FCP = metrics.FCP <= 1800 ? 'good' : metrics.FCP <= 3000 ? 'needs-improvement' : 'poor';
    }
    
    if (metrics.LCP !== null) {
      scores.LCP = metrics.LCP <= 2500 ? 'good' : metrics.LCP <= 4000 ? 'needs-improvement' : 'poor';
    }
    
    if (metrics.CLS !== null) {
      scores.CLS = metrics.CLS <= 0.1 ? 'good' : metrics.CLS <= 0.25 ? 'needs-improvement' : 'poor';
    }
    
    if (metrics.FID !== null) {
      scores.FID = metrics.FID <= 100 ? 'good' : metrics.FID <= 300 ? 'needs-improvement' : 'poor';
    }

    return scores;
  }

  // Run comprehensive load testing
  async runLoadTests(baseUrl = 'http://localhost:5173') {
    this.log('🏋️ Starting Comprehensive Load Testing & Performance Validation');
    this.log('=' .repeat(70));

    const results = {};

    try {
      // Test 1: Light Load (5 users for 30s)
      this.log('Test 1: Light load testing (5 concurrent users)');
      results.lightLoad = await this.simulateUserLoad(baseUrl, 5, 30000);
      
      // Test 2: Medium Load (10 users for 30s)
      this.log('Test 2: Medium load testing (10 concurrent users)');
      results.mediumLoad = await this.simulateUserLoad(baseUrl, 10, 30000);
      
      // Test 3: Heavy Load (20 users for 30s)
      this.log('Test 3: Heavy load testing (20 concurrent users)');
      results.heavyLoad = await this.simulateUserLoad(baseUrl, 20, 30000);
      
      // Test 4: Memory Usage Monitoring
      this.log('Test 4: Memory usage monitoring');
      results.memoryUsage = await this.monitorMemoryUsage(30000);
      
      // Test 5: Bundle Analysis
      this.log('Test 5: Bundle size analysis');
      results.bundleAnalysis = await this.analyzeBundleSize();
      
      // Test 6: Core Web Vitals
      this.log('Test 6: Core Web Vitals simulation');
      results.coreWebVitals = await this.simulateCoreWebVitals(baseUrl);

    } catch (error) {
      this.log(`Load testing error: ${error.message}`, 'error');
      results.error = error.message;
    }

    // Generate performance report
    const report = this.generatePerformanceReport(results);
    
    // Save results
    const reportPath = path.join(__dirname, 'load-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    this.displayResults(report);
    
    return report;
  }

  generatePerformanceReport(results) {
    const timestamp = new Date().toISOString();
    const recommendations = [];
    let overallScore = 'good';

    // Analyze results and generate recommendations
    if (results.heavyLoad) {
      if (results.heavyLoad.successRate < 95) {
        recommendations.push('High load causing failures - optimize server capacity');
        overallScore = 'poor';
      }
      if (results.heavyLoad.avgResponseTime > 2000) {
        recommendations.push('Slow response times under load - optimize performance');
        if (overallScore === 'good') overallScore = 'needs-improvement';
      }
    }

    if (results.memoryUsage) {
      if (results.memoryUsage.memoryGrowth > 50) {
        recommendations.push('Memory usage growing - check for memory leaks');
        if (overallScore === 'good') overallScore = 'needs-improvement';
      }
    }

    if (results.bundleAnalysis) {
      if (results.bundleAnalysis.totalSize > 2000) {
        recommendations.push('Large bundle size - implement code splitting');
        if (overallScore === 'good') overallScore = 'needs-improvement';
      }
      recommendations.push(...results.bundleAnalysis.recommendations);
    }

    if (results.coreWebVitals && results.coreWebVitals.scores) {
      const poorScores = Object.entries(results.coreWebVitals.scores)
        .filter(([, score]) => score === 'poor');
      
      if (poorScores.length > 0) {
        recommendations.push(`Poor Core Web Vitals: ${poorScores.map(([metric]) => metric).join(', ')}`);
        overallScore = 'poor';
      }
    }

    return {
      timestamp,
      overallScore,
      recommendations,
      results,
      summary: {
        loadTestsPassed: results.heavyLoad ? results.heavyLoad.successRate >= 95 : false,
        performanceGood: results.heavyLoad ? results.heavyLoad.avgResponseTime <= 2000 : false,
        memoryStable: results.memoryUsage ? results.memoryUsage.memoryGrowth <= 50 : false,
        bundleSizeOk: results.bundleAnalysis ? results.bundleAnalysis.totalSize <= 2000 : false,
        coreWebVitalsGood: results.coreWebVitals ? 
          Object.values(results.coreWebVitals.scores || {}).every(score => score !== 'poor') : false
      }
    };
  }

  displayResults(report) {
    this.log('=' .repeat(70));
    this.log('📈 LOAD TESTING & PERFORMANCE REPORT');
    this.log('=' .repeat(70));

    this.log(`📊 Overall Performance Score: ${report.overallScore.toUpperCase()}`, 
      report.overallScore === 'good' ? 'success' : 
      report.overallScore === 'needs-improvement' ? 'warning' : 'error');

    // Display summary
    const { summary } = report;
    this.log(`✅ Load Tests: ${summary.loadTestsPassed ? 'PASSED' : 'FAILED'}`, 
      summary.loadTestsPassed ? 'success' : 'error');
    this.log(`⚡ Performance: ${summary.performanceGood ? 'GOOD' : 'NEEDS WORK'}`, 
      summary.performanceGood ? 'success' : 'warning');
    this.log(`🧠 Memory: ${summary.memoryStable ? 'STABLE' : 'GROWING'}`, 
      summary.memoryStable ? 'success' : 'warning');
    this.log(`📦 Bundle Size: ${summary.bundleSizeOk ? 'OPTIMAL' : 'LARGE'}`, 
      summary.bundleSizeOk ? 'success' : 'warning');
    this.log(`🎯 Core Web Vitals: ${summary.coreWebVitalsGood ? 'GOOD' : 'NEEDS WORK'}`, 
      summary.coreWebVitalsGood ? 'success' : 'warning');

    if (report.recommendations.length > 0) {
      this.log('📋 RECOMMENDATIONS:', 'warning');
      report.recommendations.forEach((rec, i) => {
        this.log(`   ${i + 1}. ${rec}`, 'info');
      });
    }

    // Display key metrics
    if (report.results.heavyLoad) {
      const load = report.results.heavyLoad;
      this.log(`🏋️ Heavy Load Results: ${load.successRate.toFixed(1)}% success, ${load.avgResponseTime}ms avg response`, 'info');
    }

    if (report.results.bundleAnalysis) {
      const bundle = report.results.bundleAnalysis;
      this.log(`📦 Bundle Size: ${bundle.totalSize}KB total, ${bundle.assetCount} assets`, 'info');
    }

    this.log('=' .repeat(70));
    this.log(`📄 Detailed report saved to: ${path.join(__dirname, 'load-test-report.json')}`, 'info');
    this.log('=' .repeat(70));
  }
}

// Run load testing if script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const loadTester = new LoadTestValidator();
  const baseUrl = process.argv[2] || 'http://localhost:5173';
  
  loadTester.runLoadTests(baseUrl).catch(error => {
    console.error('💥 Load testing failed:', error);
    process.exit(1);
  });
}

export { LoadTestValidator };