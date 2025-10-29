import { useNavigate } from "react-router-dom";

export default function EventCard({ game, index }) {
  const navigate = useNavigate();

  return (
    <div
      key={index}
      className="event-icon"
      onClick={() => navigate(`/events/${game.id}`)}
    >
      <img
        src={`http://localhost:5000${game.image}`}
        alt="Game"
        className="game-image"
      />
      <p>
        {game.home_team} vs {game.away_team}
      </p>
      <small>{game.date}</small>
    </div>
  );
}
