from datetime import datetime, timedelta
from sqlalchemy import func
from app import db
from models.food_log import FoodLog

def calculate_daily_summary(user_id, target_date):
    """Calculate nutrition summary for a specific day"""
    logs = FoodLog.query.filter(
        FoodLog.user_id == user_id,
        func.date(FoodLog.consumed_at) == target_date
    ).all()
    
    if not logs:
        return {
            'total_calories': 0,
            'total_proteins': 0,
            'total_carbs': 0,
            'total_fats': 0,
            'total_fiber': 0,
            'total_sodium': 0,
            'total_sugars': 0,
            'meal_breakdown': {},
            'log_count': 0
        }
    
    # Calculate totals
    total_calories = sum(log.total_calories() for log in logs)
    total_proteins = sum(log.total_nutrients()['proteins'] for log in logs)
    total_carbs = sum(log.total_nutrients()['carbs'] for log in logs)
    total_fats = sum(log.total_nutrients()['fats'] for log in logs)
    total_fiber = sum(log.total_nutrients()['fiber'] for log in logs)
    total_sodium = sum(log.total_nutrients()['sodium'] for log in logs)
    total_sugars = sum(log.total_nutrients()['sugars'] for log in logs)
    
    # Breakdown by meal type
    meal_breakdown = {}
    for log in logs:
        meal_type = log.meal_type or 'snack'
        if meal_type not in meal_breakdown:
            meal_breakdown[meal_type] = {
                'calories': 0,
                'proteins': 0,
                'carbs': 0,
                'fats': 0,
                'count': 0
            }
        
        nutrients = log.total_nutrients()
        meal_breakdown[meal_type]['calories'] += nutrients['calories']
        meal_breakdown[meal_type]['proteins'] += nutrients['proteins']
        meal_breakdown[meal_type]['carbs'] += nutrients['carbs']
        meal_breakdown[meal_type]['fats'] += nutrients['fats']
        meal_breakdown[meal_type]['count'] += 1
    
    return {
        'total_calories': round(total_calories, 2),
        'total_proteins': round(total_proteins, 2),
        'total_carbs': round(total_carbs, 2),
        'total_fats': round(total_fats, 2),
        'total_fiber': round(total_fiber, 2),
        'total_sodium': round(total_sodium, 2),
        'total_sugars': round(total_sugars, 2),
        'meal_breakdown': meal_breakdown,
        'log_count': len(logs)
    }

def calculate_weekly_summary(user_id, start_date):
    """Calculate nutrition summary for a week"""
    end_date = start_date + timedelta(days=6)
    
    logs = FoodLog.query.filter(
        FoodLog.user_id == user_id,
        func.date(FoodLog.consumed_at) >= start_date,
        func.date(FoodLog.consumed_at) <= end_date
    ).all()
    
    if not logs:
        return {
            'total_calories': 0,
            'average_daily_calories': 0,
            'total_nutrients': {},
            'average_daily_nutrients': {},
            'daily_breakdown': [],
            'log_count': 0
        }
    
    # Calculate totals
    total_calories = sum(log.total_calories() for log in logs)
    total_proteins = sum(log.total_nutrients()['proteins'] for log in logs)
    total_carbs = sum(log.total_nutrients()['carbs'] for log in logs)
    total_fats = sum(log.total_nutrients()['fats'] for log in logs)
    total_fiber = sum(log.total_nutrients()['fiber'] for log in logs)
    
    # Daily breakdown
    daily_breakdown = []
    current_date = start_date
    while current_date <= end_date:
        day_summary = calculate_daily_summary(user_id, current_date)
        daily_breakdown.append({
            'date': current_date.isoformat(),
            'calories': day_summary['total_calories'],
            'log_count': day_summary['log_count']
        })
        current_date += timedelta(days=1)
    
    return {
        'total_calories': round(total_calories, 2),
        'average_daily_calories': round(total_calories / 7, 2),
        'total_nutrients': {
            'proteins': round(total_proteins, 2),
            'carbs': round(total_carbs, 2),
            'fats': round(total_fats, 2),
            'fiber': round(total_fiber, 2)
        },
        'average_daily_nutrients': {
            'proteins': round(total_proteins / 7, 2),
            'carbs': round(total_carbs / 7, 2),
            'fats': round(total_fats / 7, 2),
            'fiber': round(total_fiber / 7, 2)
        },
        'daily_breakdown': daily_breakdown,
        'log_count': len(logs)
    }

