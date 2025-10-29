import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";

export default function Bookmarks() {
  const [bookmarked, setBookmarked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
            <EventCard key={index} game={game} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
