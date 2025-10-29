import { useState, useEffect } from "react";
import "./Events.css";
import EventCard from "../components/EventCard";

export default function Events() {
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
    <>
      <div className="events-page">
        <h1>Upcoming Events</h1>

        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div className="event-grid">
            {games.map((game, index) => (
              <EventCard key={index} game={game} index={index} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
