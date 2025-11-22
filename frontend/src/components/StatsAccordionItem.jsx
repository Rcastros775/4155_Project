import "./StatsAccordionItem.css";

export default function StatsAccordionItem({
  sport,
  isOpen,
  onToggle,
  stats,
  activeTab,
  onTabChange,
}) {
  const currentTab = activeTab || "quick";
  const hasData = Boolean(stats);

  const renderQuick = () => {
    if (!hasData) return <p className="stats-loading">Loading stats...</p>;
    return (
      <div className="stats-grid">
        <div className="stat-pill">
          <span className="stat-label">Wins</span>
          <span className="stat-value">{stats.wins}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-label">Losses</span>
          <span className="stat-value">{stats.losses}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-label">Points/Game</span>
          <span className="stat-value">{stats.points_per_game}</span>
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    if (!stats?.game_details)
      return <p className="stats-loading">Loading game details...</p>;
    const d = stats.game_details;

    if (sport === "Soccer") {
      return (
        <ul className="stats-list">
          <li>Shots on goal: {d.shots_on_goal_percentage}%</li>
          <li>Possession: {d.possession_percentage}%</li>
          <li>Pass accuracy: {d.pass_accuracy_percentage}%</li>
        </ul>
      );
    }

    if (sport === "Basketball") {
      return (
        <ul className="stats-list">
          <li>3PT percentage: {d.three_point_percentage}%</li>
          <li>Free-throw percentage: {d.free_throw_percentage}%</li>
        </ul>
      );
    }

    if (sport === "Football") {
      return (
        <ul className="stats-list">
          <li>Passing yards/game: {d.passing_yards_per_game}</li>
          <li>Rushing yards/game: {d.rushing_yards_per_game}</li>
          <li>Turnovers/game: {d.turnovers_per_game}</li>
        </ul>
      );
    }

    if (sport === "Baseball") {
      return (
        <ul className="stats-list">
          <li>Batting avg: {d.batting_average}</li>
          <li>On-base pct: {d.on_base_percentage}</li>
          <li>Slugging pct: {d.slugging_percentage}</li>
        </ul>
      );
    }

    if (sport === "Tennis") {
      return (
        <ul className="stats-list">
          <li>First-serve percentage: {d.first_serve_percentage}%</li>
          <li>Aces per match: {d.aces_per_match}</li>
          <li>Double faults per match: {d.double_faults_per_match}</li>
        </ul>
      );
    }

    return <p className="stats-loading">No details available.</p>;
  };

  const renderSeason = () => {
    if (!stats?.season_stats)
      return <p className="stats-loading">Loading season stats...</p>;
    const s = stats.season_stats;

    if (sport === "Soccer") {
      return (
        <ul className="stats-list">
          <li>Clean sheets: {s.clean_sheets}</li>
          <li>Goals scored: {s.goals_scored}</li>
          <li>Assists: {s.assists}</li>
          <li>Fouls committed: {s.fouls_committed}</li>
        </ul>
      );
    }

    if (sport === "Basketball") {
      return (
        <ul className="stats-list">
          <li>Rebounds/game: {s.rebounds_per_game}</li>
          <li>Assists/game: {s.assists_per_game}</li>
          <li>Steals/game: {s.steals_per_game}</li>
          <li>Blocks/game: {s.blocks_per_game}</li>
        </ul>
      );
    }

    if (sport === "Football") {
      return (
        <ul className="stats-list">
          <li>3rd down conversion: {s.third_down_conversion_rate}%</li>
          <li>Red-zone efficiency: {s.red_zone_efficiency}%</li>
          <li>Touchdowns: {s.touchdowns}</li>
          <li>Field goals made: {s.field_goals_made}</li>
        </ul>
      );
    }

    if (sport === "Baseball") {
      return (
        <ul className="stats-list">
          <li>Home runs: {s.home_runs}</li>
          <li>Batting avg: {s.batting_average}</li>
          <li>ERA: {s.earned_run_average}</li>
          <li>Fielding pct: {s.fielding_percentage}</li>
        </ul>
      );
    }

    if (sport === "Tennis") {
      return (
        <ul className="stats-list">
          <li>Matches won: {s.matches_won}</li>
          <li>Matches lost: {s.matches_lost}</li>
          <li>
            Break points converted: {s.break_points_converted_percentage}%
          </li>
          <li>Total aces: {s.total_aces}</li>
        </ul>
      );
    }

    return <p className="stats-loading">No season stats available.</p>;
  };

  return (
    <div className={`stats-accordion-item ${isOpen ? "open" : ""}`}>
      <button className="stats-accordion-header" onClick={onToggle}>
        <span>{sport}</span>
        <span className="chevron">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div className="stats-accordion-body">
          <div className="stats-tabs">
            <button
              className={`tab-btn ${currentTab === "quick" ? "active" : ""}`}
              onClick={() => onTabChange("quick")}
            >
              Quick Stats
            </button>
            <button
              className={`tab-btn ${currentTab === "details" ? "active" : ""}`}
              onClick={() => onTabChange("details")}
            >
              Game Details
            </button>
            <button
              className={`tab-btn ${currentTab === "season" ? "active" : ""}`}
              onClick={() => onTabChange("season")}
            >
              Season Stats
            </button>
          </div>

          <div className="tab-panel">
            {currentTab === "quick" && renderQuick()}
            {currentTab === "details" && renderDetails()}
            {currentTab === "season" && renderSeason()}
          </div>
        </div>
      )}
    </div>
  );
}
