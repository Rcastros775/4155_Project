import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:5000/api/games/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/bookmarks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((list) => {
        setBookmarked(list.some((e) => String(e.id) === String(id)));
      });
  }, [id, token]);

  const toggleBookmark = () => {
    if (!token) return;
    const method = bookmarked ? "DELETE" : "POST";
    fetch(`http://localhost:5000/api/bookmarks/${id}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.ok) setBookmarked(!bookmarked);
    });
  };

  if (loading) return <p>Loading event details...</p>;
  if (!game) return <p>Event not found.</p>;

  const mapImages = {
    "Dale F. Halton Arena": "/static/UNCCHaltonArena.png",
    "Jerry Richardson Stadium": "/static/UNCCJerryRichardsonStadium.png",
    "Transamerica Field": "/static/UNCCTransAmericaField.png",
    "Irwin Belk Track and Field Center": "/static/UNCCTransAmericaField.png",
  };

  return (
    <div className="event-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>
        {game.home_team} vs {game.away_team}
      </h1>

      <img
        src={
          mapImages[game.stadium_location] ||
          `http://localhost:5000${game.image}`
        }
        alt={game.sport}
        className="detail-image"
      />

      <p>
        <strong>Sport:</strong> {game.sport}
      </p>
      <p>
        <strong>Date:</strong> {game.date} @ {game.time}
      </p>
      <p>
        <strong>Stadium:</strong> {game.stadium_location}
      </p>

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
