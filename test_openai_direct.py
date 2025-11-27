from dotenv import load_dotenv
load_dotenv()

from services.openai_service import OPENAI_AVAILABLE, OPENAI_API_KEY

print("="*50)
print("OpenAI Service Test")
print("="*50)
print(f"OPENAI_AVAILABLE: {OPENAI_AVAILABLE}")
print(f"API Key set: {bool(OPENAI_API_KEY)}")
if OPENAI_API_KEY:
    print(f"API Key (first 20 chars): {OPENAI_API_KEY[:20]}...")
print("="*50)

if OPENAI_AVAILABLE:
    print("✅ OpenAI is configured and ready!")
    print("The app will analyze real food images.")
else:
    print("❌ OpenAI not available")
    print("The app will return mock data.")
