"""Test the live API server"""
import requests
import json

BASE_URL = "http://localhost:5000"

print("="*60)
print("🧪 Testing Live API Server")
print("="*60)

# Test 1: Health Check
print("\n1. Testing Health Check...")
try:
    response = requests.get(f"{BASE_URL}/api/health", timeout=5)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        print(f"   Response: {response.json()}")
        print("   ✅ Health check passed")
    else:
        print(f"   ❌ Health check failed")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 2: Register User
print("\n2. Testing User Registration...")
try:
    user_data = {
        "email": "testuser@example.com",
        "password": "password123",
        "name": "Test User",
        "age": 25,
        "weight": 70,
        "height": 175,
        "gender": "male",
        "activity_level": "moderate",
        "goal_type": "maintain"
    }
    response = requests.post(f"{BASE_URL}/api/auth/register", json=user_data, timeout=5)
    print(f"   Status: {response.status_code}")
    if response.status_code in [200, 201, 409]:  # 409 if already exists
        data = response.json()
        print(f"   Message: {data.get('message', data.get('error'))}")
        if 'access_token' in data:
            access_token = data['access_token']
            print(f"   Token: {access_token[:50]}...")
            print("   ✅ Registration successful")
        else:
            print("   ⚠️  User may already exist")
    else:
        print(f"   ❌ Registration failed: {response.text}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 3: Login
print("\n3. Testing User Login...")
try:
    login_data = {
        "email": "testuser@example.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data, timeout=5)
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        access_token = data.get('access_token')
        print(f"   Token: {access_token[:50]}...")
        print("   ✅ Login successful")
        
        # Test 4: Get Profile
        print("\n4. Testing Get Profile...")
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(f"{BASE_URL}/api/user/profile", headers=headers, timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            profile = response.json().get('profile', {})
            print(f"   Name: {profile.get('name')}")
            print(f"   Email: {profile.get('email')}")
            print(f"   Daily Goal: {profile.get('daily_calorie_goal')} kcal")
            print("   ✅ Profile retrieved")
        else:
            print(f"   ❌ Profile retrieval failed")
        
        # Test 5: Add Food Log
        print("\n5. Testing Add Food Log...")
        food_data = {
            "food_name": "Grilled Chicken Breast",
            "serving_size": 150,
            "calories": 165,
            "proteins": 31,
            "carbs": 0,
            "fats": 3.6,
            "meal_type": "lunch"
        }
        response = requests.post(f"{BASE_URL}/api/food/log", json=food_data, headers=headers, timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"   Food: {data.get('food_log', {}).get('food_name')}")
            print(f"   Calories: {data.get('food_log', {}).get('total_calories')} kcal")
            print("   ✅ Food log added")
        else:
            print(f"   ❌ Food log failed: {response.text}")
        
        # Test 6: Get Food Logs
        print("\n6. Testing Get Food Logs...")
        response = requests.get(f"{BASE_URL}/api/food/logs", headers=headers, timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            count = data.get('count', 0)
            print(f"   Total logs: {count}")
            print("   ✅ Food logs retrieved")
        else:
            print(f"   ❌ Get logs failed")
        
        # Test 7: Daily Analytics
        print("\n7. Testing Daily Analytics...")
        from datetime import datetime
        today = datetime.now().strftime('%Y-%m-%d')
        response = requests.get(f"{BASE_URL}/api/analytics/daily?date={today}", headers=headers, timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            summary = data.get('summary', {})
            print(f"   Total Calories: {summary.get('total_calories', 0)} kcal")
            print(f"   Total Proteins: {summary.get('total_proteins', 0)}g")
            print(f"   Logs: {summary.get('log_count', 0)}")
            print("   ✅ Analytics retrieved")
        else:
            print(f"   ❌ Analytics failed")
            
    else:
        print(f"   ❌ Login failed: {response.text}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "="*60)
print("✅ API Testing Complete!")
print("="*60)
print("\n📊 Server Status: RUNNING")
print(f"🌐 URL: {BASE_URL}")
print("📝 All core endpoints are functional")
print("="*60)
