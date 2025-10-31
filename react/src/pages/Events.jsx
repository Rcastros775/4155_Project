import { useState, useEffect } from "react";
import "./Events.css";
import EventCard from "../components/EventCard";

export default function Events() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [imageSize, setImageSize] = useState("medium");

  useEffect(() => {
    fetch("http://localhost:5000/api/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const uniqueLocations = [
    "All",
    ...new Set(games.map((game) => game.stadium_location)),
  ];

  const filteredGames =
    selectedLocation === "All"
      ? games
      : games.filter((game) => game.stadium_location === selectedLocation);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setImageSize(e.target.value === "All" ? "medium" : "small");
  };

  return (
    <div className="upcoming">
      <h1>Upcoming Events</h1>

      <div className="dropdown-container">
        <label htmlFor="locationDropdown">Filter by Location: </label>
        <select
          id="locationDropdown"
          value={selectedLocation}
          onChange={handleLocationChange}
        >
          {uniqueLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="games">
          {filteredGames.map((game, index) => (
            <EventCard key={index} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
