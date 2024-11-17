import json

def transform_game_data_to_json(game_data):
    """
    Transform game data into a JSON format suitable for an LLM.

    :param game_data: A dictionary containing the game data
    :return: A JSON string containing formatted user data
    """
    user_data = []
    for player in game_data['players']:
        user_info = {
            'user_id': player['user_id'],
            'username': player['username'],
            'score': player['score'],
            'rounds_won': player['rounds_won'],
            'total_rounds': game_data['total_rounds'],
            'game_id': game_data['game_id'],
            'date': str(game_data['date']),  # Convert date to string
            'status': game_data['status'],
            'topics_correct': player['topics_correct'],
            'topics_incorrect': player['topics_incorrect']
        }
        user_data.append(user_info)

    # Create a summary of the game
    game_summary = {
        'game_id': game_data['game_id'],
        'total_rounds': game_data['total_rounds'],
        'player_count': game_data['player_count'],
        'winner_id': game_data['winner_id'],
        'date': str(game_data['date']),
        'status': game_data['status']
    }

    # Combine game summary and user data
    final_data = {
        'game_summary': game_summary,
        'player_data': user_data
    }

    # Convert to JSON string with indentation for readability
    return json.dumps(final_data, indent=2)
