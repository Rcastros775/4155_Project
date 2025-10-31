import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
      fetch(`http://localhost:5000/api/games/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setGame(data);
          setLoading(false);
        });
    }, [id]);

  useEffect(() => {
    const token = getToken();
    if (!token || token === "null" || token === "undefined") return;

    fetch("http://localhost:5000/api/bookmarks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => setBookmarked(list.some((e) => String(e.id) === String(id))));
  }, [id]);

  const toggleBookmark = () => {
    const token = getToken();
    if (!token || token === "null" || token === "undefined") {
      navigate("/login");
      return;
    }
    const method = bookmarked ? "DELETE" : "POST";
    fetch(`http://localhost:5000/api/bookmarks/${id}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) setBookmarked(!bookmarked);
    });
  };

  if (loading) return <p>Loading event...</p>;
  if (!game) return <p>Event not found.</p>;

  return (
    <div className="event-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <h1>{game.home_team} vs {game.away_team}</h1>
      <p>{game.sport}</p>
      <p>{game.date} @ {game.time}</p>
      <p>Stadium: {game.stadium_location}</p>

      <img
        src={`http://localhost:5000${game.image}`}
        alt="Game"
        className="detail-image"
      />

      <div className="event-actions">
        <button className="btn interested-btn">I'm Interested</button>
        <button className="btn invite-btn">Invite Friends</button>
        <button className="btn" onClick={toggleBookmark}>
          {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
        </button>
      </div>
    </div>
  );
}