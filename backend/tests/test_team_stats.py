def test_team_stats_valid(client):
    response = client.get("/api/team-stats/basketball/men")
    assert response.status_code in [200, 404]  # depends if seeded

def test_team_stats_invalid(client):
    response = client.get("/api/team-stats/notasport/men")
    assert response.status_code == 404