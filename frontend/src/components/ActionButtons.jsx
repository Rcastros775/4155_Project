import "./ActionButtons.css";

export default function ActionButtons({
  participants,
  onShowParticipants,
  interested,
  onToggleInterest,
  bookmarked,
  onToggleBookmark,
  loggedIn,
}) {
  return (
    <div className="action-btn-group">
      <button className="btn" onClick={onShowParticipants}>
        Participants ({participants.length})
      </button>

      {loggedIn && (
        <button className="btn" onClick={onToggleInterest}>
          {interested ? "Not Interested" : "I'm Interested"}
        </button>
      )}

      {loggedIn && (
        <button className="btn" onClick={onToggleBookmark}>
          {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
        </button>
      )}
    </div>
  );
}
