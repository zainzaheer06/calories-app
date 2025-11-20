import re
from email_validator import validate_email as email_validate, EmailNotValidError

def validate_email(email):
    """Validate email format"""
    try:
        email_validate(email)
        return True
    except EmailNotValidError:
        return False

def validate_password(password):
    """
    Validate password strength
    Requirements:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter  
    - At least one digit
    """
    if len(password) < 8:
        return {
            'valid': False,
            'message': 'Password must be at least 8 characters long'
        }
    
    if not re.search(r'[A-Z]', password):
        return {
            'valid': False,
            'message': 'Password must contain at least one uppercase letter'
        }
    
    if not re.search(r'[a-z]', password):
        return {
            'valid': False,
            'message': 'Password must contain at least one lowercase letter'
        }
    
    if not re.search(r'\d', password):
        return {
            'valid': False,
            'message': 'Password must contain at least one digit'
        }
    
    return {
        'valid': True,
        'message': 'Password is valid'
    }

def validate_nutritional_data(data):
    """Validate nutritional data input"""
    errors = []
    
    # Check for required fields
    required_fields = ['calories']
    for field in required_fields:
        if field not in data or data[field] is None:
            errors.append(f'{field} is required')
    
    # Validate numeric fields
    numeric_fields = [
        'calories', 'proteins', 'carbs', 'fats', 
        'fiber', 'sodium', 'sugars', 'serving_size'
    ]
    
    for field in numeric_fields:
        if field in data and data[field] is not None:
            try:
                value = float(data[field])
                if value < 0:
                    errors.append(f'{field} cannot be negative')
            except (ValueError, TypeError):
                errors.append(f'{field} must be a valid number')
    
    # Validate serving size
    if 'serving_size' in data and data['serving_size'] is not None:
        try:
            serving_size = float(data['serving_size'])
            if serving_size <= 0:
                errors.append('Serving size must be greater than 0')
            elif serving_size > 10000:  # 10kg seems reasonable as max
                errors.append('Serving size seems unusually large')
        except (ValueError, TypeError):
            errors.append('Serving size must be a valid number')
    
    # Validate calorie reasonableness
    if 'calories' in data and data['calories'] is not None:
        try:
            calories = float(data['calories'])
            if calories > 10000:  # Per serving
                errors.append('Calories seem unusually high')
        except (ValueError, TypeError):
            pass  # Already handled above
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }

def validate_user_profile(data):
    """Validate user profile data"""
    errors = []
    
    # Age validation
    if 'age' in data and data['age'] is not None:
        try:
            age = int(data['age'])
            if age < 13 or age > 120:
                errors.append('Age must be between 13 and 120')
        except (ValueError, TypeError):
            errors.append('Age must be a valid number')
    
    # Weight validation (in kg)
    if 'weight' in data and data['weight'] is not None:
        try:
            weight = float(data['weight'])
            if weight < 20 or weight > 500:
                errors.append('Weight must be between 20 and 500 kg')
        except (ValueError, TypeError):
            errors.append('Weight must be a valid number')
    
    # Height validation (in cm)
    if 'height' in data and data['height'] is not None:
        try:
            height = float(data['height'])
            if height < 100 or height > 250:
                errors.append('Height must be between 100 and 250 cm')
        except (ValueError, TypeError):
            errors.append('Height must be a valid number')
    
    # Gender validation
    if 'gender' in data and data['gender'] is not None:
        if data['gender'].lower() not in ['male', 'female']:
            errors.append('Gender must be either "male" or "female"')
    
    # Activity level validation
    if 'activity_level' in data and data['activity_level'] is not None:
        valid_levels = ['sedentary', 'light', 'moderate', 'very_active', 'extra_active']
        if data['activity_level'] not in valid_levels:
            errors.append(f'Activity level must be one of: {", ".join(valid_levels)}')
    
    # Goal type validation
    if 'goal_type' in data and data['goal_type'] is not None:
        valid_goals = ['lose_weight', 'maintain', 'gain_weight']
        if data['goal_type'] not in valid_goals:
            errors.append(f'Goal type must be one of: {", ".join(valid_goals)}')
    
    # Daily calorie goal validation
    if 'daily_calorie_goal' in data and data['daily_calorie_goal'] is not None:
        try:
            calorie_goal = int(data['daily_calorie_goal'])
            if calorie_goal < 800 or calorie_goal > 5000:
                errors.append('Daily calorie goal must be between 800 and 5000')
        except (ValueError, TypeError):
            errors.append('Daily calorie goal must be a valid number')
    
    return {
        'valid': len(errors) == 0,
        'errors': errors
    }