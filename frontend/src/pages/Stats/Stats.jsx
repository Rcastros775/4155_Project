import { useEffect, useState } from "react";
import "./Stats.css";
import { SPORTS, getTeamStats } from "../../services/stats";
import GenderToggle from "../../components/GenderToggle";
import StatsAccordionItem from "../../components/StatsAccordionItem";

export default function Stats() {
  const [gender, setGender] = useState("women");
  const [openAccordion, setOpenAccordion] = useState(null);
  const [activeTabs, setActiveTabs] = useState({});
  const [teamStats, setTeamStats] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      const result = {};
      for (const sport of SPORTS) {
        const data = await getTeamStats(sport.toLowerCase(), gender);
        if (!cancelled) {
          result[sport] = data;
        }
      }
      if (!cancelled) setTeamStats(result);
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, [gender]);

  const toggleAccordion = (sport) => {
    setOpenAccordion(openAccordion === sport ? null : sport);
  };

  const changeTab = (sport, tab) => {
    setActiveTabs((prev) => ({ ...prev, [sport]: tab }));
  };

  return (
    <main className="stats-page">
      <section className="stats-hero">
        <h1 className="stats-title">Team Statistics</h1>
        <p className="stats-subtitle">
          Compare performance across sports and seasons for men’s and women’s
          teams.
        </p>
        <GenderToggle gender={gender} onChange={setGender} />
      </section>

      <section className="stats-accordion">
        {SPORTS.map((sport) => (
          <StatsAccordionItem
            key={sport}
            sport={sport}
            isOpen={openAccordion === sport}
            onToggle={() => toggleAccordion(sport)}
            stats={teamStats[sport]}
            activeTab={activeTabs[sport] || "quick"}
            onTabChange={(tab) => changeTab(sport, tab)}
          />
        ))}
      </section>
    </main>
  );
}
