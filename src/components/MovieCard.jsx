import React from 'react';

function MovieCard({ movie, onView, onEdit, onDelete }) {
  return (
    <div className="movie-card">
      <div className="card-image-wrapper">
        <span className="badge-rating">★{movie.rating}</span>
        <img
          src={movie.image}
          alt={movie.title}
          className="card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
            e.target.parentElement.classList.add('fallback-cover');
          }}
        />
        <div className="fallback-text">MOVIE</div>
      </div>
      <div className="card-body">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-info">
          {movie.director} · {movie.release_year}
        </p>
        <span className="badge-genre">{movie.genre}</span>
        <div className="card-actions">
          <button className="btn-action btn-view" onClick={() => onView(movie)}>Details</button>
          <button className="btn-action" onClick={() => onEdit(movie)}>Edit</button>
          <button className="btn-action btn-delete" onClick={() => onDelete(movie)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;