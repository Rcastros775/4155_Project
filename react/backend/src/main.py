from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from datetime import datetime
import os

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:5173"}},
    methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    expose_headers=["Authorization"],
    supports_credentials=False,
)

# === CONFIG ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INSTANCE_DIR = os.path.join(BASE_DIR, "instance")
os.makedirs(INSTANCE_DIR, exist_ok=True)
DB_PATH = os.path.join(INSTANCE_DIR, "ninerhub.db")

app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
# === EXISTING GAMES API (KEEPING YOUR DATA) ===
games = [
    {
        "id": 1,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Duke",
        "date": "2025-10-05",
        "time": "7:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 2,
        "sport": "Football",
        "home_team": "UNCC",
        "away_team": "Wake Forest",
        "date": "2025-10-10",
        "time": "6:30 PM",
        "stadium_location": "Jerry Richardson Stadium",
        "image": "/static/football.jpg"
    },
    {
        "id": 3,
        "sport": "Soccer",
        "home_team": "UNCC",
        "away_team": "ETSU",
        "date": "2025-10-15",
        "time": "5:00 PM",
        "stadium_location": "Transamerica Field",
        "image": "/static/Soccer.png"
        
    }
]
# === USER MODEL ===
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

# === EVENT MODEL ===
class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    sport = db.Column(db.String(50), nullable=False, index=True)
    home_team = db.Column(db.String(80), nullable=False, index=True)
    away_team = db.Column(db.String(80), nullable=False, index=True)
    game_date = db.Column(db.Date, nullable=False, index=True)
    game_time = db.Column(db.Time, nullable=False)
    stadium_location = db.Column(db.String(120), nullable=False)
    image = db.Column(db.String(255), nullable=True)

# === BOOKMARK MODEL ===
class Bookmark(db.Model):
    __tablename__ = "bookmarks"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)

    user = db.relationship("User", backref=db.backref("bookmarks", lazy=True))
    event = db.relationship("Event", backref=db.backref("bookmarked_by", lazy=True))


#DB CREATION
with app.app_context():
    #keeping user table while deleting all other tables
    all_tables = db.metadata.tables.keys()
    tables_to_drop = [t for t in all_tables if t != "user"]
    db.metadata.drop_all(bind=db.engine, tables=[db.metadata.tables[t] for t in tables_to_drop])
    db.create_all()

    if Event.query.count() == 0:
        to_add = []
        for g in games:
            to_add.append(Event(
                sport=g["sport"],
                home_team=g["home_team"],
                away_team=g["away_team"],
                game_date=datetime.strptime(g["date"], "%Y-%m-%d").date(),
                game_time=datetime.strptime(g["time"], "%I:%M %p").time(),
                stadium_location=g["stadium_location"],
                image=g.get("image")
            ))
        db.session.add_all(to_add)
        db.session.commit()


# === REGISTER Account===
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

# === LOGIN Account ===
@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "username": user.username}), 200

# === TEST PROTECTED ROUTE ===
@app.route("/api/me", methods=["GET"])
@jwt_required()
def me():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    return jsonify({"username": user.username, "email": user.email})


#games
#list all games
@app.route("/api/games", methods=["GET"])
def get_games():
    events = Event.query.order_by(Event.game_date, Event.game_time).all()
    return jsonify([
        {
            "id": e.id,
            "sport": e.sport,
            "home_team": e.home_team,
            "away_team": e.away_team,
            "date": e.game_date.strftime("%Y-%m-%d"),
            "time": e.game_time.strftime("%I:%M %p"),
            "stadium_location": e.stadium_location,
            "image": e.image
        } for e in events
    ])

#show specific game
@app.route("/api/games/<int:game_id>", methods=["GET"])
def get_game(game_id):
    event = Event.query.get(game_id)
    if event:
        return jsonify({
            "id": event.id,
            "sport": event.sport,
            "home_team": event.home_team,
            "away_team": event.away_team,
            "date": event.game_date.strftime("%Y-%m-%d"),
            "time": event.game_time.strftime("%I:%M %p"),
            "stadium_location": event.stadium_location,
            "image": event.image
        })
    return jsonify({"error": "Game not found"}), 404


#Bookmarks

#add bookmark
@app.route("/api/bookmarks/<int:event_id>", methods=["POST"])
@jwt_required()
def add_bookmark(event_id):
    user_id = int(get_jwt_identity())
    event = Event.query.get(event_id)

    if not event:
        return jsonify({"error": "Event not found"}), 404

    # duplicate prevention
    existing = Bookmark.query.filter_by(user_id=user_id, event_id=event_id).first()
    if existing:
        return jsonify({"message": "Already bookmarked"}), 200

    new_bookmark = Bookmark(user_id=user_id, event_id=event_id)
    db.session.add(new_bookmark)
    db.session.commit()

    return jsonify({"message": f"Bookmarked {event.home_team} vs {event.away_team}"}), 201

#remove bookmark
@app.route("/api/bookmarks/<int:event_id>", methods=["DELETE"])
@jwt_required()
def remove_bookmark(event_id):
    user_id = int(get_jwt_identity())
    bm = Bookmark.query.filter_by(user_id=user_id, event_id=event_id).first()
    if not bm:
        return jsonify({"error": "Bookmark not found"}), 404

    db.session.delete(bm)
    db.session.commit()
    return jsonify({"message": "Bookmark removed"}), 200

#get all bookmarks for verified logged in user
@app.route("/api/bookmarks", methods=["GET"])
@jwt_required()
def get_bookmarks():
    user_id = int(get_jwt_identity())
    bookmarks = Bookmark.query.filter_by(user_id=user_id).all()
    # return event summaries
    return jsonify([
        {
            "id": b.event.id,
            "sport": getattr(b.event, "sport", None),
            "home_team": b.event.home_team,
            "away_team": b.event.away_team,
            "date": b.event.game_date.strftime("%Y-%m-%d"),
            "time": b.event.game_time.strftime("%I:%M %p"),
            "stadium_location": b.event.stadium_location,
            "image": b.event.image
        } for b in bookmarks
    ])

#*******************************
if __name__ == "__main__":
    app.run(debug=True, port=5000)
