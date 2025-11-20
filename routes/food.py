from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app import db
from models.user import User
from models.food_log import FoodLog
from models.custom_food import CustomFood
from services.openai_service import OpenAIService
from utils.helpers import save_uploaded_image
import base64
import json
from datetime import datetime, date

food_bp = Blueprint('food', __name__)
openai_service = OpenAIService()

@food_bp.route('/analyze-image', methods=['POST'])
@jwt_required()
def analyze_food_image():
    """Analyze food image using OpenAI Vision API"""
    try:
        user_id = get_jwt_identity()
        
        # Check if image is provided
        if 'image' not in request.files and 'image_base64' not in request.form:
            return jsonify({'error': 'No image provided'}), 400
        
        user_description = request.form.get('description', '')
        
        # Handle file upload or base64 image
        if 'image' in request.files:
            image_file = request.files['image']
            if image_file.filename == '':
                return jsonify({'error': 'No image selected'}), 400
            
            # Save image and get base64
            image_path = save_uploaded_image(image_file, user_id)
            image_data = image_file.read()
            image_base64 = base64.b64encode(image_data).decode('utf-8')
        else:
            # Handle base64 image from mobile app
            image_base64 = request.form.get('image_base64')
            image_path = None
        
        # Analyze image with OpenAI
        analysis_result = openai_service.analyze_food_image(image_base64, user_description)
        
        if 'error' in analysis_result:
            return jsonify({
                'error': 'Failed to analyze image',
                'details': analysis_result['error']
            }), 500
        
        # Format response for frontend
        response = {
            'analysis': analysis_result,
            'suggestions': {
                'food_name': analysis_result.get('food_name'),
                'estimated_calories': analysis_result.get('nutrition', {}).get('calories'),
                'confidence': analysis_result.get('confidence_score'),
                'serving_description': analysis_result.get('serving_description')
            },
            'image_path': image_path
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to analyze image', 
            'details': str(e)
        }), 500

@food_bp.route('/search', methods=['GET'])
@jwt_required()
def search_food():
    """Search for food by name using OpenAI"""
    try:
        query = request.args.get('q', '').strip()
        portion = request.args.get('portion', '')
        
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        
        # Search in user's custom foods first
        user_id = get_jwt_identity()
        custom_foods = CustomFood.query.filter(
            CustomFood.user_id == user_id,
            CustomFood.name.ilike(f'%{query}%')
        ).limit(5).all()
        
        # Get OpenAI analysis
        ai_result = openai_service.search_food_by_name(query, portion)
        
        response = {
            'query': query,
            'ai_result': ai_result,
            'custom_foods': [food.to_dict() for food in custom_foods]
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Search failed', 
            'details': str(e)
        }), 500

@food_bp.route('/log', methods=['POST'])
@jwt_required()
def log_food():
    """Log consumed food"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['food_name', 'serving_size', 'calories']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create food log entry
        food_log = FoodLog(
            user_id=user_id,
            food_name=data['food_name'],
            brand=data.get('brand'),
            barcode=data.get('barcode'),
            serving_size=data['serving_size'],
            servings_consumed=data.get('servings_consumed', 1.0),
            calories=data['calories'],
            proteins=data.get('proteins', 0),
            carbs=data.get('carbs', 0),
            fats=data.get('fats', 0),
            fiber=data.get('fiber', 0),
            sodium=data.get('sodium', 0),
            sugars=data.get('sugars', 0),
            meal_type=data.get('meal_type', 'snack'),
            confidence_score=data.get('confidence_score'),
            ai_analysis=json.dumps(data.get('ai_analysis', {})),
            image_path=data.get('image_path'),
            consumed_at=datetime.fromisoformat(data['consumed_at']) if data.get('consumed_at') else datetime.utcnow()
        )
        
        db.session.add(food_log)
        db.session.commit()
        
        return jsonify({
            'message': 'Food logged successfully',
            'food_log': food_log.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to log food', 
            'details': str(e)
        }), 500

@food_bp.route('/logs', methods=['GET'])
@jwt_required()
def get_food_logs():
    """Get user's food logs with optional date filtering"""
    try:
        user_id = get_jwt_identity()
        
        # Parse query parameters
        date_str = request.args.get('date')  # YYYY-MM-DD format
        meal_type = request.args.get('meal_type')
        limit = int(request.args.get('limit', 50))
        
        # Build query
        query = FoodLog.query.filter_by(user_id=user_id)
        
        # Filter by date if provided
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                query = query.filter(
                    db.func.date(FoodLog.consumed_at) == target_date
                )
            except ValueError:
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        
        # Filter by meal type if provided
        if meal_type:
            query = query.filter_by(meal_type=meal_type)
        
        # Order by consumption time (most recent first)
        food_logs = query.order_by(FoodLog.consumed_at.desc()).limit(limit).all()
        
        # Calculate daily totals if date is specified
        daily_totals = None
        if date_str:
            daily_totals = {
                'total_calories': sum(log.total_calories() for log in food_logs),
                'total_proteins': sum(log.total_nutrients()['proteins'] for log in food_logs),
                'total_carbs': sum(log.total_nutrients()['carbs'] for log in food_logs),
                'total_fats': sum(log.total_nutrients()['fats'] for log in food_logs),
                'total_fiber': sum(log.total_nutrients()['fiber'] for log in food_logs),
                'meal_breakdown': {}
            }
            
            # Calculate meal breakdown
            for meal_type in ['breakfast', 'lunch', 'dinner', 'snack']:
                meal_logs = [log for log in food_logs if log.meal_type == meal_type]
                daily_totals['meal_breakdown'][meal_type] = {
                    'calories': sum(log.total_calories() for log in meal_logs),
                    'count': len(meal_logs)
                }
        
        response = {
            'food_logs': [log.to_dict() for log in food_logs],
            'total_count': len(food_logs),
            'daily_totals': daily_totals
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to get food logs', 
            'details': str(e)
        }), 500

