#!/usr/bin/env python3

"""
BLKOUT Website Backend Testing Suite
Tests all backend services: Events, Newsroom, Magazine, IVOR AI
"""

import requests
import sys
import json
from datetime import datetime
from typing import Dict, List, Tuple

class BLKOUTBackendTester:
    def __init__(self):
        self.base_urls = {
            'events': 'http://localhost:5000',
            'newsroom': 'http://localhost:3002', 
            'magazine': 'http://localhost:3003',
            'ivor': 'http://localhost:3001'
        }
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def log_result(self, service: str, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        
        result = f"{status} [{service}] {test_name}"
        if details:
            result += f" - {details}"
        
        print(result)
        self.results.append({
            'service': service,
            'test': test_name,
            'success': success,
            'details': details
        })
        return success

    def test_health_endpoint(self, service: str, url: str) -> bool:
        """Test health endpoint for a service"""
        try:
            response = requests.get(f"{url}/health", timeout=5)
            if response.status_code == 200:
                data = response.json()
                return self.log_result(service, "Health Check", True, f"Status: {data.get('status', 'healthy')}")
            else:
                return self.log_result(service, "Health Check", False, f"HTTP {response.status_code}")
        except requests.exceptions.RequestException as e:
            return self.log_result(service, "Health Check", False, f"Connection error: {str(e)}")

    def test_events_api(self) -> bool:
        """Test Events API endpoints"""
        service = "Events"
        url = self.base_urls['events']
        
        # Test health
        if not self.test_health_endpoint(service, url):
            return False
        
        # Test GET /api/events
        try:
            response = requests.get(f"{url}/api/events", timeout=10)
            if response.status_code == 200:
                data = response.json()
                events = data.get('events', [])
                self.log_result(service, "GET /api/events", True, f"Found {len(events)} events")
                
                # Test event structure
                if events:
                    event = events[0]
                    required_fields = ['title', 'description', 'date', 'location', 'status']
                    missing_fields = [field for field in required_fields if field not in event]
                    if not missing_fields:
                        self.log_result(service, "Event Data Structure", True, "All required fields present")
                    else:
                        self.log_result(service, "Event Data Structure", False, f"Missing fields: {missing_fields}")
                
            else:
                self.log_result(service, "GET /api/events", False, f"HTTP {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_result(service, "GET /api/events", False, f"Request error: {str(e)}")
            return False
        
        # Test GET /api/events/stats
        try:
            response = requests.get(f"{url}/api/events/stats", timeout=5)
            if response.status_code == 200:
                data = response.json()
                self.log_result(service, "GET /api/events/stats", True, f"Stats: {data}")
            else:
                self.log_result(service, "GET /api/events/stats", False, f"HTTP {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.log_result(service, "GET /api/events/stats", False, f"Request error: {str(e)}")
        
        return True

    def test_newsroom_api(self) -> bool:
        """Test Newsroom API endpoints"""
        service = "Newsroom"
        url = self.base_urls['newsroom']
        
        # Test health
        if not self.test_health_endpoint(service, url):
            return False
        
        # Test GET /api/articles
        try:
            response = requests.get(f"{url}/api/articles", timeout=10)
            if response.status_code == 200:
                data = response.json()
                articles = data.get('articles', [])
                self.log_result(service, "GET /api/articles", True, f"Found {len(articles)} articles")
                
                # Test article structure
                if articles:
                    article = articles[0]
                    required_fields = ['title', 'excerpt', 'author', 'publishedAt', 'category', 'status']
                    missing_fields = [field for field in required_fields if field not in article]
                    if not missing_fields:
                        self.log_result(service, "Article Data Structure", True, "All required fields present")
                    else:
                        self.log_result(service, "Article Data Structure", False, f"Missing fields: {missing_fields}")
                
            else:
                self.log_result(service, "GET /api/articles", False, f"HTTP {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_result(service, "GET /api/articles", False, f"Request error: {str(e)}")
            return False
        
        return True

    def test_magazine_api(self) -> bool:
        """Test Magazine API endpoints"""
        service = "Magazine"
        url = self.base_urls['magazine']
        
        # Test health
        if not self.test_health_endpoint(service, url):
            return False
        
        # Test GET /api/articles
        try:
            response = requests.get(f"{url}/api/articles", timeout=10)
            if response.status_code == 200:
                data = response.json()
                articles = data.get('articles', [])
                self.log_result(service, "GET /api/articles", True, f"Found {len(articles)} articles")
                
                # Test article structure
                if articles:
                    article = articles[0]
                    required_fields = ['title', 'excerpt', 'author', 'publishedAt', 'category']
                    missing_fields = [field for field in required_fields if field not in article]
                    if not missing_fields:
                        self.log_result(service, "Article Data Structure", True, "All required fields present")
                    else:
                        self.log_result(service, "Article Data Structure", False, f"Missing fields: {missing_fields}")
                
            else:
                self.log_result(service, "GET /api/articles", False, f"HTTP {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_result(service, "GET /api/articles", False, f"Request error: {str(e)}")
            return False
        
        return True

    def test_ivor_api(self) -> bool:
        """Test IVOR AI API endpoints"""
        service = "IVOR AI"
        url = self.base_urls['ivor']
        
        # Test health
        if not self.test_health_endpoint(service, url):
            return False
        
        # Test POST /api/chat
        try:
            chat_data = {
                "message": "Hello IVOR, this is a test message",
                "context": {
                    "pathway": "Community Healer"
                }
            }
            response = requests.post(f"{url}/api/chat", json=chat_data, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'response' in data:
                    self.log_result(service, "POST /api/chat", True, f"Response received: {len(data['response'])} chars")
                    
                    # Test pathway context integration
                    if "Community Healer" in data['response']:
                        self.log_result(service, "Pathway Context Integration", True, "Pathway context recognized")
                    else:
                        self.log_result(service, "Pathway Context Integration", False, "Pathway context not recognized")
                else:
                    self.log_result(service, "POST /api/chat", False, "Invalid response format")
                    return False
            else:
                self.log_result(service, "POST /api/chat", False, f"HTTP {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            self.log_result(service, "POST /api/chat", False, f"Request error: {str(e)}")
            return False
        
        # Test chat without context
        try:
            chat_data = {"message": "Hello IVOR"}
            response = requests.post(f"{url}/api/chat", json=chat_data, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_result(service, "Chat without context", True, "Basic chat working")
                else:
                    self.log_result(service, "Chat without context", False, "Chat failed")
            else:
                self.log_result(service, "Chat without context", False, f"HTTP {response.status_code}")
        except requests.exceptions.RequestException as e:
            self.log_result(service, "Chat without context", False, f"Request error: {str(e)}")
        
        return True

    def run_all_tests(self) -> bool:
        """Run all backend tests"""
        print("🚀 Starting BLKOUT Backend Testing Suite")
        print("=" * 60)
        
        # Test all services
        services_working = []
        
        print("\n📅 Testing Events API...")
        if self.test_events_api():
            services_working.append("Events")
        
        print("\n📰 Testing Newsroom API...")
        if self.test_newsroom_api():
            services_working.append("Newsroom")
        
        print("\n📖 Testing Magazine API...")
        if self.test_magazine_api():
            services_working.append("Magazine")
        
        print("\n🤖 Testing IVOR AI API...")
        if self.test_ivor_api():
            services_working.append("IVOR AI")
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 BACKEND TEST SUMMARY")
        print("=" * 60)
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        print(f"Services Working: {len(services_working)}/4")
        print(f"Working Services: {', '.join(services_working)}")
        
        # Print failed tests
        failed_tests = [r for r in self.results if not r['success']]
        if failed_tests:
            print(f"\n❌ Failed Tests ({len(failed_tests)}):")
            for test in failed_tests:
                print(f"  - [{test['service']}] {test['test']}: {test['details']}")
        
        return len(services_working) >= 3  # At least 3 out of 4 services should work

def main():
    """Main test execution"""
    tester = BLKOUTBackendTester()
    
    try:
        success = tester.run_all_tests()
        return 0 if success else 1
    except KeyboardInterrupt:
        print("\n\n⚠️  Testing interrupted by user")
        return 1
    except Exception as e:
        print(f"\n\n💥 Unexpected error during testing: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(main())