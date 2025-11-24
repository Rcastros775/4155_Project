import { API } from "./config";

export async function getBookmarks() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  const res = await fetch(`${API}/bookmarks`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return [];
  return await res.json();
}

export async function toggleBookmark(eventId, isBookmarked) {
  const token = localStorage.getItem("token");

  if (!token) {
    return { error: "No token stored" };
  }

  const method = isBookmarked ? "DELETE" : "POST";

  const res = await fetch(`${API}/bookmarks/${eventId}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  console.log("Bookmark response:", res.status, text);

  if (!res.ok) return { error: "Request failed" };

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}
