from flask import Flask, jsonify
from flask_cors import CORS  # lets frontend talk to backend

app = Flask(__name__)
CORS(app)  # enable CORS for React requests

games = [
    {
        "home_team": "UNC",
        "away_team": "Duke",
        "date": "2025-10-05",
        "time": "7:00 PM",
        "image": "/static/Basketball.webp"
    },
    {
        "home_team": "NC State",
        "away_team": "Wake Forest",
        "date": "2025-10-10",
        "time": "6:30 PM",
        "image": "/static/football.jpg"
    },
    {
        "home_team": "App State",
        "away_team": "ETSU",
        "date": "2025-10-15",
        "time": "5:00 PM",
        "image": "/static/Soccer.png"
    }
]

@app.route("/api/games", methods=["GET"])
def get_games():
    return jsonify(games)

@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Hello from the Python backend!"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)