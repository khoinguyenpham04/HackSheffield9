from groq import Groq
from typing import Dict, List
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

class QuizAnalyzer:
    def __init__(self, api_key: str):
        self.client = Groq(
            api_key=api_key
        )
        
    def analyze_user_performance(self, player_data: Dict) -> str:
        try:
            prompt = f"""
Analyze this individual player's quiz performance and provide specific feedback points. The player data is:

{json.dumps(player_data, indent=2)}

Provide 2-3 specific, actionable feedback points that:
1. Highlight what concepts they understood well
2. Identify areas where they need improvement
3. Give specific suggestions for improvement

Address the user by the first person, e.g. "You".
Format the feedback as a single cohesive paragraph, with each point flowing naturally into the next.
Keep the feedback concise but specific, mentioning the actual concepts tested.
"""
            
            completion = self.client.chat.completions.create(
                model="llama-3.2-90b-vision-preview",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at analyzing coding quiz performance. Provide specific, actionable feedback for individual Players."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1024
            )
            
            # Get the feedback as a single string
            feedback_text = completion.choices[0].message.content.strip()
            return feedback_text
        except Exception as e:
            print(f"DEBUG: Error in analyze_user_performance: {str(e)}")
            raise Exception(f"Error generating user feedback: {str(e)}")

    def analyze_quiz_data(self, game_data: Dict) -> Dict:
        try:
            analyzed_players = []
            print(f"DEBUG: Processing game data for analysis: {game_data}")
            
            for player in game_data['players']:
                print(f"DEBUG: Analyzing player: {player['username']}")
                feedback = self.analyze_user_performance(player)
                analyzed_players.append({
                    'userID': player['userID'],
                    'username': player['username'],
                    'feedback': feedback
                })
            
            return {
                'gameID': game_data['gameID'],
                'players': analyzed_players
            }
            
        except Exception as e:
            print(f"DEBUG: Error in analyze_quiz_data: {str(e)}")
            raise Exception(f"Error analyzing game data: {str(e)}")

def validate_answer_data(answer):
    required_fields = ['questionID', 'question_type', 'userAnswer', 'rightAnswer', 'isCorrect']
    is_valid = all(field in answer for field in required_fields)
    print(f"DEBUG: Validating answer data: {answer}")
    print(f"DEBUG: Answer data valid: {is_valid}")
    return is_valid

def validate_player_data(player):
    print(f"DEBUG: Validating player data: {player}")
    if not all(field in player for field in ['userID', 'username', 'answers']):
        print("DEBUG: Missing required player fields")
        return False
    if not isinstance(player['answers'], list):
        print("DEBUG: Player answers is not a list")
        return False
    answers_valid = all(validate_answer_data(answer) for answer in player['answers'])
    print(f"DEBUG: Player data valid: {answers_valid}")
    return answers_valid

def validate_game_data(data: Dict) -> bool:
    print(f"DEBUG: Validating game data: {data}")
    if not isinstance(data, dict):
        print("DEBUG: Game data is not a dictionary")
        return False
    
    required_fields = ['gameID', 'players']
    if not all(field in data for field in required_fields):
        print("DEBUG: Missing required game fields")
        return False
        
    if not isinstance(data['players'], list):
        print("DEBUG: Players is not a list")
        return False
        
    players_valid = all(validate_player_data(player) for player in data['players'])
    print(f"DEBUG: Game data valid: {players_valid}")
    return players_valid

def parse_request_body(request_data: Dict) -> Dict:
    """Parse the nested JSON request body structure"""
    try:
        print(f"DEBUG: Parsing request body: {request_data}")
        
        # Handle case where the entire request is a JSON string
        if isinstance(request_data, str):
            print("DEBUG: Request data is a string, parsing as JSON")
            request_data = json.loads(request_data)
            
        # Handle case where we have a raw string that needs double parsing
        if isinstance(request_data, bytes):
            print("DEBUG: Request data is bytes, decoding and parsing")
            request_data = json.loads(request_data.decode('utf-8').strip('"').replace('\\"', '"'))
            return request_data
            
        if isinstance(request_data, dict) and 'body' in request_data:
            body_content = request_data['body']
            print(f"DEBUG: Found body field: {body_content}")
            
            # If body is a string that needs parsing
            if isinstance(body_content, str):
                print("DEBUG: Body is string, parsing as JSON")
                # Handle escaped JSON string
                body_content = body_content.strip('"').replace('\\"', '"')
                return json.loads(body_content)
            else:
                return body_content
                
        print(f"DEBUG: Using request data as-is: {request_data}")
        return request_data
        
    except json.JSONDecodeError as e:
        print(f"DEBUG: JSON decode error: {str(e)}")
        raise ValueError(f"Invalid JSON in body: {str(e)}")
    except Exception as e:
        print(f"DEBUG: Error parsing request body: {str(e)}")
        raise ValueError(f"Error parsing request body: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Service is running"
    }), 200

@app.route('/analyze-quiz', methods=['POST'])
def analyze_quiz():
    try:
        print("\n=== DEBUG: New Request Started ===")
        print(f"Request Content-Type: {request.content_type}")
        raw_data = request.get_data()
        print(f"Raw Request Data: {raw_data}")
        
        try:
            # Parse the raw data directly
            game_data = parse_request_body(raw_data)
            print(f"DEBUG: Parsed game data: {game_data}")
        except ValueError as e:
            print(f"DEBUG: Error parsing request body: {str(e)}")
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 400
            
        if not validate_game_data(game_data):
            print(f"DEBUG: Invalid game data format: {game_data}")
            return jsonify({
                "status": "error",
                "message": "Invalid game data format"
            }), 400
        
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            print("DEBUG: GROQ_API_KEY not found in environment")
            return jsonify({
                "status": "error",
                "message": "API key not configured"
            }), 500
            
        analyzer = QuizAnalyzer(api_key)
        result = analyzer.analyze_quiz_data(game_data)
        print(f"DEBUG: Analysis completed successfully: {result}")
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"DEBUG: Unexpected error: {str(e)}")
        app.logger.error(f"Error processing request: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Internal server error"
        }), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({
        "status": "error",
        "message": "Resource not found"
    }), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({
        "status": "error",
        "message": "Method not allowed"
    }), 405

@app.errorhandler(500)
def internal_error(e):
    return jsonify({
        "status": "error",
        "message": "Internal server error"
    }), 500

if __name__ == "__main__":
    port = int(os.getenv('PORT', 5000))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.getenv('FLASK_ENV') == 'development'
    )
