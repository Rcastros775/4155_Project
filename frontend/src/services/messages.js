import { API } from "./config";

function getToken() {
  return localStorage.getItem("token");
}

export async function fetchConversation(otherId) {
  const token = getToken();
  if (!token) return { ok: false, messages: [], error: "Not logged in" };

  const res = await fetch(`${API}/messages/${otherId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return {
      ok: false,
      messages: [],
      error: err.error || "Failed to load messages",
    };
  }

  const data = await res.json();
  return { ok: true, messages: data };
}

export async function sendMessage(otherId, content) {
  const token = getToken();
  if (!token) return { ok: false, error: "Not logged in" };

  const res = await fetch(`${API}/messages/${otherId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  const data = await res.json().catch(() => ({}));

  return { ok: res.ok, ...data };
}
