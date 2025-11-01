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
        console.log("Fetched data:", data);  // This will log the data received from the server
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
                    className={`tab-btn ${
                      (activeTabs[sport] || "quick") === tab ? "active" : ""
                    }`}
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
                {teamStats[sport]?.["game details"] ? (
                  <>
                    {sport === "Soccer" && (
                      <>
                        <p><strong>Shots on Goal Percentage:</strong> {teamStats[sport]["game details"]?.shots_on_goal_percentage}%</p>
                        <p><strong>Possession Percentage:</strong> {teamStats[sport]["game details"]?.possession_percentage}%</p>
                        <p><strong>Pass Accuracy Percentage:</strong> {teamStats[sport]["game details"]?.pass_accuracy_percentage}%</p>
                      </>
                    )}

                    {sport === "Basketball" && (
                      <>
                        <p><strong>Three-Point Percentage:</strong> {teamStats[sport]["game details"]?.three_point_percentage}%</p>
                        <p><strong>Free-Throw Percentage:</strong> {teamStats[sport]["game details"]?.free_throw_percentage}%</p>
                      </>
                    )}

                    {sport === "Football" && (
                      <>
                        <p><strong>Passing Yards Per Game:</strong> {teamStats[sport]["game details"]?.passing_yards_per_game}</p>
                        <p><strong>Rushing Yards Per Game:</strong> {teamStats[sport]["game details"]?.rushing_yards_per_game}</p>
                        <p><strong>Turnovers Per Game:</strong> {teamStats[sport]["game details"]?.turnovers_per_game}</p>
                      </>
                    )}

                    {sport === "Baseball" && (
                      <>
                        <p><strong>Batting Average:</strong> {teamStats[sport]["game details"]?.batting_average}</p>
                        <p><strong>On Base Percentage:</strong> {teamStats[sport]["game details"]?.on_base_percentage}</p>
                        <p><strong>Slugging Percentage:</strong> {teamStats[sport]["game details"]?.slugging_percentage}</p>
                      </>
                    )}

                    {sport === "Tennis" && (
                      <>
                        <p><strong>First Serve Percentage:</strong> {teamStats[sport]["game details"]?.first_serve_percentage}%</p>
                        <p><strong>Aces Per Match:</strong> {teamStats[sport]["game details"]?.aces_per_match}</p>
                        <p><strong>Double Faults Per Match:</strong> {teamStats[sport]["game details"]?.double_faults_per_match}</p>
                      </>
                    )}
                  </>
                ) : (
                  <p>Loading game details...</p>
                )}
              </div>


              <div
                className={`tab-content ${(activeTabs[sport] || "quick") === "season" ? "active" : ""}`}
              >
                {teamStats[sport]?.["season stats"] ? (
                  <>
                    {sport === "Soccer" && (
                      <>
                        <p><strong>Clean Sheets:</strong> {teamStats[sport]["season stats"]?.clean_sheets}</p>
                        <p><strong>Goals Scored:</strong> {teamStats[sport]["season stats"]?.goals_scored}</p>
                        <p><strong>Assists:</strong> {teamStats[sport]["season stats"]?.assists}</p>
                        <p><strong>Fouls Committed:</strong> {teamStats[sport]["season stats"]?.fouls_committed}</p>
                      </>
                    )}

                    {sport === "Basketball" && (
                      <>
                        <p><strong>Rebounds Per Game:</strong> {teamStats[sport]["season stats"]?.rebounds_per_game}</p>
                        <p><strong>Assists Per Game:</strong> {teamStats[sport]["season stats"]?.assists_per_game}</p>
                        <p><strong>Steals Per Game:</strong> {teamStats[sport]["season stats"]?.steals_per_game}</p>
                        <p><strong>Blocks Per Game:</strong> {teamStats[sport]["season stats"]?.blocks_per_game}</p>
                      </>
                    )}

                    {sport === "Football" && (
                      <>
                        <p><strong>Third Down Conversion Rate:</strong> {teamStats[sport]["season stats"]?.third_down_conversion_rate}%</p>
                        <p><strong>Red Zone Efficiency:</strong> {teamStats[sport]["season stats"]?.red_zone_efficiency}%</p>
                        <p><strong>Touchdowns:</strong> {teamStats[sport]["season stats"]?.touchdowns}</p>
                        <p><strong>Field Goals Made:</strong> {teamStats[sport]["season stats"]?.field_goals_made}</p>
                      </>
                    )}

                    {sport === "Baseball" && (
                      <>
                        <p><strong>Home Runs:</strong> {teamStats[sport]["season stats"]?.home_runs}</p>
                        <p><strong>Batting Average:</strong> {teamStats[sport]["season stats"]?.batting_average}</p>
                        <p><strong>Earned Run Average:</strong> {teamStats[sport]["season stats"]?.earned_run_average}</p>
                        <p><strong>Fielding Percentage:</strong> {teamStats[sport]["season stats"]?.fielding_percentage}</p>
                      </>
                    )}

                    {sport === "Tennis" && (
                      <>
                        <p><strong>Matches Won:</strong> {teamStats[sport]["season stats"]?.matches_won}</p>
                        <p><strong>Matches Lost:</strong> {teamStats[sport]["season stats"]?.matches_lost}</p>
                        <p><strong>Break Points Converted Percentage:</strong> {teamStats[sport]["season stats"]?.break_points_converted_percentage}%</p>
                        <p><strong>Total Aces:</strong> {teamStats[sport]["season stats"]?.total_aces}</p>
                      </>
                    )}
                  </>
                ) : (
                  <p>Season stats are not available or still loading...</p>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
