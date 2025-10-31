import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
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

  if (loading) return <p>Loading event details...</p>;
  if (!game) return <p>Event not found.</p>;

  const mapImages = {
    "Dale F. Halton Arena": "/static/UNCCHaltonArena.png",
    "Jerry Richardson Stadium": "/static/UNCCJerryRichardsonStadium.png",
    "Irwin Belk Track and Field Center": "/static/UNCCTransAmericaField.png",
  };



  return (
    <div className="event-detail">
      <Link to="/events" className="back-button">
        ← Back to Events
      </Link>

      <h1>
        {game.home_team} vs {game.away_team}
      </h1>
      <img
         src={mapImages[game.stadium_location] || `http://localhost:5000${game.image}`}
        alt={game.sport}
        className="event-detail-image"
      />
      <p><strong>Sport:</strong> {game.sport}</p>
      <p><strong>Date:</strong> {game.date} @ {game.time}</p>
      <p><strong>Stadium:</strong> {game.stadium_location}</p>
      <p><strong>Description:</strong> {game.description || "No description available."}</p>
    </div>
  );
}
