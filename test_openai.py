from services.openai_service import OPENAI_AVAILABLE, client
from config import Config

print("="*50)
print("OpenAI Configuration Test")
print("="*50)
print(f"API Key set: {Config.OPENAI_API_KEY is not None}")
print(f"API Key (first 10 chars): {Config.OPENAI_API_KEY[:10] if Config.OPENAI_API_KEY else 'None'}...")
print(f"OpenAI Available: {OPENAI_AVAILABLE}")
print(f"Client initialized: {client is not None}")
print("="*50)

if client:
    print("✅ OpenAI is properly configured!")
    print("The app will now analyze real food images.")
else:
    print("❌ OpenAI client not initialized")
    print("The app will return mock data.")
