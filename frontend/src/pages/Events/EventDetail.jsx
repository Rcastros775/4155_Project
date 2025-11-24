import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  getParticipants,
  getInterestStatus,
  toggleInterest,
} from "../../services/interests";

import { getEventById } from "../../services/events";
import { toggleBookmark, getBookmarks } from "../../services/bookmarks";
import { listFriends } from "../../services/friends";

import EventDetailHeader from "../../components/EventDetailHeader";
import ParticipantsModal from "../../components/ParticipantsModal";
import ActionButtons from "../../components/ActionButtons";

import "./EventDetail.css";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const loggedIn = !!token;

  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  const [participants, setParticipants] = useState([]);
  const [interested, setInterested] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const [friends, setFriends] = useState([]);
  const [friendsWhoAreInterested, setFriendsWhoAreInterested] = useState([]);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch event
    getEventById(id).then((data) => {
      setGame(data);
      setLoading(false);
    });

    // If logged in, fetch interest + bookmarks + friends
    if (loggedIn) {
      getInterestStatus(id).then((res) => setInterested(res.interested));

      getBookmarks().then((list) =>
        setBookmarked(list.some((e) => String(e.id) === String(id)))
      );

      listFriends().then((list) => setFriends(list));
    }

    // Fetch participants
    getParticipants(id).then((list) => setParticipants(list));
  }, [id, loggedIn]);

  useEffect(() => {
    if (!loggedIn) return;

    // Compute which participants are friends
    const friendIds = new Set(friends.map((f) => f.user_id));
    const filtered = participants.filter((p) => friendIds.has(p.user_id));

    setFriendsWhoAreInterested(filtered);
  }, [participants, friends, loggedIn]);

  // Toggle interest
  const handleToggleInterest = async () => {
    const result = await toggleInterest(id, interested);
    if (!result.error) {
      setInterested(!interested);

      const updated = await getParticipants(id);
      setParticipants(updated);
    }
  };

  // Toggle bookmark
  const handleToggleBookmark = async () => {
    const result = await toggleBookmark(id, bookmarked);
    if (!result.error) setBookmarked(!bookmarked);
  };

  if (loading) return <p>Loading event...</p>;
  if (!game) return <p>Event not found.</p>;

  return (
    <div className="event-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <EventDetailHeader game={game} />

      {/* NEW SECTION: Friends interested */}
      {loggedIn && (
        <div className="friends-interested-box">
          <h3>Friends who are interested:</h3>

          {friendsWhoAreInterested.length === 0 ? (
            <p>None of your friends have shown interest yet.</p>
          ) : (
            <ul>
              {friendsWhoAreInterested.map((f) => (
                <li key={f.user_id}>{f.username}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ActionButtons
        participants={participants}
        onShowParticipants={() => setShowModal(true)}
        interested={interested}
        onToggleInterest={handleToggleInterest}
        bookmarked={bookmarked}
        onToggleBookmark={handleToggleBookmark}
        loggedIn={loggedIn}
      />

      {showModal && (
        <ParticipantsModal
          participants={participants}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
