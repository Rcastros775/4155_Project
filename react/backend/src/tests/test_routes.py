#Route TESTING

def test_list_games(client):
    r = client.get("/api/games")
    assert r.status_code == 200
    data = r.get_json()
    assert len(data) == 3
    assert {"id","sport","home_team","away_team","date","time","stadium_location","image"} <= set(data[0])

def test_get_game_by_id(client):
    r = client.get("/api/games/1")
    assert r.status_code == 200
    assert r.get_json()["home_team"] == "UNCC"

def test_get_bookmarks_requires_auth(client):
    r = client.get("/api/bookmarks")
    assert r.status_code in (401, 422)  # jwt missing/invalid

def test_add_and_list_bookmark(client, app, authed_user):
    user, token = authed_user

    # add
    r = client.post("/api/bookmarks/1", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code in (200, 201)

    # list
    r2 = client.get("/api/bookmarks", headers={"Authorization": f"Bearer {token}"})
    assert r2.status_code == 200
    bms = r2.get_json()
    assert len(bms) == 1
    assert bms[0]["id"] == 1  # event id

def test_remove_bookmark(client, authed_user):
    _, token = authed_user
    client.post("/api/bookmarks/2", headers={"Authorization": f"Bearer {token}"})
    r = client.delete("/api/bookmarks/2", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    r2 = client.get("/api/bookmarks", headers={"Authorization": f"Bearer {token}"})
    assert r2.get_json() == []

def test_register_and_login(client, app):
    # register
    r = client.post("/api/register", json={"username":"u1","email":"u1@x.com","password":"pw"})
    assert r.status_code == 201

    # login for token
    r2 = client.post("/api/login", json={"email":"u1@x.com","password":"pw"})