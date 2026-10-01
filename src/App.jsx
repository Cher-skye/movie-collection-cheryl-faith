import React, { useState, useEffect } from 'react';
import { apiClient } from './main.jsx';
import MovieCard from './components/MovieCard';
import MovieForm from './components/MovieForm';
import MovieDetail from './components/MovieDetail';
import DeleteModal from './components/DeleteModal';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filter & Search
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');

  // Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Selected Movie
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);

  // 1. GET ALL MOVIES
  const fetchMovies = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await apiClient.get('/movie');
      setMovies(res.data);
    } catch (err) {
      console.error('Error fetching movies:', err.message);
      setErrorMsg('Failed to load movies. Please check your MockAPI endpoint.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Modal Actions
  const handleOpenAdd = () => {
    setSelectedMovie(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setSelectedMovie(movie);
    setIsFormOpen(true);
  };

  const handleOpenView = (movie) => {
    setSelectedMovie(movie);
    setIsViewOpen(true);
  };

  const handleOpenDelete = (movie) => {
    setMovieToDelete(movie);
    setIsDeleteOpen(true);
  };

  // 2. CREATE (POST) & UPDATE (PUT)
  const handleFormSubmit = async (formData) => {
    try {
      if (selectedMovie) {
        await apiClient.put(`/movie/${selectedMovie.id}`, formData);
      } else {
        await apiClient.post('/movie', formData);
      }
      setIsFormOpen(false);
      fetchMovies();
    } catch (err) {
      console.error('Error saving movie:', err.message);
      alert('Failed to save movie!');
    }
  };

  // 3. DELETE
  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;
    try {
      await apiClient.delete(`/movie/${movieToDelete.id}`);
      setIsDeleteOpen(false);
      setMovieToDelete(null);
      fetchMovies();
    } catch (err) {
      console.error('Error deleting movie:', err.message);
      alert('Failed to delete movie!');
    }
  };

  const genres = ['All', ...Array.from(new Set(movies.map((m) => m.genre).filter(Boolean))).sort()];
  const activeGenre = genres.includes(selectedGenre) ? selectedGenre : 'All';

  // Filter
  const filteredMovies = movies.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch =
      (m.title || '').toLowerCase().includes(q) ||
      (m.director || '').toLowerCase().includes(q);

    const matchesGenre = activeGenre === 'All' || m.genre === activeGenre;
    const matchesRating = selectedRating === 'All' || Number(m.rating) >= Number(selectedRating);

    return matchesSearch && matchesGenre && matchesRating;
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1>
            My <span className="title-tag">Movie</span> Shelf
          </h1>
          <p className="subtitle">Keep track of everything you've watched and loved.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          + Add movie
        </button>
      </header>

      {/* Search & Rating */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by title or director..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="filter-group">
          <select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
            <option value="All">Any rating</option>
            <option value="6">6+ stars</option>
            <option value="7">7+ stars</option>
            <option value="8">8+ stars</option>
            <option value="9">9+ stars</option>
          </select>
        </div>
      </div>

      {/* Genre */}
      <div className="chip-row">
        {genres.map((g) => (
          <button
            key={g}
            type="button"
            className={`chip ${activeGenre === g ? 'active' : ''}`}
            onClick={() => setSelectedGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Main */}
      {loading ? (
        <div className="state-box loading">
          <div className="spinner" />
          Loading movies...
        </div>
      ) : errorMsg ? (
        <div className="error-banner">{errorMsg}</div>
      ) : filteredMovies.length === 0 ? (
        <div className="state-box empty-state">No movies found. Try another search or add one.</div>
      ) : (
        <div className="movie-grid">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onView={handleOpenView}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <MovieForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        selectedMovie={selectedMovie}
      />

      {isViewOpen && (
        <MovieDetail
          movie={selectedMovie}
          onClose={() => setIsViewOpen(false)}
        />
      )}

      <DeleteModal
        isOpen={isDeleteOpen}
        movie={movieToDelete}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default App;