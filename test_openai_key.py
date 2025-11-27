"""
Test OpenAI API Key
Quick script to verify if your OpenAI API key is valid
"""

import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

print("="*60)
print("  OPENAI API KEY TEST")
print("="*60)

# Check if key exists
if not OPENAI_API_KEY:
    print("❌ ERROR: OPENAI_API_KEY not found in .env file")
    print("\nPlease add your OpenAI API key to .env file:")
    print("OPENAI_API_KEY=sk-proj-your-key-here")
    exit(1)

print(f"✅ API Key found: {OPENAI_API_KEY[:20]}...{OPENAI_API_KEY[-10:]}")
print(f"   Length: {len(OPENAI_API_KEY)} characters")

# Test API key with a simple request
print("\n🔍 Testing API key with OpenAI...")

try:
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "user", "content": "Say 'API key is valid' if you can read this."}
        ],
        "max_tokens": 20
    }
    
    response = requests.post(
        "https://api.openai.com/v1/chat/completions",
        headers=headers,
        json=payload,
        timeout=10
    )
    
    print(f"Response Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        message = result['choices'][0]['message']['content']
        print(f"\n✅ SUCCESS! API Key is valid!")
        print(f"Response: {message}")
        print("\n🎉 Your OpenAI API key is working correctly!")
        
    elif response.status_code == 401:
        print(f"\n❌ ERROR: Invalid API Key")
        print("Your API key is incorrect or has been revoked.")
        print("\nPlease:")
        print("1. Go to https://platform.openai.com/api-keys")
        print("2. Create a new API key")
        print("3. Update your .env file with the new key")
        
    elif response.status_code == 429:
        print(f"\n⚠️  WARNING: Rate limit exceeded or quota exceeded")
        print("Your API key is valid but:")
        print("- You may have exceeded your rate limit")
        print("- Your account may be out of credits")
        print("\nCheck your usage at: https://platform.openai.com/usage")
        
    elif response.status_code == 403:
        print(f"\n❌ ERROR: Access forbidden")
        print("Your API key doesn't have permission to use this model.")
        print("Make sure you have access to gpt-4o-mini model.")
        
    else:
        print(f"\n❌ ERROR: Unexpected response")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
except requests.exceptions.Timeout:
    print("\n❌ ERROR: Request timed out")
    print("Check your internet connection.")
    
except requests.exceptions.ConnectionError:
    print("\n❌ ERROR: Connection failed")
    print("Check your internet connection.")
    
except Exception as e:
    print(f"\n❌ ERROR: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "="*60)
