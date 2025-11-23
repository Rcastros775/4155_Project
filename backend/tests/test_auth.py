def test_register(client):
    response = client.post("/api/register", json={
        "username": "john",
        "email": "john@example.com",
        "password": "pass"
    })
    assert response.status_code in [201, 400]

def test_login(client):
    client.post("/api/register", json={
        "username": "john",
        "email": "john@example.com",
        "password": "pass"
    })

    response = client.post("/api/login", json={
        "email": "john@example.com",
        "password": "pass"
    })

    assert response.status_code == 200
    assert "token" in response.get_json()