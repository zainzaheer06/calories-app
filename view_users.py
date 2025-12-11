"""
View all registered users in the database
"""
from flask import Flask
from database import db
from models.user import User
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

with app.app_context():
    users = User.query.all()
    
    print("\n" + "="*60)
    print("📊 REGISTERED USERS")
    print("="*60 + "\n")
    
    if not users:
        print("No users found in database.")
    else:
        for user in users:
            print(f"ID: {user.id}")
            print(f"Name: {user.name}")
            print(f"Email: {user.email}")
            print(f"Age: {user.age}")
            print(f"Weight: {user.weight} kg")
            print(f"Height: {user.height} cm")
            print(f"Gender: {user.gender}")
            print(f"Goal: {user.goal_type}")
            print(f"Daily Calorie Goal: {user.daily_calorie_goal}")
            print(f"Registered: {user.created_at}")
            print("-" * 60)
    
    print(f"\nTotal Users: {len(users)}\n")
