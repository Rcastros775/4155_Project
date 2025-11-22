import "./EventDetailHeader.css";

export default function EventDetailHeader({ game }) {
  return (
    <>
      <div className="detail-header-card">
        <img
          src={`http://localhost:5000${game.image}`}
          alt={game.sport}
          className="detail-img"
        />

        <h1 className="detail-title">
          {game.home_team} vs {game.away_team}
        </h1>

        <p className="detail-sport">{game.sport}</p>

        <p className="detail-meta">
          <span>Date:</span> {game.date} @ {game.time} <br />
          <span>Venue:</span> {game.stadium_location}
        </p>
      </div>
    </>
  );
}
