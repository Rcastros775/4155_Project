import { useState, useEffect } from "react";

export default function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="upcoming">
      <h1>Niner Athletic Hub</h1>
      <h2>Upcoming Games</h2>
      <div className="games">
        {loading ? (
          <p>Loading games...</p>
        ) : games.length > 0 ? (
          games.map((game, index) => (
            <div key={index} className="game-card">
              <strong>{game.home_team}</strong> vs{" "}
              <strong>{game.away_team}</strong>
              <div>
                {game.date} @ {game.time}
              </div>
            </div>
          ))
        ) : (
          <p>No games scheduled.</p>
        )}
      </div>
    </div>
  );
}