def calculate_monthly_summary(user_id, year, month):
    """Calculate nutrition summary for a month"""
    from calendar import monthrange
    
    days_in_month = monthrange(year, month)[1]
    start_date = datetime(year, month, 1).date()
    end_date = datetime(year, month, days_in_month).date()
    
    logs = FoodLog.query.filter(
        FoodLog.user_id == user_id,
        func.date(FoodLog.consumed_at) >= start_date,
        func.date(FoodLog.consumed_at) <= end_date
    ).all()
    
    if not logs:
        return {
            'total_calories': 0,
            'average_daily_calories': 0,
            'total_nutrients': {},
            'log_count': 0
        }
    
    # Calculate totals
    total_calories = sum(log.total_calories() for log in logs)
    total_proteins = sum(log.total_nutrients()['proteins'] for log in logs)
    total_carbs = sum(log.total_nutrients()['carbs'] for log in logs)
    total_fats = sum(log.total_nutrients()['fats'] for log in logs)
    total_fiber = sum(log.total_nutrients()['fiber'] for log in logs)
    
    return {
        'total_calories': round(total_calories, 2),
        'average_daily_calories': round(total_calories / days_in_month, 2),
        'total_nutrients': {
            'proteins': round(total_proteins, 2),
            'carbs': round(total_carbs, 2),
            'fats': round(total_fats, 2),
            'fiber': round(total_fiber, 2)
        },
        'average_daily_nutrients': {
            'proteins': round(total_proteins / days_in_month, 2),
            'carbs': round(total_carbs / days_in_month, 2),
            'fats': round(total_fats / days_in_month, 2),
            'fiber': round(total_fiber / days_in_month, 2)
        },
        'log_count': len(logs)
    }

def get_most_eaten_foods(user_id, limit=10):
    """Get most frequently eaten foods"""
    results = db.session.query(
        FoodLog.food_name,
        func.count(FoodLog.id).label('count'),
        func.sum(FoodLog.calories * FoodLog.servings_consumed).label('total_calories')
    ).filter(
        FoodLog.user_id == user_id
    ).group_by(
        FoodLog.food_name
    ).order_by(
        func.count(FoodLog.id).desc()
    ).limit(limit).all()
    
    return [
        {
            'food_name': result[0],
            'times_eaten': result[1],
            'total_calories': round(result[2], 2)
        }
        for result in results
    ]

def calculate_goal_progress(user_id, days=30):
    """Calculate progress towards calorie goals over time"""
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=days - 1)
    
    from models.user import User
    user = User.query.get(user_id)
    
    if not user or not user.daily_calorie_goal:
        return {
            'days_tracked': 0,
            'days_on_target': 0,
            'average_calories': 0,
            'target_calories': 0
        }
    
    # Get daily summaries
    daily_data = []
    current_date = start_date
    days_on_target = 0
    total_calories = 0
    days_with_logs = 0
    
    while current_date <= end_date:
        day_summary = calculate_daily_summary(user_id, current_date)
        if day_summary['log_count'] > 0:
            days_with_logs += 1
            total_calories += day_summary['total_calories']
            
            # Check if on target (within 10% of goal)
            target = user.daily_calorie_goal
            if abs(day_summary['total_calories'] - target) <= target * 0.1:
                days_on_target += 1
            
            daily_data.append({
                'date': current_date.isoformat(),
                'calories': day_summary['total_calories'],
                'on_target': abs(day_summary['total_calories'] - target) <= target * 0.1
            })
        
        current_date += timedelta(days=1)
    
    return {
        'days_tracked': days_with_logs,
        'days_on_target': days_on_target,
        'average_calories': round(total_calories / days_with_logs, 2) if days_with_logs > 0 else 0,
        'target_calories': user.daily_calorie_goal,
        'success_rate': round((days_on_target / days_with_logs * 100), 1) if days_with_logs > 0 else 0,
        'daily_data': daily_data
    }
