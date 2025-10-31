import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Events.css";

export default function Events() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleCardClick = (id) => {
    navigate(`/events/${id}`);
  };

  return (
    <div className="upcoming">
      <h1>Upcoming Events</h1>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="games">
          {games.map((game) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => handleCardClick(game.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`http://localhost:5000${game.image}`}
                alt={game.sport}
                className="game-image"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "0.75rem",
                }}
              />
              <h2>
                {game.home_team} vs {game.away_team}
              </h2>
              <p>{game.sport}</p>
              <p>
                {game.date} @ {game.time}
              </p>
              <p>Stadium: {game.stadium_location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}