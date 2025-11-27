import requests
import json

# Test connection to Flask backend
BASE_URL = "http://192.168.100.48:5000"

print("Testing Flask backend connection...")
print(f"Base URL: {BASE_URL}")
print("-" * 50)

# Test 1: Health check
try:
    print("\n1. Testing health endpoint...")
    response = requests.get(f"{BASE_URL}/api/health", timeout=5)
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   Error: {e}")

# Test 2: Try to login with test credentials
try:
    print("\n2. Testing login endpoint...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "test@test.com", "password": "test123"},
        timeout=5
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   Error: {e}")

# Test 3: Try to register
try:
    print("\n3. Testing register endpoint...")
    response = requests.post(
        f"{BASE_URL}/api/auth/register",
        json={
            "email": "testuser@example.com",
            "password": "Test123!@#",
            "name": "Test User"
        },
        timeout=5
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   Error: {e}")

print("\n" + "-" * 50)
print("Test complete!")
