const API = import.meta.env.VITE_API_URL;

export async function getEvents() {
  const res = await fetch(`${API}/api/games`);
  return res.json();
}

export async function getEventById(id) {
  const res = await fetch(`${API}/api/games/${id}`);
  return res.json();
}
