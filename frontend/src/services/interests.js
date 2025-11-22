const API = "http://localhost:5000/api";

export async function getInterestStatus(eventId) {
  const token = localStorage.getItem("token");
  if (!token) return { interested: false };

  const res = await fetch(`${API}/interests/${eventId}/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return await res.json();
}

export async function toggleInterest(eventId, currentStatus) {
  const token = localStorage.getItem("token");
  if (!token) return { error: "Not logged in" };

  const method = currentStatus ? "DELETE" : "POST";

  const res = await fetch(`${API}/interests/${eventId}`, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return { error: true };

  return { success: true };
}

export async function getParticipants(eventId) {
  const res = await fetch(`${API}/interests/${eventId}`);
  return await res.json();
}
