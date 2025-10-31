import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";

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
      <section className="hero">
        <div className="hero-card">
          <h1>Niner Athletic Hub</h1>
          <p>All your favorite Charlotte sports in one place.</p>
        </div>
      </section>
      <h2> Games</h2>
      <div className="games">
        {loading ? (
          <p>Loading games...</p>
        ) : games.length > 0 ? (
          games.map((game, index) => (
            <EventCard key={index} game={game} index={index} />
          ))
        ) : (
          <p>No games scheduled.</p>
        )}
      </div>
    </div>
  );
}
