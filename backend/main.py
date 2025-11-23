from flask import Flask
from flask_cors import CORS
from datetime import datetime
from backend.config import Config
from backend.database import db, bcrypt, jwt
from backend.models import Event
from backend.routes import routes

from backend.games_seed_data import games 

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(routes)

    with app.app_context():
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

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
