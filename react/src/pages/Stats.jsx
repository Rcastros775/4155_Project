import { useState } from "react";
import "./statistics.css";

export default function Statistics() {
  const [gender, setGender] = useState("women");
  const [openAccordion, setOpenAccordion] = useState(null);
  const [activeTabs, setActiveTabs] = useState({});

  const sports = ["Baseball", "Basketball", "Football", "Soccer", "Tennis"];

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
            className={`accordion-item ${
              openAccordion === sport ? "active" : ""
            }`}
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
                {["quick", "details", "season", "new"].map((tab) => (
                  <button
                    key={tab}
                    className={`tab-btn ${
                      (activeTabs[sport] || "quick") === tab ? "active" : ""
                    }`}
                    onClick={() => changeTab(sport, tab)}
                  >
                    {tab === "quick"
                      ? "Quick Stats"
                      : tab === "details"
                      ? "Game Details"
                      : tab === "season"
                      ? "Season Stats"
                      : "New!"}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div
                className={`tab-content ${
                  (activeTabs[sport] || "quick") === "quick" ? "active" : ""
                }`}
              >
                <p>
                  <strong>Wins:</strong> 5
                </p>
                <p>
                  <strong>Losses:</strong> 2
                </p>
                <p>
                  <strong>Draw:</strong> 1
                </p>
              </div>
              <div
                className={`tab-content ${
                  (activeTabs[sport] || "quick") === "details" ? "active" : ""
                }`}
              >
                <p>
                  <strong>Total Points Scored:</strong> 60
                </p>
                <p>
                  <strong>Free Throws:</strong> 16
                </p>
              </div>
              <div
                className={`tab-content ${
                  (activeTabs[sport] || "quick") === "season" ? "active" : ""
                }`}
              >
                <p>Season stats go here...</p>
              </div>
              <div
                className={`tab-content ${
                  (activeTabs[sport] || "quick") === "new" ? "active" : ""
                }`}
              >
                <p><strong>Latest game details go here...</strong></p>
                <p>Lorem ipsum...</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
