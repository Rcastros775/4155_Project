import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Events.css";

export default function Events() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [imageSize, setImageSize] = useState("medium");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/games")
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const uniqueLocations = ["All", ...new Set(games.map((game) => game.stadium_location))];

  const filteredGames = selectedLocation === "All" ? games : games.filter((game) => game.stadium_location === selectedLocation);

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
    setImageSize(e.target.value === "All" ? "medium" : "small");
    
  }

  const handleCardClick = (id) => {
    navigate(`/events/${id}`);
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
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="games">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="game-card"
              onClick={() => handleCardClick(game.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`http://localhost:5000${game.image}`}
                alt={game.sport}
                className="game-image"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "0.75rem",
                }}
              />
              <h2>
                {game.home_team} vs {game.away_team}
              </h2>
              <p>{game.sport}</p>
              <p>
                {game.date} @ {game.time}
              </p>
              <p>Stadium: {game.stadium_location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}