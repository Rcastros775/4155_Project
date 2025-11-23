import { apiFetch } from "./api";

export async function sendFriendRequest(receiver_id) {
  const res = await apiFetch("/api/friends/request", {
    method: "POST",
    body: JSON.stringify({ receiver_id }),
  });
  return res.json();
}

export async function listPendingRequests() {
  const res = await apiFetch("/api/friends/pending");
  return res.json();
}

export async function respondToRequest(friendship_id, action) {
  const res = await apiFetch("/api/friends/respond", {
    method: "POST",
    body: JSON.stringify({ friendship_id, action }),
  });
  return res.json();
}

export async function listFriends() {
  const res = await apiFetch("/api/friends");
  return res.json();
}

export async function removeFriend(other_user_id) {
  const res = await apiFetch(`/api/friends/${other_user_id}`, {
    method: "DELETE",
  });
  return res.json();
}
