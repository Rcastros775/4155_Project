import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EventCard from "../../components/EventCard";
import { getBookmarks } from "../../services/bookmarks";
import "./Bookmarks.css";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const loadBookmarks = () => {
    setLoading(true);
    getBookmarks()
      .then((data) => {
        setBookmarks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadBookmarks();
  }, [location.pathname]);

  return (
    <div className="bookmarks-page fade-up">
      <h1>Your Bookmarked Events</h1>

      {loading ? (
        <p>Loading...</p>
      ) : bookmarks.length === 0 ? (
        <p>You have no bookmarks yet.</p>
      ) : (
        <div className="bookmarks-grid">
          {bookmarks.map((event) => (
            <EventCard key={event.id} game={event} />
          ))}
        </div>
      )}
    </div>
  );
}
