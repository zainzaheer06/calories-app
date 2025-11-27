import requests

url = "https://overapt-unpumped-franklin.ngrok-free.dev/api/auth/login"

headers = {
    'ngrok-skip-browser-warning': 'true',
    'User-Agent': 'CalorieApp/1.0',
    'Content-Type': 'application/json'
}

data = {
    "email": "test@test.com",
    "password": "Test123!"
}

print(f"Testing ngrok login: {url}")
print("="*50)

try:
    response = requests.post(url, json=data, headers=headers, timeout=10)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
