import { useEffect, useState } from "react";
import "./statistics.css";

export default function Statistics() {
  const [gender, setGender] = useState("women");
  const [openAccordion, setOpenAccordion] = useState(null);
  const [activeTabs, setActiveTabs] = useState({});
  const [teamStats, setTeamStats] = useState({});

  const sports = ["Basketball", "Football", "Soccer", "Baseball", "Tennis"];

  useEffect(() => {
    sports.forEach((sport) => {
      fetch(`http://localhost:5000/api/team-stats/${sport.toLowerCase()}/${gender}`)
        .then((res) => res.json())
        .then((data) => {
          setTeamStats((prevStats) => ({
            ...prevStats,
            [sport]: data, 
          }));
        })
        .catch((err) => console.error("Error fetching team stats:", err));
    });
  }, [gender]);

  const toggleAccordion = (sport) => {
    setOpenAccordion(openAccordion === sport ? null : sport);
  };

  const changeTab = (sport, tab) => {
    setActiveTabs({ ...activeTabs, [sport]: tab });
  };

  return (
    <main className="statistics-page">
      {/* Gender toggle */}
      <div className="gender-toggle">
        <button
          className={`gender-btn ${gender === "women" ? "active" : ""}`}
          onClick={() => setGender("women")}
        >
          Women’s
        </button>
        <button
          className={`gender-btn ${gender === "men" ? "active" : ""}`}
          onClick={() => setGender("men")}
        >
          Men’s
        </button>
      </div>

      {/* Accordion */}
      <div className="accordion">
        {sports.map((sport) => (
          <div
            key={sport}
            className={`accordion-item ${openAccordion === sport ? "active" : ""}`}
          >
            <button
              className="accordion-header"
              onClick={() => toggleAccordion(sport)}
            >
              {sport}
            </button>
            <div className="accordion-content">
              {/* Tabs */}
              <div className="tabs">
                {["quick", "details", "season"].map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${ (activeTabs[sport] || "quick") === tab ? "active" : "" }`}
                    onClick={() => changeTab(sport, tab)}
                  >
                    {tab === "quick"
                      ? "Quick Stats"
                      : tab === "details"
                      ? "Game Details"
                      : "Season Stats"}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div
                className={`tab-content ${(activeTabs[sport] || "quick") === "quick" ? "active" : ""}`}
              >
                {teamStats[sport] ? (
                  <>
                    <p><strong>Wins:</strong> {teamStats[sport]?.wins}</p>
                    <p><strong>Losses:</strong> {teamStats[sport]?.losses}</p>
                    <p><strong>Points Per Game:</strong> {teamStats[sport]?.points_per_game}</p>
                  </>
                ) : (
                  <p>Loading stats...</p>
                )}
              </div>
              <div
                className={`tab-content ${(activeTabs[sport] || "quick") === "details" ? "active" : ""}`}
              >
                <p><strong>Total Points Scored:</strong> 60</p>
                <p><strong>Free Throws:</strong> 16</p>
              </div>
              <div
                className={`tab-content ${(activeTabs[sport] || "quick") === "season" ? "active" : ""}`}
              >
                <p>Season stats go here...</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
