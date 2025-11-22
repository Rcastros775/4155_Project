from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from datetime import datetime
from database import db, bcrypt
from models import User, Event, Bookmark, Interest, Message
from sqlalchemy import or_, and_

routes = Blueprint("routes", __name__)

@routes.post("/api/register")
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    hashed = bcrypt.generate_password_hash(password).decode("utf-8")
    user = User(username=username, email=email, password=hashed)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered"}), 201


@routes.post("/api/login")
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email/password"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "username": user.username})


@routes.get("/api/me")
@jwt_required()
def me():
    user = User.query.get(int(get_jwt_identity()))
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email
    })


@routes.get("/api/games")
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


@routes.get("/api/games/<int:event_id>")
def get_game(event_id):
    e = Event.query.get(event_id)
    if not e:
        return jsonify({"error": "Not found"}), 404
    return jsonify({
        "id": e.id,
        "sport": e.sport,
        "home_team": e.home_team,
        "away_team": e.away_team,
        "date": e.game_date.strftime("%Y-%m-%d"),
        "time": e.game_time.strftime("%I:%M %p"),
        "stadium_location": e.stadium_location,
        "image": e.image
    })


@routes.post("/api/bookmarks/<int:event_id>")
@jwt_required()
def add_bookmark(event_id):
    user_id = int(get_jwt_identity())
    if Bookmark.query.filter_by(user_id=user_id, event_id=event_id).first():
        return jsonify({"message": "Already bookmarked"}), 200

    db.session.add(Bookmark(user_id=user_id, event_id=event_id))
    db.session.commit()
    return jsonify({"message": "Bookmarked"}), 201


@routes.delete("/api/bookmarks/<int:event_id>")
@jwt_required()
def remove_bookmark(event_id):
    user_id = int(get_jwt_identity())
    bm = Bookmark.query.filter_by(user_id=user_id, event_id=event_id).first()
    if not bm:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(bm)
    db.session.commit()
    return jsonify({"message": "Removed"})


@routes.get("/api/bookmarks")
@jwt_required()
def get_bookmarks():
    user_id = int(get_jwt_identity())
    results = Bookmark.query.filter_by(user_id=user_id).all()
    return jsonify([
        {
            "id": b.event.id,
            "sport": b.event.sport,
            "home_team": b.event.home_team,
            "away_team": b.event.away_team,
            "date": b.event.game_date.strftime("%Y-%m-%d"),
            "time": b.event.game_time.strftime("%I:%M %p"),
            "stadium_location": b.event.stadium_location,
            "image": b.event.image
        } for b in results
    ])


@routes.get("/api/interests/<int:event_id>")
def list_interests(event_id):
    rows = Interest.query.filter_by(event_id=event_id).all()
    return jsonify([
        {"user_id": r.user_id, "username": r.user.username}
        for r in rows
    ])


@routes.get("/api/interests/<int:event_id>/mine")
@jwt_required()
def mine(event_id):
    user_id = int(get_jwt_identity())
    exists = Interest.query.filter_by(user_id=user_id, event_id=event_id).first()
    return jsonify({"interested": exists is not None})


@routes.post("/api/interests/<int:event_id>")
@jwt_required()
def add_interest(event_id):
    user_id = int(get_jwt_identity())

    if Interest.query.filter_by(user_id=user_id, event_id=event_id).first():
        return jsonify({"message": "Already interested"}), 200

    db.session.add(Interest(user_id=user_id, event_id=event_id))
    db.session.commit()
    return jsonify({"message": "Marked interested"}), 201


@routes.delete("/api/interests/<int:event_id>")
@jwt_required()
def remove_interest(event_id):
    user_id = int(get_jwt_identity())
    row = Interest.query.filter_by(user_id=user_id, event_id=event_id).first()
    if not row:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(row)
    db.session.commit()
    return jsonify({"message": "Removed"})


from team_stats_data import team_stats

@routes.get("/api/team-stats/<sport>/<gender>")
def team_stats_route(sport, gender):
    result = team_stats.get(sport.lower(), {}).get(gender.lower())
    if not result:
        return jsonify({"error": "Not found"}), 404
    return jsonify(result)


@routes.get("/api/messages/<int:other_id>")
@jwt_required()
def get_conversation(other_id):
    me_id = int(get_jwt_identity())

    convo = Message.query.filter(
        or_(
            and_(Message.sender_id == me_id, Message.receiver_id == other_id),
            and_(Message.sender_id == other_id, Message.receiver_id == me_id),
        )
    ).order_by(Message.created_at.asc()).all()

    return jsonify([
        {
            "id": m.id,
            "sender_id": m.sender_id,
            "receiver_id": m.receiver_id,
            "content": m.content,
            "created_at": m.created_at.isoformat() + "Z"
        }
        for m in convo
    ])


@routes.post("/api/messages/<int:other_id>")
@jwt_required()
def send_message(other_id):
    me_id = int(get_jwt_identity())
    data = request.get_json() or {}
    content = data.get("content", "").strip()

    if not content:
        return jsonify({"error": "Message content required"}), 400

    msg = Message(sender_id=me_id, receiver_id=other_id, content=content)
    db.session.add(msg)
    db.session.commit()

    return jsonify({
        "id": msg.id,
        "sender_id": msg.sender_id,
        "receiver_id": msg.receiver_id,
        "content": msg.content,
        "created_at": msg.created_at.isoformat() + "Z"
    }), 201

@routes.get("/api/users/<int:user_id>")
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({ "id": user.id, "username": user.username })

@routes.get("/api/users")
def get_users():
    users = User.query.all()
    return jsonify([
        { "id": u.id, "username": u.username }
        for u in users
    ])

@routes.patch("/api/user/update")
@jwt_required()
def update_user():
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}

        new_username = data.get("username", "").strip()
        new_password = data.get("password", "").strip()

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Username update
        if new_username:
            exists = User.query.filter(
                User.username == new_username,
                User.id != user_id
            ).first()

            if exists:
                return jsonify({"error": "Username already taken"}), 400

            user.username = new_username

        # Password update
        if new_password:
            hashed = bcrypt.generate_password_hash(new_password).decode("utf-8")
            user.password = hashed

        db.session.commit()

        return jsonify({
            "message": "Profile updated",
            "username": user.username
        }), 200

    except Exception as e:
        print("PROFILE UPDATE ERROR:", e)
        return jsonify({"error": "Server error updating profile"}), 500

