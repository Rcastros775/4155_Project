import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  const [participants, setParticipants] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [interested, setInterested] = useState(false);

  const token = localStorage.getItem("token");

  // load game
  useEffect(() => {
    fetch(`http://localhost:5000/api/games/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setLoading(false);
      });
  }, [id]);

  // bookmark status
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/bookmarks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((list) => setBookmarked(list.some((e) => String(e.id) === String(id))));
  }, [id, token]);

  // interested status + participants count (lazy: only when opening modal or mounting)
  useEffect(() => {
    // current user interested?
    if (token) {
      fetch(`http://localhost:5000/api/interests/${id}/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((d) => setInterested(!!d.interested));
    }
    // prefetch list (optional)
    fetch(`http://localhost:5000/api/interests/${id}`)
      .then((r) => r.json())
      .then((list) => setParticipants(Array.isArray(list) ? list : []));
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

  const toggleInterested = () => {
    if (!token) return;
    const method = interested ? "DELETE" : "POST";
    fetch(`http://localhost:5000/api/interests/${id}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (!res.ok) return;
      setInterested(!interested);
      // refresh participant list to reflect change
      fetch(`http://localhost:5000/api/interests/${id}`)
        .then((r) => r.json())
        .then((list) => setParticipants(Array.isArray(list) ? list : []));
    });
  };

  const mapImages = {
    "Dale F. Halton Arena": "/static/UNCCHaltonArena.png",
    "Jerry Richardson Stadium": "/static/UNCCJerryRichardsonStadium.png",
    "Transamerica Field": "/static/UNCCTransAmericaField.png",
    "Irwin Belk Track and Field Center": "/static/UNCCTransAmericaField.png",
  };

  if (loading) return <p>Loading event details...</p>;
  if (!game) return <p>Event not found.</p>;

  return (
    <div className="event-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <h1>{game.home_team} vs {game.away_team}</h1>

      <img
        src={mapImages[game.stadium_location] || `http://localhost:5000${game.image}`}
        alt={game.sport}
        className="detail-image"
      />

      <p><strong>Sport:</strong> {game.sport}</p>
      <p><strong>Date:</strong> {game.date} @ {game.time}</p>
      <p><strong>Stadium:</strong> {game.stadium_location}</p>

      <div className="event-actions">
        <button className="btn interested-btn" onClick={() => setShowParticipants(true)}>
          Participants ({participants.length})
        </button>
        <button className="btn invite-btn" onClick={toggleInterested}>
          {interested ? "Not Interested" : "I'm Interested"}
        </button>
        <button className="btn" onClick={toggleBookmark}>
          {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
        </button>
      </div>

      {showParticipants && (
        <div className="modal-overlay" onClick={() => setShowParticipants(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Participants</h3>
            {participants.length === 0 ? (
              <p>No one yet. Be the first!</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
                {participants.map((p) => (
                  <li key={p.user_id} style={{ padding: "6px 0" }}>
                    {p.username}
                  </li>
                ))}
              </ul>
            )}
            <button className="close-btn" onClick={() => setShowParticipants(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
