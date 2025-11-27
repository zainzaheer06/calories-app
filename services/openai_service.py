import os
import base64
import requests
import json
from config import Config

# Use requests library instead of OpenAI SDK for Python 3.14 compatibility
OPENAI_API_KEY = Config.OPENAI_API_KEY
OPENAI_AVAILABLE = bool(OPENAI_API_KEY)

def analyze_food_image(image_base64):
    """
    Analyze food image using OpenAI Vision API
    Returns nutrition information and food identification
    """

    if not OPENAI_AVAILABLE:
        # Mock response for testing
        print("⚠️ OpenAI API key not configured - returning mock data")
        return {
            'labels': ['banana', 'apple', 'orange'],
            'breakdown': [
                {'name': 'banana', 'calories': 105},
                {'name': 'apple', 'calories': 95},
                {'name': 'orange', 'calories': 62}
            ],
            'total_calories': 262,
            'total_protein': 3,
            'total_carbs': 68,
            'total_fats': 1,
            'confidence': 0.75
        }
    
    try:
        print("🤖 Analyzing image with OpenAI Vision API...")
        
        prompt = """Analyze this food image and identify all food items visible.
For each food item, estimate the calories based on visible portion size.

Respond in this EXACT JSON format:
{
  "labels": ["food1", "food2", "food3"],
  "breakdown": [
    {"name": "food1", "calories": 100},
    {"name": "food2", "calories": 150}
  ],
  "total_calories": 250,
  "total_protein": 10,
  "total_carbs": 30,
  "total_fats": 8,
  "confidence": 0.85
}

Be specific with food names. Estimate realistic portion sizes."""

        # Call OpenAI API directly using requests
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }
        
        payload = {
            "model": "gpt-4o-mini",
            "messages": [{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}"
                        }
                    }
                ]
            }],
            "max_tokens": 800,
            "temperature": 0.3
        }
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            print(f"❌ OpenAI API Error: {response.status_code}")
            print(f"Response: {response.text}")
            return None
        
        result_data = response.json()
        result_text = result_data['choices'][0]['message']['content']
        print(f"✅ OpenAI Response received")
        print(f"Response: {result_text[:200]}...")
        
        # Extract JSON from response
        import re
        json_match = re.search(r'\{.*\}', result_text, re.DOTALL)
        if json_match:
            result = json.loads(json_match.group())
            print(f"✅ Parsed result: {result['labels']}")
            return result
        
        print("❌ Could not parse JSON from response")
        return None
        
    except Exception as e:
        print(f"❌ OpenAI Error: {e}")
        import traceback
        traceback.print_exc()
        return None

def get_nutrition_advice(user_data, food_logs):
    """Get personalized nutrition advice based on user profile and food logs"""
    if not OPENAI_AVAILABLE:
        # Return mock insights if OpenAI is not available
        total_calories = sum(log['total_calories'] for log in food_logs)
        total_protein = sum(log['proteins'] for log in food_logs)
        total_carbs = sum(log['carbs'] for log in food_logs)
        total_fats = sum(log['fats'] for log in food_logs)
        
        goal = user_data.get('daily_calorie_goal', 2000)
        
        insights = f"""📊 Daily Nutrition Summary:
        
You consumed {int(total_calories)} calories today (Goal: {goal} cal).

🥗 Macronutrient Breakdown:
• Protein: {int(total_protein)}g
• Carbs: {int(total_carbs)}g
• Fats: {int(total_fats)}g

💡 Recommendations:
"""
        if total_calories < goal * 0.8:
            insights += "• You're under your calorie goal. Consider adding a healthy snack.\n"
        elif total_calories > goal * 1.2:
            insights += "• You've exceeded your calorie goal. Try smaller portions tomorrow.\n"
        else:
            insights += "• Great job staying within your calorie goal!\n"
        
        if total_protein < 50:
            insights += "• Increase protein intake with lean meats, eggs, or legumes.\n"
        
        if total_carbs > total_calories * 0.6 / 4:
            insights += "• Consider reducing carbs and adding more vegetables.\n"
        
        insights += "\nKeep tracking your meals for better insights! 🎯"
        return insights
    
    try:
        # Calculate totals
        total_calories = sum(log['total_calories'] for log in food_logs)
        total_protein = sum(log['proteins'] for log in food_logs)
        total_carbs = sum(log['carbs'] for log in food_logs)
        total_fats = sum(log['fats'] for log in food_logs)
        total_fiber = sum(log['fiber'] for log in food_logs)
        
        # Build context for OpenAI
        context = f"""User Profile:
- Age: {user_data.get('age')} years
- Weight: {user_data.get('weight')} kg
- Height: {user_data.get('height')} cm
- Gender: {user_data.get('gender')}
- Goal: {user_data.get('goal_type')}
- Activity Level: {user_data.get('activity_level')}
- Daily Calorie Goal: {user_data.get('daily_calorie_goal')} cal

Today's Nutrition:
- Total Calories: {int(total_calories)} cal
- Protein: {int(total_protein)}g
- Carbs: {int(total_carbs)}g
- Fats: {int(total_fats)}g
- Fiber: {int(total_fiber)}g

Meals Consumed:
"""
        for log in food_logs:
            context += f"- {log['meal_type'].title()}: {log['food_name']} ({int(log['total_calories'])} cal)\n"
        
        prompt = """Analyze this nutrition data and provide:
1. Brief assessment of calorie intake vs goal
2. Macronutrient balance evaluation
3. 2-3 specific, actionable recommendations
4. One positive encouragement

Keep response under 150 words, friendly and motivating."""
        
        # Call OpenAI API directly
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }
        
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are an expert nutritionist providing personalized, encouraging advice."},
                {"role": "user", "content": f"{context}\n\n{prompt}"}
            ],
            "max_tokens": 400,
            "temperature": 0.7
        }
        
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result_data = response.json()
            return result_data['choices'][0]['message']['content']
        else:
            print(f"OpenAI API Error: {response.status_code}")
            return f"Unable to generate insights at this time."
        
    except Exception as e:
        print(f"OpenAI Error: {e}")
        # Fallback to mock insights
        return get_nutrition_advice(user_data, food_logs) if not OPENAI_AVAILABLE else f"Unable to generate insights: {str(e)}"
