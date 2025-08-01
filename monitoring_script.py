#!/usr/bin/env python3
"""
BLKOUT Website - Automated Monitoring Script
Continuously monitors system health and performance
"""

import requests
import time
import json
import subprocess
import psutil
from datetime import datetime
import os

class BlkoutMonitor:
    def __init__(self):
        self.ivor_url = "http://localhost:8000"
        self.website_url = "http://localhost:4173"
        self.log_file = "monitoring.log"
        self.alert_thresholds = {
            'response_time_warning': 1.0,  # seconds
            'response_time_critical': 3.0,  # seconds
            'memory_warning': 200,  # MB
            'cpu_critical': 80  # percentage
        }
    
    def log_event(self, level, message):
        """Log monitoring events with timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {level}: {message}"
        print(log_entry)
        
        with open(self.log_file, 'a') as f:
            f.write(log_entry + "\n")
    
    def check_ivor_health(self):
        """Monitor IVOR backend health and performance"""
        try:
            start_time = time.time()
            response = requests.get(f"{self.ivor_url}/health/", timeout=5)
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response time thresholds
                if response_time > self.alert_thresholds['response_time_critical']:
                    self.log_event("CRITICAL", f"IVOR response time: {response_time:.3f}s (Critical threshold exceeded)")
                    return False
                elif response_time > self.alert_thresholds['response_time_warning']:
                    self.log_event("WARNING", f"IVOR response time: {response_time:.3f}s (Warning threshold exceeded)")
                else:
                    self.log_event("INFO", f"IVOR health check: OK ({response_time:.3f}s)")
                
                # Check service features
                features = data.get('features', {})
                if not all(features.values()):
                    self.log_event("WARNING", f"Some IVOR features disabled: {features}")
                
                return True
            else:
                self.log_event("ERROR", f"IVOR health check failed: HTTP {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_event("CRITICAL", f"IVOR backend unreachable: {e}")
            return False
    
    def check_ivor_chat(self):
        """Test IVOR chat functionality"""
        try:
            test_message = {
                "message": "Monitoring test - please respond briefly",
                "context": "automated_monitoring"
            }
            
            start_time = time.time()
            response = requests.post(
                f"{self.ivor_url}/chat/message", 
                json=test_message, 
                timeout=10
            )
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'success' and data.get('response'):
                    self.log_event("INFO", f"IVOR chat test: OK ({response_time:.3f}s)")
                    return True
                else:
                    self.log_event("WARNING", f"IVOR chat response incomplete: {data}")
                    return False
            else:
                self.log_event("ERROR", f"IVOR chat test failed: HTTP {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_event("ERROR", f"IVOR chat test error: {e}")
            return False
    
    def check_website_frontend(self):
        """Monitor website frontend accessibility"""
        try:
            start_time = time.time()
            response = requests.get(self.website_url, timeout=5)
            response_time = time.time() - start_time
            
            if response.status_code == 200:
                # Check if it's actually the HTML page
                if "<!DOCTYPE html>" in response.text and "BLKOUTUK" in response.text:
                    self.log_event("INFO", f"Website frontend: OK ({response_time:.3f}s)")
                    return True
                else:
                    self.log_event("WARNING", "Website frontend returns unexpected content")
                    return False
            else:
                self.log_event("ERROR", f"Website frontend failed: HTTP {response.status_code}")
                return False
                
        except requests.exceptions.RequestException as e:
            self.log_event("ERROR", f"Website frontend unreachable: {e}")
            return False
    
    def check_system_resources(self):
        """Monitor system resource usage"""
        try:
            # Check for IVOR process
            ivor_process = None
            for proc in psutil.process_iter(['pid', 'name', 'cmdline', 'memory_info', 'cpu_percent']):
                try:
                    if 'main_working.py' in ' '.join(proc.info['cmdline'] or []):
                        ivor_process = proc
                        break
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            if ivor_process:
                memory_mb = ivor_process.info['memory_info'].rss / 1024 / 1024
                cpu_percent = ivor_process.info['cpu_percent'] or 0
                
                # Check thresholds
                if memory_mb > self.alert_thresholds['memory_warning']:
                    self.log_event("WARNING", f"IVOR memory usage: {memory_mb:.1f}MB (High)")
                
                if cpu_percent > self.alert_thresholds['cpu_critical']:
                    self.log_event("CRITICAL", f"IVOR CPU usage: {cpu_percent:.1f}% (Critical)")
                
                self.log_event("INFO", f"IVOR resources: {memory_mb:.1f}MB RAM, {cpu_percent:.1f}% CPU")
                return True
            else:
                self.log_event("CRITICAL", "IVOR process not found!")
                return False
                
        except Exception as e:
            self.log_event("ERROR", f"Resource monitoring error: {e}")
            return False
    
    def run_full_health_check(self):
        """Run comprehensive system health check"""
        self.log_event("INFO", "=== Starting Full Health Check ===")
        
        results = {
            'ivor_health': self.check_ivor_health(),
            'ivor_chat': self.check_ivor_chat(),
            'website_frontend': self.check_website_frontend(),
            'system_resources': self.check_system_resources()
        }
        
        # Overall system status
        critical_failures = [k for k, v in results.items() if not v and k in ['ivor_health', 'system_resources']]
        warnings = [k for k, v in results.items() if not v and k not in critical_failures]
        
        if critical_failures:
            self.log_event("CRITICAL", f"System has critical failures: {critical_failures}")
            return "CRITICAL"
        elif warnings:
            self.log_event("WARNING", f"System has warnings: {warnings}")
            return "WARNING"
        else:
            self.log_event("INFO", "All systems operational")
            return "HEALTHY"
    
    def continuous_monitoring(self, check_interval=30):
        """Run continuous monitoring loop"""
        self.log_event("INFO", f"Starting continuous monitoring (interval: {check_interval}s)")
        
        try:
            while True:
                status = self.run_full_health_check()
                
                # If critical issues, check more frequently
                if status == "CRITICAL":
                    time.sleep(10)  # Check every 10 seconds during critical issues
                else:
                    time.sleep(check_interval)
                    
        except KeyboardInterrupt:
            self.log_event("INFO", "Monitoring stopped by user")
        except Exception as e:
            self.log_event("ERROR", f"Monitoring error: {e}")

if __name__ == "__main__":
    monitor = BlkoutMonitor()
    
    # Run initial health check
    initial_status = monitor.run_full_health_check()
    
    # If everything is healthy, start continuous monitoring
    if initial_status in ["HEALTHY", "WARNING"]:
        print("\n🚀 Starting continuous monitoring...")
        print("Press Ctrl+C to stop monitoring\n")
        monitor.continuous_monitoring()
    else:
        print(f"\n❌ Initial health check failed with status: {initial_status}")
        print("Please resolve critical issues before starting continuous monitoring")
        exit(1)