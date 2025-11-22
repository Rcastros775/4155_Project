import { useState, useEffect } from "react";
import { getEvents } from "../../services/events";
import GamesGrid from "../../components/GamesGrid";
import "./Events.css";

export default function Events() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState("All");

  useEffect(() => {
    getEvents()
      .then((data) => setGames(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const uniqueLocations = [
    "All",
    ...new Set(games.map((g) => g.stadium_location)),
  ];

  const filteredGames =
    selectedLocation === "All"
      ? games
      : games.filter((g) => g.stadium_location === selectedLocation);

  const now = new Date();
  const asDateTime = (g) => new Date(`${g.date} ${g.time}`);

  const upcomingGames = filteredGames
    .filter((g) => asDateTime(g) >= now)
    .sort((a, b) => asDateTime(a) - asDateTime(b));

  const pastGames = filteredGames
    .filter((g) => asDateTime(g) < now)
    .sort((a, b) => asDateTime(b) - asDateTime(a));

  return (
    <div className="events-page">
      <h1 className="events-title">Events</h1>

      <div className="filter-bar">
        <label>Filter by Location:</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="filter-dropdown"
        >
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading games...</p>
      ) : (
        <>
          <section className="events-section">
            <h2 className="section-title upcoming">Upcoming Games</h2>
            {upcomingGames.length > 0 ? (
              <GamesGrid games={upcomingGames} />
            ) : (
              <p className="empty-msg">No upcoming games.</p>
            )}
          </section>

          <section className="events-section">
            <h2 className="section-title past">Past Games</h2>
            {pastGames.length > 0 ? (
              <GamesGrid games={pastGames} />
            ) : (
              <p className="empty-msg">No past games.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
