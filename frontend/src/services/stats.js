import { API } from "./config";

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
