import requests

url = "https://overapt-unpumped-franklin.ngrok-free.dev/api/health"

print(f"Testing: {url}")

# Try with ngrok-skip-browser-warning header
headers = {
    'ngrok-skip-browser-warning': 'true',
    'User-Agent': 'MyApp/1.0'
}

response = requests.get(url, headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
