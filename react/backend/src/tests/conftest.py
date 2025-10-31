import os, tempfile, pytest, sys
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app as flask_app, db, User, Event, Bookmark

@pytest.fixture()
def app():

    db_fd, db_path = tempfile.mkstemp(suffix=".db")
    flask_app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI=f"sqlite:///{db_path}",
        JWT_SECRET_KEY="test-secret",
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=1),
    )
    with flask_app.app_context():
        db.drop_all()
        db.create_all()

        e1 = Event(sport="Basketball", home_team="UNCC", away_team="Duke",
                   game_date=datetime(2025,10,5).date(), game_time=datetime.strptime("7:00 PM", "%I:%M %p").time(),
                   stadium_location="Dale F. Halton Arena", image="/static/Basketball.webp")
        e2 = Event(sport="Football", home_team="UNCC", away_team="Wake Forest",
                   game_date=datetime(2025,10,10).date(), game_time=datetime.strptime("6:30 PM", "%I:%M %p").time(),
                   stadium_location="Jerry Richardson Stadium", image="/static/football.jpg")
        e3 = Event(sport="Soccer", home_team="UNCC", away_team="ETSU",
                   game_date=datetime(2025,10,15).date(), game_time=datetime.strptime("5:00 PM", "%I:%M %p").time(),
                   stadium_location="Transamerica Field", image="/static/Soccer.png")
        db.session.add_all([e1, e2, e3])
        db.session.commit()
    yield flask_app
    os.close(db_fd); os.remove(db_path)

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def authed_user(app):
    """Create a user and return (user, token_str)."""
    with app.app_context():
        u = User(username="rip", email="rip@example.com", password="$2b$12$dummy")  
        db.session.add(u); db.session.commit()
        token = create_access_token(identity=str(u.id)) 
        return u, token