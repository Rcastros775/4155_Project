import { useState, useEffect } from "react";
import "./Events.css";

export default function Events() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

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
    <>
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
                <img
                  src={`http://localhost:5000${game.image}`}
                  alt="Game"
                  className="game-image"
                />
                <p>{game.home_team} vs {game.away_team}</p>
                <small>{game.date}</small>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedGame && (
        <div className="modal-overlay" onClick={() => setSelectedGame(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedGame.home_team} vs {selectedGame.away_team}</h2>
            <p>{selectedGame.date} @ {selectedGame.time}</p>
            <img
              src={`http://localhost:5000${selectedGame.image}`}
              alt="Game"
              className="modal-image"
            />
            <div className="modal-actions">
              <button className="btn interested-btn">I'm Interested</button>
              <button className="btn invite-btn">Invite Friends</button>
            </div>
            <button className="close-btn" onClick={() => setSelectedGame(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}