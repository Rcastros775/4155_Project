def test_events_api(client):
    response = client.get("/api/games")
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)