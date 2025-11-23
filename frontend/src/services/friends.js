import { apiFetch } from "./api";

export function sendFriendRequest(receiver_id) {
  return apiFetch(`/friends/request`, {
    method: "POST",
    body: JSON.stringify({ receiver_id }),
  });
}

export function listPendingRequests() {
  return apiFetch(`/friends/pending`);
}

export function respondToRequest(friendship_id, action) {
  return apiFetch(`/friends/respond`, {
    method: "POST",
    body: JSON.stringify({ friendship_id, action }),
  });
}

export function listFriends() {
  return apiFetch(`/friends`);
}

export function removeFriend(other_user_id) {
  return apiFetch(`/friends/${other_user_id}`, { method: "DELETE" });
}