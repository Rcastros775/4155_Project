const API = import.meta.env.VITE_API_URL;

export const SPORTS = [
  "Basketball",
  "Football",
  "Soccer",
  "Baseball",
  "Tennis",
];

export async function getTeamStats(sport, gender) {
  const res = await fetch(`${API}/team-stats/${sport}/${gender}`);
  if (!res.ok) return null;
  return await res.json();
}
