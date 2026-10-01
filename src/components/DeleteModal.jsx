import React from 'react';

function DeleteModal({ isOpen, movie, onClose, onConfirm }) {
  if (!isOpen || !movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Delete this movie?</h3>
        <p>
          Are you sure you want to delete <strong>"{movie.title}"</strong>? This can't be undone.
        </p>
        <div className="modal-actions center">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteModal;