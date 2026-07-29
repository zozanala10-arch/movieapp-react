import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import "../css/MovieDetail.css";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const details = await getMovieDetails(id);
        setMovie(details);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <div className="movie-detail-loading">Loading details...</div>;
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-error">
        <h2>Error</h2>
        <p>{error || "Movie not found"}</p>
        <Link to="/" className="back-home-btn">
          Back to Home
        </Link>
      </div>
    );
  }

  // Format runtime: e.g., 132 min -> 2h 12m
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const runtimeFormatted = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  // Format rating: e.g., 7.8 -> 78%
  const ratingFormatted = movie.vote_average
    ? `${Math.round(movie.vote_average * 10)}%`
    : "N/A";

  const releaseYear = movie.release_date
    ? movie.release_date.split("-")[0]
    : "N/A";

  return (
    <div
      className="movie-detail-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="movie-detail-content">
        <div className="movie-detail-poster-container">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-detail-poster"
          />
        </div>

        <div className="movie-detail-info">
          <Link to="/" className="back-link">
            ← Back to Browse
          </Link>
          
          <h1 className="movie-detail-title">
            {movie.title} <span className="movie-detail-year">({releaseYear})</span>
          </h1>

          <div className="movie-detail-meta">
            <span className="meta-item rating-badge">Rating: {ratingFormatted}</span>
            <span className="meta-item">{runtimeFormatted}</span>
            <span className="meta-item">{movie.release_date}</span>
          </div>

          <div className="movie-detail-genres">
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>

          {movie.tagline && (
            <p className="movie-detail-tagline">"{movie.tagline}"</p>
          )}

          <div className="movie-detail-overview-section">
            <h2>Overview</h2>
            <p className="movie-detail-overview">{movie.overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
