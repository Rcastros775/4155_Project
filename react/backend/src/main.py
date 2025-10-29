from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta

app = Flask(__name__)
CORS(app)

# === CONFIG ===
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ninerhub.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # change later for production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# === USER MODEL ===
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

with app.app_context():
    db.create_all()

# === REGISTER ===
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, email=email, password=hashed_pw)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# === LOGIN ===
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=user.id)
    return jsonify({"token": token, "username": user.username}), 200

# === TEST PROTECTED ROUTE ===
@app.route("/api/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({"username": user.username, "email": user.email})

# === EXISTING GAMES API (KEEPING YOUR DATA) ===
games = [
    {
        "id": 1,
        "home_team": "UNCC",
        "away_team": "Duke",
        "date": "2025-10-05",
        "time": "7:00 PM",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 2,
        "home_team": "UNCC",
        "away_team": "Wake Forest",
        "date": "2025-10-10",
        "time": "6:30 PM",
        "image": "/static/football.jpg"
    },
    {
        "id": 3,
        "home_team": "UNCC",
        "away_team": "ETSU",
        "date": "2025-10-15",
        "time": "5:00 PM",
        "image": "/static/Soccer.png"
    }
]

@app.route("/api/games")
def get_games():
    return jsonify(games)

@app.route("/api/games/<int:game_id>", methods=["GET"])
def get_game(game_id):
    for game in games:
        if game["id"] == game_id:
            return jsonify(game)
    return jsonify({"error": "Game not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, port=5000)
