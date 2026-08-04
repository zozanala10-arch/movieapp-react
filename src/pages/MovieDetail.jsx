import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovieDetails, getMovieCredits, getMovieVideos } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/MovieDetail.css";

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const details = await getMovieDetails(id, language);
        setMovie(details);

        // Fetch casting details
        const castData = await getMovieCredits(id, language);
        setCast(castData.slice(0, 10)); // Take top 10 cast members

        // Fetch video resources and search for the official trailer
        const videosData = await getMovieVideos(id, language);
        const officialTrailer = videosData.find(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailer(officialTrailer || null);

        setError(null);
      } catch (err) {
        console.error(err);
        setError(t("errorLoad"));
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, language, t]);

  if (loading) {
    return <div className="movie-detail-loading">{t("loadingDetails")}</div>;
  }

  if (error || !movie) {
    return (
      <div className="movie-detail-error">
        <h2>{t("error")}</h2>
        <p>{error || t("movieNotFound")}</p>
        <Link to="/" className="back-home-btn">
          {t("backHome")}
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
            {t("backBrowse")}
          </Link>

          <h1 className="movie-detail-title">
            {movie.title}{" "}
            <span className="movie-detail-year">({releaseYear})</span>
          </h1>

          <div className="movie-detail-meta">
            <span className="meta-item rating-badge">
              {t("rating")} {ratingFormatted}
            </span>
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

          {/* Action button to open trailer modal */}
          {trailer && (
            <button className="watch-trailer-btn" onClick={() => setShowModal(true)}>
              <span className="play-icon">▶</span> {t("watchTrailer")}
            </button>
          )}

          <div className="movie-detail-overview-section">
            <h2>{t("overview")}</h2>
            <p className="movie-detail-overview">{movie.overview}</p>
          </div>

          {/* Actor casting scroll section */}
          <div className="movie-detail-cast-section">
            <h2>{t("castTitle")}</h2>
            {cast.length > 0 ? (
              <div className="cast-scroll-container">
                {cast.map((actor) => (
                  <div key={actor.id} className="cast-card">
                    <div className="cast-img-wrapper">
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : "https://placehold.co/185x278/222/fff?text=No+Photo"
                        }
                        alt={actor.name}
                      />
                    </div>
                    <div className="cast-info">
                      <p className="actor-name">{actor.name}</p>
                      <p className="character-name">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-cast-msg">{t("noCast")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Iframe Modal Overlay */}
      {showModal && trailer && (
        <div className="trailer-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <div className="iframe-container">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={movie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
