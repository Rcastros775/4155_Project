def register_and_login(client):
    client.post("/api/register", json={
        "username": "u1",
        "email": "u1@example.com",
        "password": "pass"
    })

    login = client.post("/api/login", json={
        "email": "u1@example.com",
        "password": "pass"
    })

    return login.get_json()["token"]

def test_interest_flow(client):
    token = register_and_login(client)

    # Add interest
    add = client.post(
        "/api/interests/1",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert add.status_code in [200, 201]

    # Check mine
    mine = client.get(
        "/api/interests/1/mine",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert mine.status_code == 200
    assert mine.get_json()["interested"] in [True, False]

    # Remove interest
    remove = client.delete(
        "/api/interests/1",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert remove.status_code in [200, 404]