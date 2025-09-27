import { useState, useEffect } from "react";

export default function Events() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null); // track selected game

  useEffect(() => {
    fetch("http://localhost:5000/api/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);
  return (
    <div className="events-page">
      <h1>Upcoming Events</h1>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="event-grid">
          {games.map((game, index) => (
            <div
              key={index}
              className="event-icon"
              onClick={() => setSelectedGame(game)}
            >
              <div className="event-logo">
                <img
                  src={`http://localhost:5000${game.image}`}
                  alt="Game"
                  className="game-image"
                />
              </div>
              <p>
                {game.home_team} vs {game.away_team}
              </p>
              <small>{game.date}</small>
            </div>
          ))}
        </div>
      )}

      {/* Detail card */}
      {selectedGame && (
        <div className="event-detail">
          <h2>
            {selectedGame.home_team} VS {selectedGame.away_team}
          </h2>
          <p>
            {selectedGame.date} @ {selectedGame.time}
          </p>
          <button onClick={() => setSelectedGame(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
