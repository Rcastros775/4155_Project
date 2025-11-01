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
        "sport": "Soccer",
        "home_team": "UNCC",
        "away_team": "#22 Florida Atlantic",
        "date": "2025-10-17",
        "time": "6:00 PM",
        "stadium_location": "Transamerica Field",
        "image": "/static/Soccer.png"
    },
    {
        "id": 2,
        "sport": "Football",
        "home_team": "UNCC",
        "away_team": "Temple",
        "date": "2025-10-18",
        "time": "3:30 PM",
        "stadium_location": "Jerry Richardson Stadium",
        "image": "/static/football.jpg"
    },
    {
        "id": 3,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "North Carolina Wesleyan",
        "date": "2025-10-20",
        "time": "7:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 4,
        "sport": "Soccer",
        "home_team": "UNCC",
        "away_team": "Florida Atlantic",
        "date": "2025-10-23",
        "time": "7:00 PM",
        "stadium_location": "Transamerica Field",
        "image": "/static/Soccer.png"
    },
    {
        "id": 5,
        "sport": "Football",
        "home_team": "UNCC",
        "away_team": "North Texas",
        "date": "2025-10-24",
        "time": "7:00 PM",
        "stadium_location": "Jerry Richardson Stadium",
        "image": "/static/football.jpg"
    },
    {
        "id": 6,
        "sport": "Soccer",
        "home_team": "UNCC",
        "away_team": "Temple",
        "date": "2025-10-29",
        "time": "6:00 PM",
        "stadium_location": "Transamerica Field",
        "image": "/static/Soccer.png"
    },
    {
        "id": 7,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Auburn",
        "date": "2025-11-03",
        "time": "5:30 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 8,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Indiana State",
        "date": "2025-11-03",
        "time": "8:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 9,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Campbell",
        "date": "2025-11-06",
        "time": "6:30 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 10,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Tennessee Tech",
        "date": "2025-11-07",
        "time": "7:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 11,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Davidson",
        "date": "2025-11-11",
        "time": "7:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 12,
        "sport": "Football",
        "home_team": "UNCC",
        "away_team": "UTSA",
        "date": "2025-11-15",
        "time": "6:00 PM",
        "stadium_location": "Jerry Richardson Stadium",
        "image": "/static/football.jpg"
    },
    {
        "id": 13,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Wofford",
        "date": "2025-11-22",
        "time": "2:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 14,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Shaw University",
        "date": "2025-11-23",
        "time": "2:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 15,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "North Carolina A&T",
        "date": "2025-12-03",
        "time": "7:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 16,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Utah State",
        "date": "2025-12-07",
        "time": "2:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 17,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Davidson",
        "date": "2025-12-14",
        "time": "6:30 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 18,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Winthrop",
        "date": "2025-12-17",
        "time": "11:00 AM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 19,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Lafayette",
        "date": "2025-12-18",
        "time": "7:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 20,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "ETSU",
        "date": "2025-12-21",
        "time": "11:00 AM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 21,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "UIC",
        "date": "2025-12-21",
        "time": "2:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 22,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Temple",
        "date": "2025-12-30",
        "time": "7:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
    },
    {
        "id": 23,
        "sport": "Basketball",
        "home_team": "UNCC",
        "away_team": "Memphis",
        "date": "2025-12-31",
        "time": "3:00 PM",
        "stadium_location": "Dale F. Halton Arena",
        "image": "/static/Basketball.webp"
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

# === INTERESTED MODEL ===
class Interest(db.Model):
    __tablename__ = "interests"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User")
    event = db.relationship("Event")
    __table_args__ = (db.UniqueConstraint("user_id", "event_id", name="uix_interest"),)

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

#interested in games 
# === INTERESTS ===

# list of participants
@app.route("/api/interests/<int:event_id>", methods=["GET"])
def get_interests(event_id):
    rows = Interest.query.filter_by(event_id=event_id).all()
    return jsonify([
        {"user_id": r.user_id, "username": getattr(r.user, "username", f"user{r.user_id}")}
        for r in rows
    ])

# check current user is interested 
@app.route("/api/interests/<int:event_id>/mine", methods=["GET"])
@jwt_required()
def my_interest_status(event_id):
    user_id = int(get_jwt_identity())
    exists = Interest.query.filter_by(user_id=user_id, event_id=event_id).first() is not None
    return jsonify({"interested": exists})

# mark current user as interested
@app.route("/api/interests/<int:event_id>", methods=["POST"])
@jwt_required()
def add_interest(event_id):
    user_id = int(get_jwt_identity())
    if not Event.query.get(event_id):
        return jsonify({"error": "Event not found"}), 404
    if Interest.query.filter_by(user_id=user_id, event_id=event_id).first():
        return jsonify({"message": "Already interested"}), 200
    db.session.add(Interest(user_id=user_id, event_id=event_id))
    db.session.commit()
    return jsonify({"message": "Marked as interested"}), 201

# remove interest
@app.route("/api/interests/<int:event_id>", methods=["DELETE"])
@jwt_required()
def remove_interest(event_id):
    user_id = int(get_jwt_identity())
    row = Interest.query.filter_by(user_id=user_id, event_id=event_id).first()
    if not row:
        return jsonify({"error": "Not marked interested"}), 404
    db.session.delete(row)
    db.session.commit()
    return jsonify({"message": "Interest removed"}), 200

#------------- Team Statistics -------------------#
team_stats = {
    "basketball": {
        "men": {
            "wins": 15,
            "losses": 3,
            "points_per_game": 78.5,
            "game details": {
                "three_point_percentage": 38.7,
                "free_throw_percentage": 75.4
            },
            "season stats": {
                "rebounds_per_game": 35.2,
                "assists_per_game": 15.4,
                "steals_per_game": 7.8,
                "blocks_per_game": 4.1
            }
        },
        "women": {
            "wins": 14,
            "losses": 4,
            "points_per_game": 72.2,
            "game details": {
                "three_point_percentage": 36.5,
                "free_throw_percentage": 78.1
            },
            "season stats": {
                "rebounds_per_game": 33.8,
                "assists_per_game": 14.2,
                "steals_per_game": 6.9,
                "blocks_per_game": 3.5
            }
        }
    },
    "football": {
        "men": {
            "wins": 10,
            "losses": 5,
            "points_per_game": 24.3,
            "game details": {
                "passing_yards_per_game": 250.5,
                "rushing_yards_per_game": 120.7,
                "turnovers_per_game": 1.8
            },
            "season stats": {
                "third_down_conversion_rate": 42.5,
                "red_zone_efficiency": 85.3,
                "touchdowns": 35,
                "field_goals_made": 18
            }
        },
        "women": {
            "wins": 8,
            "losses": 7,
            "points_per_game": 18.0,
            "game details": {
                "passing_yards_per_game": 220.3,
                "rushing_yards_per_game": 100.4,
                "turnovers_per_game": 2.1
            },
            "season stats": {
                "third_down_conversion_rate": 38.7,
                "red_zone_efficiency": 78.9,
                "touchdowns": 28,
                "field_goals_made": 15
            }
        }
    },
    "soccer": {
        "men": {
            "wins": 12,
            "losses": 4,
            "points_per_game": 2.1,
            "game details": {
                "shots_on_goal_percentage": 45.2,
                "possession_percentage": 53.4,
                "pass_accuracy_percentage": 81.7
            },
            "season stats": {
                "clean_sheets": 8,
                "goals_scored": 30,
                "assists": 18,
                "fouls_committed": 50
            }
        },
        "women": {
            "wins": 11,
            "losses": 5,
            "points_per_game": 2.3,
            "game details": {
                "shots_on_goal_percentage": 42.8,
                "possession_percentage": 50.9,
                "pass_accuracy_percentage": 79.5
            },
            "season stats": {
                "clean_sheets": 7,
                "goals_scored": 28,
                "assists": 20,
                "fouls_committed": 55
            }
        }
    },
    "baseball": {
        "men": {
            "wins": 20,
            "losses": 10,
            "points_per_game": .275,
            "game details": {
                "batting_average": .275,
                "on_base_percentage": .340,
                "slugging_percentage": .450
            },
            "season stats": {
                "home_runs": 45,
                "batting_average": .275,
                "earned_run_average": 3.50,
                "fielding_percentage": .980
            }
        },
        "women": {
            "wins": 18,
            "losses": 12,
            "points_per_game": .260,
            "game details": {
                "batting_average": .260,
                "on_base_percentage": .330,
                "slugging_percentage": .420
            },
            "season stats": {
                "home_runs": 30,
                "batting_average": .260,
                "earned_run_average": 4.20,
                "fielding_percentage": .975
            }
        }
    },
    "tennis": {
        "men": {
            "wins": 25,
            "losses": 5,
            "points_per_game": 8.4,
            "game details": {
                "first_serve_percentage": 65.0,
                "aces_per_match": 5.2,
                "double_faults_per_match": 1.3
            },
            "season stats": {
                "matches_won": 25,
                "matches_lost": 5,
                "break_points_converted_percentage": 40.5,
                "total_aces": 78
            }
        },
        "women": {
            "wins": 22,
            "losses": 8,
            "points_per_game": 6.7,
            "game details": {
                "first_serve_percentage": 62.5,
                "aces_per_match": 4.0,
                "double_faults_per_match": 1.5
            },
            "season stats": {
                "matches_won": 22,
                "matches_lost": 8,
                "break_points_converted_percentage": 38.2,
                "total_aces": 65
            }
        }
    }
}


@app.route("/api/team-stats/<string:sport>/<string:gender>", methods=["GET"])
def get_team_stats(sport, gender):
    # Fetching data for sport and gender
    sport_data = team_stats.get(sport.lower(), {}).get(gender.lower())

    # Debugging: print the data being returned
    print(f"Fetching data for {sport} {gender}: {sport_data}")

    if sport_data:
        return jsonify(sport_data)
    
    return jsonify({"error": "Team stats not found"}), 404
    




#*******************************
if __name__ == "__main__":
    app.run(debug=True, port=5000)
