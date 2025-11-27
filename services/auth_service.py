from flask_jwt_extended import create_access_token, decode_token, get_jwt_identity
from datetime import timedelta
from models.user import User

def generate_token(user_id, expires_delta=None):
    """Generate JWT access token for user"""
    if expires_delta is None:
        expires_delta = timedelta(days=30)
    
    access_token = create_access_token(
        identity=user_id,
        expires_delta=expires_delta
    )
    return access_token

def verify_token(token):
    """Verify JWT token and return user_id"""
    try:
        decoded = decode_token(token)
        return decoded['sub']
    except Exception:
        return None

def authenticate_user(email, password):
    """Authenticate user with email and password"""
    user = User.query.filter_by(email=email).first()
    
    if not user or not user.check_password(password):
        return None
    
    return user

def get_user_by_id(user_id):
    """Get user by ID"""
    return User.query.get(user_id)

def get_current_user_id():
    """Get current authenticated user ID from JWT token"""
    user_id = get_jwt_identity()
    # Convert string back to integer
    return int(user_id) if user_id else None
