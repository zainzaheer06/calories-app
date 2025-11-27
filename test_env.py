from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv('OPENAI_API_KEY')
print(f"API Key loaded: {bool(api_key)}")
if api_key:
    print(f"API Key (first 20 chars): {api_key[:20]}...")
else:
    print("API Key is None or empty")
