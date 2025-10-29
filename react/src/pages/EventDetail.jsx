import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/games/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGame(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [id]);

  if (loading) return <p>Loading event...</p>;
  if (!game) return <p>Event not found.</p>;

  return (
    <div className="event-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h1>
        {game.home_team} vs {game.away_team}
      </h1>
      <p>
        {game.date} @ {game.time}
      </p>

      <img
        src={`http://localhost:5000${game.image}`}
        alt="Game"
        className="detail-image"
      />

      <div className="event-actions">
        <button className="btn interested-btn">I'm Interested</button>
        <button className="btn invite-btn">Invite Friends</button>
      </div>
    </div>
  );
}