@food_bp.route('/logs/<int:log_id>', methods=['DELETE'])
@jwt_required()
def delete_food_log(log_id):
    """Delete a food log entry"""
    try:
        user_id = get_jwt_identity()
        
        food_log = FoodLog.query.filter_by(id=log_id, user_id=user_id).first()
        if not food_log:
            return jsonify({'error': 'Food log not found'}), 404
        
        db.session.delete(food_log)
        db.session.commit()
        
        return jsonify({'message': 'Food log deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to delete food log', 
            'details': str(e)
        }), 500

@food_bp.route('/logs/<int:log_id>', methods=['PUT'])
@jwt_required()
def update_food_log(log_id):
    """Update a food log entry"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        food_log = FoodLog.query.filter_by(id=log_id, user_id=user_id).first()
        if not food_log:
            return jsonify({'error': 'Food log not found'}), 404
        
        # Update allowed fields
        allowed_fields = [
            'servings_consumed', 'meal_type', 'consumed_at'
        ]
        
        for field in allowed_fields:
            if field in data:
                if field == 'consumed_at':
                    setattr(food_log, field, datetime.fromisoformat(data[field]))
                else:
                    setattr(food_log, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Food log updated successfully',
            'food_log': food_log.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to update food log', 
            'details': str(e)
        }), 500

@food_bp.route('/custom', methods=['POST'])
@jwt_required()
def create_custom_food():
    """Create a custom food entry"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'calories_per_100g']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create custom food
        custom_food = CustomFood(
            user_id=user_id,
            name=data['name'],
            brand=data.get('brand'),
            barcode=data.get('barcode'),
            calories_per_100g=data['calories_per_100g'],
            proteins_per_100g=data.get('proteins_per_100g', 0),
            carbs_per_100g=data.get('carbs_per_100g', 0),
            fats_per_100g=data.get('fats_per_100g', 0),
            fiber_per_100g=data.get('fiber_per_100g', 0),
            sodium_per_100g=data.get('sodium_per_100g', 0),
            sugars_per_100g=data.get('sugars_per_100g', 0),
            default_serving_size=data.get('default_serving_size', 100),
            category=data.get('category')
        )
        
        db.session.add(custom_food)
        db.session.commit()
        
        return jsonify({
            'message': 'Custom food created successfully',
            'custom_food': custom_food.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': 'Failed to create custom food', 
            'details': str(e)
        }), 500

@food_bp.route('/analyze-recipe', methods=['POST'])
@jwt_required()
def analyze_recipe():
    """Analyze recipe and calculate nutrition per serving"""
    try:
        data = request.get_json()
        
        if 'recipe_text' not in data:
            return jsonify({'error': 'Recipe text is required'}), 400
        
        recipe_text = data['recipe_text']
        servings = data.get('servings', 1)
        
        # Analyze recipe with OpenAI
        analysis_result = openai_service.analyze_recipe(recipe_text, servings)
        
        if 'error' in analysis_result:
            return jsonify({
                'error': 'Failed to analyze recipe',
                'details': analysis_result['error']
            }), 500
        
        return jsonify({
            'recipe_analysis': analysis_result
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': 'Failed to analyze recipe', 
            'details': str(e)
        }), 500