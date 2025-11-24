import { apiFetch } from "./api";

export async function sendFriendRequest(receiver_id) {
  return apiFetch("/api/friends/request", {
    method: "POST",
    body: JSON.stringify({ receiver_id }),
  });
}

export async function listPendingRequests() {
  return apiFetch("/api/friends/pending");
}

export async function respondToRequest(friendship_id, action) {
  return apiFetch("/api/friends/respond", {
    method: "POST",
    body: JSON.stringify({ friendship_id, action }),
  });
}

export async function listFriends() {
  return apiFetch("/api/friends");
}

export async function removeFriend(other_user_id) {
  return apiFetch(`/api/friends/${other_user_id}`, {
    method: "DELETE",
  });
}