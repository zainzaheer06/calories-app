from app import create_app, db
from models.user import User

app = create_app()

with app.app_context():
    # Check if test user exists
    test_user = User.query.filter_by(email='test@test.com').first()
    
    if test_user:
        print("Test user already exists!")
        print(f"Email: {test_user.email}")
        print(f"Name: {test_user.name}")
    else:
        # Create test user
        test_user = User(
            email='test@test.com',
            name='Test User',
            age=25,
            weight=70,
            height=170,
            gender='male',
            activity_level='moderate',
            goal_type='maintain'
        )
        test_user.set_password('Test123!')
        
        # Calculate daily calorie goal
        test_user.daily_calorie_goal = test_user.calculate_daily_calories()
        
        db.session.add(test_user)
        db.session.commit()
        
        print("Test user created successfully!")
        print(f"Email: test@test.com")
        print(f"Password: Test123!")
        print(f"Name: {test_user.name}")
        print(f"Daily calorie goal: {test_user.daily_calorie_goal}")
