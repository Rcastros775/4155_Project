def test_get_games(client):
    response = client.get("/api/games")

    assert response.status_code == 200
    data = response.get_json()

    assert isinstance(data, list)
    if len(data) > 0:
        assert "sport" in data[0]
        assert "home_team" in data[0]
        assert "date" in data[0]
        assert "time" in data[0]
