import React, { useState, useEffect } from 'react';

const emptyForm = {
  title: '',
  director: '',
  genre: '',
  release_year: '',
  rating: '',
  description: '',
  image: ''
};

const GENRE_SUGGESTIONS = ['Action', 'Animation', 'Comedy', 'Drama', 'Horror', 'Science Fiction'];

function MovieForm({ isOpen, onClose, onSubmit, selectedMovie }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (selectedMovie) {
      setFormData({
        title: selectedMovie.title,
        director: selectedMovie.director,
        genre: selectedMovie.genre,
        release_year: selectedMovie.release_year,
        rating: selectedMovie.rating,
        description: selectedMovie.description,
        image: selectedMovie.image
      });
    } else {
      setFormData(emptyForm);
    }
    setErrors({});
    setImgError(false);
  }, [selectedMovie, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'image') setImgError(false);

    setFormData((prev) => ({
      ...prev,
      [name]: (name === 'release_year' || name === 'rating')
        ? (value === '' ? '' : Number(value))
        : value
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.director.trim()) errs.director = 'Director is required';
    if (!String(formData.genre).trim()) errs.genre = 'Genre is required';
    if (!formData.release_year || isNaN(formData.release_year) || formData.release_year < 1800) {
      errs.release_year = 'Valid year is required';
    }
    if (formData.rating === '' || isNaN(formData.rating) || formData.rating < 0 || formData.rating > 10) {
      errs.rating = 'Rating must be between 0 and 10';
    }
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.image.trim()) errs.image = 'Image URL is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{selectedMovie ? 'Edit movie' : 'Add a movie'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input id="title" type="text" name="title" placeholder="e.g. Interstellar" value={formData.title} onChange={handleChange} />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="director">Director</label>
            <input id="director" type="text" name="director" value={formData.director} onChange={handleChange} />
            {errors.director && <span className="error-text">{errors.director}</span>}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="genre">Genre</label>
              <input id="genre" type="text" name="genre" list="genre-options" placeholder="Pick or type" value={formData.genre} onChange={handleChange} />
              <datalist id="genre-options">
                {GENRE_SUGGESTIONS.map((g) => <option key={g} value={g} />)}
              </datalist>
              {errors.genre && <span className="error-text">{errors.genre}</span>}
            </div>
            <div className="form-group flex-1">
              <label htmlFor="release_year">Release year</label>
              <input id="release_year" type="number" name="release_year" placeholder="2014" value={formData.release_year} onChange={handleChange} />
              {errors.release_year && <span className="error-text">{errors.release_year}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating (0–10)</label>
            <input id="rating" type="number" name="rating" min="0" max="10" step="0.1" placeholder="8.7" value={formData.rating} onChange={handleChange} />
            {errors.rating && <span className="error-text">{errors.rating}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleChange} />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <div className="image-row">
              <input id="image" type="text" name="image" placeholder="https://images.unsplash.com/..." value={formData.image} onChange={handleChange} />
              <div className="preview-box">
                {formData.image && !imgError ? (
                  <img src={formData.image} alt="Preview" onError={() => setImgError(true)} />
                ) : (
                  <span>{imgError ? 'MOVIE' : 'Preview'}</span>
                )}
              </div>
            </div>
            {errors.image && <span className="error-text">{errors.image}</span>}
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">{selectedMovie ? 'Save changes' : 'Add movie'}</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MovieForm;