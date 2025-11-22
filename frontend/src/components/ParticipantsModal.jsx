import "./ParticipantsModal.css";

export default function ParticipantsModal({ participants, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Participants</h3>

        {participants.length === 0 ? (
          <p>No participants yet.</p>
        ) : (
          <ul>
            {participants.map((p) => (
              <li key={p.user_id}>{p.username}</li>
            ))}
          </ul>
        )}

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
