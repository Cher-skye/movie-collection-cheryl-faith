import React from 'react';

function MovieDetail({ movie, onClose }) {
  if (!movie) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{movie.title}</h3>
        <div className="modal-body-row">
          <div className="view-image-container">
            <img
              src={movie.image}
              alt={movie.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentElement.classList.add('fallback-cover');
              }}
            />
            <div className="fallback-text">MOVIE</div>
          </div>
          <div className="view-details">
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Year:</strong> {movie.release_year}</p>
            <p className="view-rating"><strong>Rating:</strong> ★ {movie.rating} / 10</p>
            <p className="view-desc">{movie.description}</p>
          </div>
        </div>
        <div className="modal-actions align-right">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;