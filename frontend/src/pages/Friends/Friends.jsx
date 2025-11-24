import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listFriends,
  listPendingRequests,
  respondToRequest,
  sendFriendRequest,
  removeFriend,
} from "../../services/friends";
import "./Friends.css";

const API = import.meta.env.VITE_API_URL;

export default function Friends() {
  const [friends, setFriends] = useState([]);
  const [pending, setPending] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    refreshAll();
  }, []);

  async function refreshAll() {
    setLoading(true);
    try {
      const [friendsRes, pendingRes] = await Promise.all([
        listFriends(),
        listPendingRequests(),
      ]);
      setFriends(Array.isArray(friendsRes) ? friendsRes : []);
      setPending(Array.isArray(pendingRes) ? pendingRes : []);
    } catch (e) {
      console.error("Error loading friends:", e);
    } finally {
      setLoading(false);
    }
  }

  async function onAccept(friendship_id) {
    await respondToRequest(friendship_id, "accept");
    refreshAll();
  }

  async function onDecline(friendship_id) {
    await respondToRequest(friendship_id, "decline");
    refreshAll();
  }

  async function onRemove(user_id) {
    if (!window.confirm("Remove friend?")) return;
    await removeFriend(user_id);
    refreshAll();
  }

  async function onSearch(e) {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API}/users?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${localStorage.getItem("token")}` || undefined,
          },
        }
      );

      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error", err);
      setSearchResults([]);
    }
  }

  async function onSendRequest(user_id) {
    await sendFriendRequest(user_id);
    refreshAll();
  }

  if (loading) return <div className="friends-page">Loading...</div>;

  return (
    <div className="friends-page">
      <header className="friends-header">
        <h2>Friends Portal</h2>
        <p>
          Connect with other Niners, see who's going to games, and build your
          own athletic community.
        </p>
        <button className="find-friends-btn">Find New Friends</button>
      </header>

      <section className="friends-section">
        <h3>Pending Requests</h3>
        {pending.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          <ul className="pending-list">
            {pending.map((p) => (
              <li key={p.friendship_id} className="request-item">
                <span>{p.requester_username || "Unknown"}</span>
                <div className="pending-actions">
                  <button
                    className="accept-btn"
                    onClick={() => onAccept(p.friendship_id)}
                  >
                    Accept
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => onDecline(p.friendship_id)}
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="friends-section">
        <h3>My Friends</h3>
        {friends.length === 0 ? (
          <p>No friends yet</p>
        ) : (
          <ul className="friends-list">
            {friends.map((f) => (
              <li key={f.friendship_id} className="friend-item">
                <span className="friend-name">{f.username}</span>
                <div className="friend-actions">
                  <button
                    className="message-btn"
                    onClick={() => navigate(`/messages/${f.user_id}`)}
                  >
                    Message
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => onRemove(f.user_id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="friends-section">
        <h3>Add / Search Users</h3>
        <form onSubmit={onSearch}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search username or email"
          />
          <button type="submit">Search</button>
        </form>

        <ul className="search-results">
          {searchResults.map((u) => (
            <li key={u.id}>
              <span>{u.username}</span>
              <button
                className="send-request-btn"
                onClick={() => onSendRequest(u.id)}
              >
                Send Request
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
