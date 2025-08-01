#!/usr/bin/env python3
"""
BLKOUT Website - Simple Monitoring Script (No external dependencies)
Monitors system health using only standard library
"""

import urllib.request
import urllib.parse
import json
import time
import subprocess
from datetime import datetime

class BlkoutMonitorSimple:
    def __init__(self):
        self.ivor_url = "http://localhost:8000"
        self.website_url = "http://localhost:4173"
    
    def log_event(self, level, message):
        """Log monitoring events with timestamp"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] {level}: {message}"
        print(log_entry)
    
    def check_ivor_health(self):
        """Monitor IVOR backend health"""
        try:
            start_time = time.time()
            with urllib.request.urlopen(f"{self.ivor_url}/health/", timeout=5) as response:
                response_time = time.time() - start_time
                data = json.loads(response.read().decode())
                
                if response.status == 200:
                    self.log_event("INFO", f"✅ IVOR health: OK ({response_time:.3f}s)")
                    self.log_event("INFO", f"   Version: {data.get('version', 'unknown')}")
                    self.log_event("INFO", f"   Features: {len(data.get('features', {}))} enabled")
                    return True
                else:
                    self.log_event("ERROR", f"❌ IVOR health failed: HTTP {response.status}")
                    return False
                    
        except Exception as e:
            self.log_event("CRITICAL", f"🚨 IVOR backend unreachable: {e}")
            return False
    
    def check_ivor_chat(self):
        """Test IVOR chat functionality"""
        try:
            test_data = json.dumps({
                "message": "Health check test", 
                "context": "monitoring"
            }).encode()
            
            req = urllib.request.Request(
                f"{self.ivor_url}/chat/message",
                data=test_data,
                headers={'Content-Type': 'application/json'}
            )
            
            start_time = time.time()
            with urllib.request.urlopen(req, timeout=10) as response:
                response_time = time.time() - start_time
                data = json.loads(response.read().decode())
                
                if response.status == 200 and data.get('status') == 'success':
                    response_length = len(data.get('response', ''))
                    self.log_event("INFO", f"✅ IVOR chat: OK ({response_time:.3f}s, {response_length} chars)")
                    return True
                else:
                    self.log_event("WARNING", f"⚠️ IVOR chat response incomplete")
                    return False
                    
        except Exception as e:
            self.log_event("ERROR", f"❌ IVOR chat test failed: {e}")
            return False
    
    def check_website_frontend(self):
        """Monitor website frontend"""
        try:
            start_time = time.time()
            with urllib.request.urlopen(self.website_url, timeout=5) as response:
                response_time = time.time() - start_time
                content = response.read().decode()
                
                if response.status == 200 and "BLKOUTUK" in content:
                    self.log_event("INFO", f"✅ Website frontend: OK ({response_time:.3f}s)")
                    return True
                else:
                    self.log_event("WARNING", f"⚠️ Website content unexpected")
                    return False
                    
        except Exception as e:
            self.log_event("ERROR", f"❌ Website frontend unreachable: {e}")
            return False
    
    def check_ivor_process(self):
        """Check if IVOR process is running"""
        try:
            result = subprocess.run(['ps', 'aux'], capture_output=True, text=True)
            if 'main_working.py' in result.stdout:
                # Extract process info
                for line in result.stdout.split('\n'):
                    if 'main_working.py' in line:
                        parts = line.split()
                        if len(parts) >= 2:
                            pid = parts[1]
                            self.log_event("INFO", f"✅ IVOR process: Running (PID: {pid})")
                            return True
                        break
            
            self.log_event("CRITICAL", f"🚨 IVOR process not found!")
            return False
            
        except Exception as e:
            self.log_event("ERROR", f"❌ Process check error: {e}")
            return False
    
    def run_full_check(self):
        """Run comprehensive health check"""
        self.log_event("INFO", "🔍 === BLKOUT System Health Check ===")
        
        checks = [
            ("IVOR Process", self.check_ivor_process),
            ("IVOR Health", self.check_ivor_health),
            ("IVOR Chat", self.check_ivor_chat),
            ("Website Frontend", self.check_website_frontend)
        ]
        
        results = {}
        for name, check_func in checks:
            self.log_event("INFO", f"Checking {name}...")
            results[name] = check_func()
        
        # Summary
        passed = sum(1 for result in results.values() if result)
        total = len(results)
        
        if passed == total:
            self.log_event("INFO", f"🎉 ALL SYSTEMS OPERATIONAL ({passed}/{total})")
            return "HEALTHY"
        elif passed >= total * 0.75:  # 75% or more passing
            failed = [name for name, result in results.items() if not result]
            self.log_event("WARNING", f"⚠️ MINOR ISSUES DETECTED ({passed}/{total}) - Failed: {failed}")
            return "WARNING"
        else:
            failed = [name for name, result in results.items() if not result]
            self.log_event("CRITICAL", f"🚨 CRITICAL ISSUES DETECTED ({passed}/{total}) - Failed: {failed}")
            return "CRITICAL"

if __name__ == "__main__":
    monitor = BlkoutMonitorSimple()
    status = monitor.run_full_check()
    
    print(f"\n📊 Final Status: {status}")
    if status == "HEALTHY":
        print("🚀 System is ready for production!")
    elif status == "WARNING":
        print("⚠️ System has minor issues but is operational")
    else:
        print("🚨 System has critical issues requiring immediate attention")