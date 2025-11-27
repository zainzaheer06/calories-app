"""Test if all modules can be imported"""
import sys

print("Testing imports...\n")

# Test 1: Config
try:
    from config import Config
    print("✅ Config imported")
except Exception as e:
    print(f"❌ Config failed: {e}")
    sys.exit(1)

# Test 2: Models
try:
    from models.user import User
    from models.food_log import FoodLog
    from models.custom_food import CustomFood
    print("✅ Models imported")
except Exception as e:
    print(f"❌ Models failed: {e}")
    sys.exit(1)

# Test 3: Services
try:
    from services.openai_service import analyze_food_image
    from services.nutrition_service import calculate_daily_summary
    from services.auth_service import authenticate_user
    print("✅ Services imported")
except Exception as e:
    print(f"❌ Services failed: {e}")
    sys.exit(1)

# Test 4: Utils
try:
    from utils.helpers import allowed_file
    from utils.validators import validate_email
    print("✅ Utils imported")
except Exception as e:
    print(f"❌ Utils failed: {e}")
    sys.exit(1)

# Test 5: Routes
try:
    from app import create_app
    print("✅ App imported")
    
    app = create_app()
    print("✅ App created")
    
    # List all routes
    print("\nRegistered routes:")
    for rule in app.url_map.iter_rules():
        print(f"  {rule.methods} {rule.rule}")
    
except Exception as e:
    print(f"❌ App creation failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("\n✅ All imports successful!")
