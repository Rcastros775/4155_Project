export async function getEvents() {
  const res = await fetch("http://localhost:5000/api/games");
  return res.json();
}

export async function getEventById(id) {
  const res = await fetch(`http://localhost:5000/api/games/${id}`);
  return res.json();
}
