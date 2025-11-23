import { useState, useEffect } from "react";
import { getEvents } from "../../services/events";
import GamesGrid from "../../components/GamesGrid";
import "./Events.css";

export default function Events() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedSort, setSelectedSort] = useState("All");

  useEffect(() => {
    getEvents()
      .then((data) => setGames(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  const filteredByLocation =
    selectedLocation === "All"
      ? games
      : games.filter((g) => g.stadium_location === selectedLocation);

  const now = new Date();
  const asDateTime = (g) => new Date(`${g.date} ${g.time}`);

  const sortedGames = filteredByLocation.filter((g) => {
    if (selectedSort === "all") return true;
    if (selectedSort === "upcoming") return asDateTime(g) >= now;
    if (selectedSort === "past") return asDateTime(g) < now;

    if (selectedSort === "football") return g.sport.toLowerCase() === "football";
    if (selectedSort === "basketball") return g.sport.toLowerCase() === "basketball";
    if (selectedSort === "soccer") return g.sport.toLowerCase() === "soccer";

    return true;
  });

  const finalGames =
    selectedSort === "past"
      ? sortedGames.sort((a, b) => asDateTime(b) - asDateTime(a))
      : sortedGames.sort((a, b) => asDateTime(a) - asDateTime(b));
      
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
        <label>Sort by:</label>
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">All</option>
          
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>

          <option value="football">Football</option>
          <option value="basketball">Basketball</option>
          <option value="soccer">Soccer</option>
        </select>
      </div>
      {loading ? (
        <p className="loading">Loading games...</p>
      ) : (
        <>
          <section className="events-section">
            <h2 className="section-title">
              {selectedSort.charAt(0).toUpperCase() + selectedSort.slice(1)} Games
            </h2>
            {finalGames.length > 0 ? (
              <GamesGrid games={finalGames} />
            ) : (
              <p className="empty-msg">No games match this category.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
