import json

def register_and_login(client):
    client.post("/api/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "pass"
    })

    login = client.post("/api/login", json={
        "email": "test@example.com",
        "password": "pass"
    })

    return login.get_json()["token"]

def test_add_bookmark(client):
    token = register_and_login(client)

    response = client.post(
        "/api/bookmarks/1",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code in [200, 201]

def test_get_bookmarks(client):
    token = register_and_login(client)

    response = client.get(
        "/api/bookmarks",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.get_json(), list)