from dotenv import load_dotenv
import os
import requests

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')

print("="*60)
print("Testing OpenAI API Key")
print("="*60)
print(f"API Key loaded: {bool(api_key)}")
print(f"API Key length: {len(api_key) if api_key else 0}")
print(f"API Key starts with: {api_key[:15] if api_key else 'None'}...")
print("="*60)

if not api_key:
    print("❌ No API key found!")
    exit(1)

# Test the API key with a simple request
print("\n🧪 Testing API key with OpenAI...")

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

payload = {
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Say 'API key works!'"}],
    "max_tokens": 10
}

try:
    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=10
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        message = result['choices'][0]['message']['content']
        print(f"✅ API Key is VALID!")
        print(f"Response: {message}")
    else:
        print(f"❌ API Key test failed!")
        print(f"Error: {response.text}")
        
except Exception as e:
    print(f"❌ Error testing API: {e}")

print("="*60)
