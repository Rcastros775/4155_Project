import { useNavigate } from "react-router-dom";
import "./EventCard.css";

export default function EventCard({ game }) {
  const navigate = useNavigate();

  return (
    <div className="event-card" onClick={() => navigate(`/events/${game.id}`)}>
      <img
        src={`http://localhost:5000${game.image}`}
        alt={`${game.home_team} vs ${game.away_team}`}
        loading="lazy"
        className="event-card-img"
      />

      <div className="event-card-body">
        <h3>
          {game.home_team} vs {game.away_team}
        </h3>

        <p>
          <strong>{game.sport}</strong>
        </p>

        <p>
          {game.date} @ {game.time}
        </p>

        <p>
          <strong>Stadium:</strong> {game.stadium_location}
        </p>
      </div>
    </div>
  );
}
