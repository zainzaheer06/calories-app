#!/usr/bin/env python3
"""
Run script for the Calorie Detection Flask Backend
"""

import os
from dotenv import load_dotenv
from app import create_app

# Load environment variables from .env file
load_dotenv()

# Create Flask application
app = create_app()

if __name__ == '__main__':
    # Get configuration from environment variables
    debug = os.environ.get('FLASK_ENV') == 'development'
    host = os.environ.get('FLASK_HOST', '0.0.0.0')
    port = int(os.environ.get('FLASK_PORT', 5000))
    
    print("🚀 Starting Calorie Detection API")
    print(f"📡 Server running on http://{host}:{port}")
    print(f"🔧 Debug mode: {debug}")
    print("📚 Available endpoints:")
    print("   - POST /api/auth/register - User registration")
    print("   - POST /api/auth/login - User login")
    print("   - GET  /api/auth/profile - Get user profile")
    print("   - POST /api/food/analyze-image - Analyze food image")
    print("   - GET  /api/food/search - Search food by name")
    print("   - POST /api/food/log - Log consumed food")
    print("   - GET  /api/food/logs - Get food logs")
    print("   - GET  /api/analytics/daily/<date> - Daily analytics")
    print("   - GET  /api/analytics/weekly - Weekly analytics")
    print("   - GET  /api/analytics/summary - User summary")
    print("   - GET  /api/health - Health check")
    print("\n" + "="*50)
    
    app.run(
        host=host,
        port=port,
        debug=debug,
        threaded=True
    )