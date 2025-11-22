import EventCard from "./EventCard";
import "./GamesGrid.css";

export default function GamesGrid({ games }) {
  if (!games || games.length === 0) {
    return <p>No games scheduled.</p>;
  }

  return (
    <div className="games-grid">
      {games.map((game) => (
        <EventCard key={game.id} game={game} />
      ))}
    </div>
  );
}
