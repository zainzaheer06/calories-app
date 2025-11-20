import os
import uuid
from PIL import Image
from werkzeug.utils import secure_filename
from datetime import datetime
import base64
from io import BytesIO

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_IMAGE_SIZE = (1024, 1024)  # Max dimensions for processed images

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_image(image_file, user_id):
    """
    Save uploaded image file and return the file path
    """
    if not image_file or not allowed_file(image_file.filename):
        raise ValueError("Invalid image file")
    
    # Create unique filename
    filename = secure_filename(image_file.filename)
    name, ext = os.path.splitext(filename)
    unique_filename = f"{user_id}_{uuid.uuid4().hex[:8]}{ext}"
    
    # Create uploads directory if it doesn't exist
    upload_dir = os.path.join(os.getcwd(), 'uploads', 'images')
    os.makedirs(upload_dir, exist_ok=True)
    
    # Full path to save the file
    file_path = os.path.join(upload_dir, unique_filename)
    
    try:
        # Open and process image
        image = Image.open(image_file)
        
        # Convert to RGB if necessary (handles RGBA, P modes)
        if image.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            background.paste(image, mask=image.split()[-1] if 'A' in image.mode else None)
            image = background
        
        # Resize if too large
        image.thumbnail(MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)
        
        # Save optimized image
        image.save(file_path, optimize=True, quality=85)
        
        # Return relative path
        return f"uploads/images/{unique_filename}"
        
    except Exception as e:
        raise ValueError(f"Failed to process image: {str(e)}")

def image_to_base64(image_path):
    """Convert image file to base64 string"""
    try:
        with open(image_path, 'rb') as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
    except Exception as e:
        raise ValueError(f"Failed to convert image to base64: {str(e)}")

def base64_to_image(base64_string, user_id):
    """Convert base64 string to image file and save it"""
    try:
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
        # Decode base64
        image_data = base64.b64decode(base64_string)
        
        # Open image from bytes
        image = Image.open(BytesIO(image_data))
        
        # Create unique filename
        unique_filename = f"{user_id}_{uuid.uuid4().hex[:8]}.jpg"
        
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(os.getcwd(), 'uploads', 'images')
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Convert to RGB and resize
        if image.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            background.paste(image, mask=image.split()[-1] if 'A' in image.mode else None)
            image = background
        
        image.thumbnail(MAX_IMAGE_SIZE, Image.Resampling.LANCZOS)
        image.save(file_path, 'JPEG', optimize=True, quality=85)
        
        return f"uploads/images/{unique_filename}"
        
    except Exception as e:
        raise ValueError(f"Failed to process base64 image: {str(e)}")

def calculate_macro_percentages(proteins, carbs, fats, total_calories):
    """Calculate macronutrient percentages"""
    if total_calories <= 0:
        return {'proteins': 0, 'carbs': 0, 'fats': 0}
    
    protein_calories = proteins * 4
    carb_calories = carbs * 4  
    fat_calories = fats * 9
    
    return {
        'proteins': round((protein_calories / total_calories) * 100, 1),
        'carbs': round((carb_calories / total_calories) * 100, 1),
        'fats': round((fat_calories / total_calories) * 100, 1)
    }

def format_nutrition_response(nutrition_data, serving_size=None):
    """Format nutrition data for consistent API responses"""
    formatted = {
        'calories': round(float(nutrition_data.get('calories', 0)), 2),
        'proteins': round(float(nutrition_data.get('proteins', 0)), 2),
        'carbs': round(float(nutrition_data.get('carbs', 0)), 2),
        'fats': round(float(nutrition_data.get('fats', 0)), 2),
        'fiber': round(float(nutrition_data.get('fiber', 0)), 2),
        'sodium': round(float(nutrition_data.get('sodium', 0)), 2),
        'sugars': round(float(nutrition_data.get('sugars', 0)), 2)
    }
    
    if serving_size:
        formatted['serving_size'] = round(float(serving_size), 2)
    
    # Calculate macro percentages
    total_calories = formatted['calories']
    if total_calories > 0:
        formatted['macro_percentages'] = calculate_macro_percentages(
            formatted['proteins'], 
            formatted['carbs'], 
            formatted['fats'], 
            total_calories
        )
    
    return formatted

def paginate_query(query, page, per_page=20, max_per_page=100):
    """Add pagination to SQLAlchemy query"""
    # Validate parameters
    try:
        page = max(1, int(page))
        per_page = min(max_per_page, max(1, int(per_page)))
    except (ValueError, TypeError):
        page = 1
        per_page = 20
    
    # Calculate offset
    offset = (page - 1) * per_page
    
    # Get total count
    total = query.count()
    
    # Get items for current page
    items = query.offset(offset).limit(per_page).all()
    
    # Calculate pagination info
    total_pages = (total + per_page - 1) // per_page
    has_next = page < total_pages
    has_prev = page > 1
    
    return {
        'items': items,
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': total_pages,
        'has_next': has_next,
        'has_prev': has_prev,
        'next_page': page + 1 if has_next else None,
        'prev_page': page - 1 if has_prev else None
    }

def safe_float(value, default=0.0):
    """Safely convert value to float with default"""
    try:
        return float(value) if value is not None else default
    except (ValueError, TypeError):
        return default

def safe_int(value, default=0):
    """Safely convert value to int with default"""
    try:
        return int(value) if value is not None else default
    except (ValueError, TypeError):
        return default

def clean_food_name(name):
    """Clean and normalize food name"""
    if not name:
        return ""
    
    # Remove extra whitespace and normalize
    cleaned = ' '.join(name.strip().split())
    
    # Capitalize first letter of each word
    cleaned = cleaned.title()
    
    return cleaned

def get_meal_time_suggestion():
    """Suggest meal type based on current time"""
    current_hour = datetime.now().hour
    
    if 5 <= current_hour < 11:
        return 'breakfast'
    elif 11 <= current_hour < 15:
        return 'lunch'
    elif 15 <= current_hour < 18:
        return 'snack'
    elif 18 <= current_hour <= 23:
        return 'dinner'
    else:
        return 'snack'

def validate_date_string(date_str):
    """Validate and parse date string in YYYY-MM-DD format"""
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        raise ValueError("Invalid date format. Use YYYY-MM-DD")

def calculate_age_from_birthdate(birthdate):
    """Calculate age from birthdate"""
    today = datetime.now().date()
    return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))