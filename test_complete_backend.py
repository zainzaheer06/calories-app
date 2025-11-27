"""
Complete Backend Test Script
Tests all major endpoints to ensure everything is working
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000/api"
TEST_USER = {
    "email": "test@example.com",
    "password": "Test123!@#",
    "name": "Test User",
    "age": 25,
    "weight": 70,
    "height": 175,
    "gender": "male",
    "activity_level": "moderate",
    "goal_type": "maintain"
}

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_health():
    """Test health endpoint"""
    print_section("Testing Health Endpoint")
    try:
        response = requests.get(f"{BASE_URL.replace('/api', '')}/api/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_register():
    """Test user registration"""
    print_section("Testing User Registration")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=TEST_USER,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        if response.status_code in [201, 409]:  # 409 if user already exists
            print(f"✅ Registration successful or user exists")
            if 'access_token' in data:
                return data['access_token']
            return None
        else:
            print(f"❌ Registration failed: {data}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_login():
    """Test user login"""
    print_section("Testing User Login")
    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={
                "email": TEST_USER["email"],
                "password": TEST_USER["password"]
            },
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"✅ Login successful")
            print(f"User: {data.get('user', {}).get('name')}")
            return data.get('access_token')
        else:
            print(f"❌ Login failed: {data}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_profile(token):
    """Test get profile"""
    print_section("Testing Get Profile")
    try:
        response = requests.get(
            f"{BASE_URL}/auth/profile",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"✅ Profile retrieved")
            profile = data.get('profile', {})
            print(f"Name: {profile.get('name')}")
            print(f"Email: {profile.get('email')}")
            print(f"Daily Goal: {profile.get('daily_calorie_goal')} cal")
            return True
        else:
            print(f"❌ Failed: {data}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_add_food(token):
    """Test adding food log"""
    print_section("Testing Add Food Log")
    try:
        food_data = {
            "food_name": "Test Chicken Breast",
            "serving_size": 150,
            "servings_consumed": 1.0,
            "calories": 165,
            "proteins": 31,
            "carbs": 0,
            "fats": 3.6,
            "meal_type": "lunch",
            "consumed_at": datetime.now().isoformat()
        }
        
        response = requests.post(
            f"{BASE_URL}/food/log",
            json=food_data,
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        if response.status_code == 201:
            print(f"✅ Food logged successfully")
            print(f"Food: {data.get('food_log', {}).get('food_name')}")
            return data.get('food_log', {}).get('id')
        else:
            print(f"❌ Failed: {data}")
            return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_get_food_logs(token):
    """Test getting food logs"""
    print_section("Testing Get Food Logs")
    try:
        today = datetime.now().strftime('%Y-%m-%d')
        response = requests.get(
            f"{BASE_URL}/food/logs",
            params={"date": today, "limit": 100},
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            logs = data.get('food_logs', [])
            print(f"✅ Retrieved {len(logs)} food logs")
            if logs:
                print(f"Latest: {logs[0].get('food_name')} - {logs[0].get('total_calories')} cal")
            return True
        else:
            print(f"❌ Failed: {data}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_daily_analytics(token):
    """Test daily analytics"""
    print_section("Testing Daily Analytics")
    try:
        today = datetime.now().strftime('%Y-%m-%d')
        response = requests.get(
            f"{BASE_URL}/analytics/daily/{today}",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            totals = data.get('totals', {})
            print(f"✅ Daily analytics retrieved")
            print(f"Calories: {totals.get('calories', 0)} cal")
            print(f"Protein: {totals.get('proteins', 0)}g")
            print(f"Carbs: {totals.get('carbs', 0)}g")
            print(f"Fats: {totals.get('fats', 0)}g")
            return True
        else:
            print(f"❌ Failed: {data}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_weekly_analytics(token):
    """Test weekly analytics"""
    print_section("Testing Weekly Analytics")
    try:
        response = requests.get(
            f"{BASE_URL}/analytics/weekly",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"✅ Weekly analytics retrieved")
            print(f"Total Calories: {data.get('weekly_totals', {}).get('calories', 0)} cal")
            print(f"Avg Daily: {data.get('weekly_averages', {}).get('avg_calories', 0)} cal")
            print(f"Days Logged: {data.get('days_logged', 0)}")
            return True
        else:
            print(f"❌ Failed: {data}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("\n" + "🚀 "*20)
    print("  COMPLETE BACKEND TEST SUITE")
    print("🚀 "*20)
    
    # Test health
    if not test_health():
        print("\n❌ Backend is not running! Start it with: python run.py")
        return
    
    # Register or get existing user
    token = test_register()
    
    # Login to get token
    if not token:
        token = test_login()
    
    if not token:
        print("\n❌ Could not authenticate. Tests stopped.")
        return
    
    print(f"\n🔑 Token obtained: {token[:20]}...")
    
    # Run authenticated tests
    results = {
        "Profile": test_profile(token),
        "Add Food": test_add_food(token) is not None,
        "Get Food Logs": test_get_food_logs(token),
        "Daily Analytics": test_daily_analytics(token),
        "Weekly Analytics": test_weekly_analytics(token),
    }
    
    # Summary
    print_section("TEST SUMMARY")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print(f"\n📊 Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Backend is fully functional!")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check the output above.")

if __name__ == "__main__":
    main()
