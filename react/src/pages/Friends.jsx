import { useState } from "react";
import "./Friends.css";

const MOCK_FRIENDS = [
  { id: 1, name: "User 1", sport: "Basketball", year: "Junior" },
  { id: 2, name: "User 2", sport: "Soccer", year: "Sophomore" },
  { id: 3, name: "User 3", sport: "Football", year: "Senior" },
];

const MOCK_REQUESTS = [
  { id: 4, name: "User 1", sport: "Volleyball" },
  { id: 5, name: "User 2", sport: "Tennis" },
];

export default function Friends() {
  const [friends] = useState(MOCK_FRIENDS);
  const [requests] = useState(MOCK_REQUESTS);

  return (
    <div className="friends-page">
      {/* Hero with faded image */}
      <section className="friends-hero">
        <div className="friends-hero-overlay">
          <h1 className="friends-hero-title">Friends Portal</h1>
          <p className="friends-hero-text">
            Connect with other Niners, see who’s going to games, and build your own athletic community.
          </p>
          <button
            className="friends-btn friends-btn-primary"
            onClick={() => console.log("Open friend search (future)")}
          >
            Find New Friends
          </button>
        </div>
      </section>

      {/* Main content */}
      <section className="friends-content">
        {/* Pending requests */}
        <div className="friends-column">
          <h2 className="friends-section-title">Pending Requests</h2>
          {requests.length === 0 ? (
            <p className="friends-empty-text">No pending requests right now.</p>
          ) : (
            <ul className="friends-list">
              {requests.map((req) => (
                <li key={req.id} className="friends-card">
                  <div>
                    <div className="friends-name">{req.name}</div>
                    <div className="friends-subtext">{req.sport}</div>
                  </div>
                  <div className="friends-buttons">
                    <button
                      className="friends-btn friends-btn-small friends-btn-primary"
                      onClick={() =>
                        console.log("Accept friend request:", req.id)
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="friends-btn friends-btn-small friends-btn-secondary"
                      onClick={() =>
                        console.log("Decline friend request:", req.id)
                      }
                    >
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* My friends */}
        <div className="friends-column">
          <h2 className="friends-section-title">My Friends</h2>
          {friends.length === 0 ? (
            <p className="friends-empty-text">
              You don’t have any friends yet. Use “Find New Friends” to start
              connecting.
            </p>
          ) : (
            <ul className="friends-list">
              {friends.map((friend) => (
                <li key={friend.id} className="friends-card">
                  <div>
                    <div className="friends-name">{friend.name}</div>
                    <div className="friends-subtext">
                      {friend.sport} • {friend.year}
                    </div>
                  </div>
                  <div className="friends-buttons">
                    <button
                      className="friends-btn friends-btn-small friends-btn-primary"
                      onClick={() =>
                        console.log("Open messages with:", friend.id)
                      }
                    >
                      Message
                    </button>
                    <button
                      className="friends-btn friends-btn-small friends-btn-secondary"
                      onClick={() =>
                        console.log("Remove friend:", friend.id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
