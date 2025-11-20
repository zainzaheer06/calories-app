import openai
import json
import base64
from io import BytesIO
from PIL import Image
import os
from dotenv import load_dotenv

class OpenAIService:
    def __init__(self):
        load_dotenv()
        openai.api_key = os.environ.get('OPENAI_API_KEY')
        self.client = openai.OpenAI()
    
    def analyze_food_image(self, image_data, user_description=""):
        """
        Analyze food image and return nutritional information
        """
        try:
            # Convert image to base64 if it's bytes
            if isinstance(image_data, bytes):
                image_base64 = base64.b64encode(image_data).decode('utf-8')
            else:
                image_base64 = image_data
            
            prompt = f"""
            Analyze this food image carefully and provide detailed nutritional information.
            
            User description (if provided): {user_description}
            
            Please identify:
            1. The specific food item(s) in the image
            2. Estimated portion size/weight in grams
            3. Detailed nutritional information per serving
            
            Respond ONLY with valid JSON in this exact format:
            {{
                "food_name": "specific food name",
                "brand": "brand if identifiable, null otherwise",
                "estimated_weight_grams": number,
                "confidence_score": number between 0.1 and 1.0,
                "nutrition": {{
                    "calories": number,
                    "proteins": number,
                    "carbs": number,
                    "fats": number,
                    "fiber": number,
                    "sodium": number,
                    "sugars": number
                }},
                "serving_description": "description of the portion",
                "ingredients": ["list", "of", "likely", "ingredients"],
                "meal_category": "breakfast/lunch/dinner/snack",
                "analysis_notes": "any important observations"
            }}
            
            BE VERY ACCURATE with nutritional values. If unsure, be conservative with estimates.
            DO NOT include any text outside the JSON structure.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4-vision-preview",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{image_base64}",
                                    "detail": "high"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=500,
                temperature=0.1
            )
            
            # Parse the JSON response
            response_text = response.choices[0].message.content.strip()
            
            # Clean up response (remove any markdown formatting)
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('```'):
                response_text = response_text[3:-3]
            
            return json.loads(response_text)
            
        except json.JSONDecodeError as e:
            return {
                "error": "Failed to parse AI response",
                "details": str(e),
                "raw_response": response_text if 'response_text' in locals() else None
            }
        except Exception as e:
            return {
                "error": "Failed to analyze image",
                "details": str(e)
            }
    
    def search_food_by_name(self, food_name, portion_description=""):
        """
        Get nutritional information for a food item by name
        """
        try:
            prompt = f"""
            Provide detailed nutritional information for: {food_name}
            Portion/serving description: {portion_description}
            
            If no specific portion is mentioned, assume a typical serving size.
            
            Respond ONLY with valid JSON in this exact format:
            {{
                "food_name": "standardized food name",
                "serving_size_grams": number,
                "serving_description": "description of serving size",
                "nutrition": {{
                    "calories": number,
                    "proteins": number,
                    "carbs": number,
                    "fats": number,
                    "fiber": number,
                    "sodium": number,
                    "sugars": number
                }},
                "confidence_score": number between 0.1 and 1.0,
                "meal_category": "breakfast/lunch/dinner/snack",
                "common_brands": ["list", "of", "common", "brands"]
            }}
            
            BE ACCURATE with nutritional values based on USDA or other reliable sources.
            DO NOT include any text outside the JSON structure.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=400,
                temperature=0.1
            )
            
            response_text = response.choices[0].message.content.strip()
            
            # Clean up response
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('```'):
                response_text = response_text[3:-3]
            
            return json.loads(response_text)
            
        except json.JSONDecodeError as e:
            return {
                "error": "Failed to parse AI response",
                "details": str(e)
            }
        except Exception as e:
            return {
                "error": "Failed to search food",
                "details": str(e)
            }
    
    def analyze_recipe(self, recipe_text, servings=1):
        """
        Analyze a recipe and calculate nutritional information per serving
        """
        try:
            prompt = f"""
            Analyze this recipe and calculate nutritional information per serving:
            
            Recipe: {recipe_text}
            Number of servings: {servings}
            
            Respond ONLY with valid JSON in this exact format:
            {{
                "recipe_name": "recipe name",
                "total_servings": {servings},
                "per_serving_nutrition": {{
                    "calories": number,
                    "proteins": number,
                    "carbs": number,
                    "fats": number,
                    "fiber": number,
                    "sodium": number,
                    "sugars": number
                }},
                "ingredients_analyzed": ["list", "of", "main", "ingredients"],
                "estimated_weight_per_serving": number,
                "confidence_score": number between 0.1 and 1.0,
                "cooking_notes": "any relevant cooking adjustments for calories"
            }}
            
            Consider cooking methods that might affect caloric content.
            DO NOT include any text outside the JSON structure.
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                temperature=0.1
            )
            
            response_text = response.choices[0].message.content.strip()
            
            # Clean up response
            if response_text.startswith('```json'):
                response_text = response_text[7:-3]
            elif response_text.startswith('```'):
                response_text = response_text[3:-3]
            
            return json.loads(response_text)
            
        except Exception as e:
            return {
                "error": "Failed to analyze recipe",
                "details": str(e)
            }