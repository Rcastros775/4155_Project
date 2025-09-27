import { useState, useEffect } from "react";

export default function Bookmarks() {
  const [bookmarked, setBookmarked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    // Fetch bookmarked games from your backend
    fetch("http://localhost:5000/api/games")
      .then((res) => res.json())
      .then((data) => {
        setBookmarked(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bookmarked-page">
      <h1>Bookmarked Games</h1>

      {loading ? (
        <p>Loading bookmarks...</p>
      ) : bookmarked.length === 0 ? (
        <p>No games bookmarked yet.</p>
      ) : (
        <div className="event-grid">
          {bookmarked.map((game, index) => (
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
