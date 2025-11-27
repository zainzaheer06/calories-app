import requests
import json

url = "https://overapt-unpumped-franklin.ngrok-free.dev/api/auth/login"

headers = {
    'ngrok-skip-browser-warning': 'true',
    'Content-Type': 'application/json'
}

# Test with invalid credentials
data = {
    "email": "test@test.com",
    "password": "test123"
}

print(f"Testing login: {url}")
print(f"Data: {json.dumps(data, indent=2)}")

try:
    response = requests.post(url, json=data, headers=headers, timeout=10)
    print(f"\nStatus: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"\nError: {e}")
