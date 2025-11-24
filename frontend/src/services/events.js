import { API } from "./config";

export async function getEvents() {
  const res = await fetch(`${API}/games`);
  return res.json();
}

export async function getEventById(id) {
  const res = await fetch(`${API}/games/${id}`);
  return res.json();
}
