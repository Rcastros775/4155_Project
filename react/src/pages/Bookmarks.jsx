import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import "./Bookmarks.css";

export default function Bookmarks() {
  const [bookmarked, setBookmarked] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token || token === "null" || token === "undefined") {
      setBookmarked([]);
      setLoading(false);
      return;
    }
    fetch("http://localhost:5000/api/bookmarks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setBookmarked(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
            <EventCard key={index} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
