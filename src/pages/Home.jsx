import MovieCard from "../components/MovieCard";
import { useState, useEffect, useRef } from "react";
import { searchMovies, getTrendingMovies, getMoviesByGenre, discoverMovies, getMovieVideos } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("trending");
  const { language, t } = useLanguage();

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    genre: "",
    releaseDateFrom: "",
    releaseDateTo: "",
    originalLanguage: "",
    minRating: "0",
    sortBy: "popularity.desc",
  });

  // Featured Banner states
  const [bannerMovies, setBannerMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bannerTrailerKey, setBannerTrailerKey] = useState(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const slideInterval = useRef(null);

  const categories = [
    { id: "trending", label: t("catTrending") },
    { id: "28", label: t("catAction") },
    { id: "35", label: t("catComedy") },
    { id: "18", label: t("catDrama") },
    { id: "878", label: t("catSciFi") },
  ];

  const genreList = [
    { id: "28", name: t("catAction") },
    { id: "35", name: t("catComedy") },
    { id: "18", name: t("catDrama") },
    { id: "878", name: t("catSciFi") },
    { id: "27", name: language === "ar" ? "رعب" : language === "ckb" ? "ترسناک" : "Horror" },
    { id: "10749", name: language === "ar" ? "رومانسي" : language === "ckb" ? "رۆمانسی" : "Romance" },
    { id: "53", name: language === "ar" ? "إثارة" : language === "ckb" ? "پڕ لە جۆش" : "Thriller" },
  ];

  const langList = [
    { code: "en", name: language === "ar" ? "الإنجليزية" : language === "ckb" ? "ئینگلیزی" : "English" },
    { code: "ar", name: language === "ar" ? "العربية" : language === "ckb" ? "عەرەبی" : "Arabic" },
    { code: "ckb", name: language === "ar" ? "الكردية" : language === "ckb" ? "کوردی" : "Kurdish" },
    { code: "es", name: language === "ar" ? "الإسبانية" : language === "ckb" ? "ئیسپانی" : "Spanish" },
    { code: "fr", name: language === "ar" ? "الفرنسية" : language === "ckb" ? "فەرەنسی" : "French" },
    { code: "ja", name: language === "ar" ? "اليابانية" : language === "ckb" ? "یابانی" : "Japanese" },
  ];

  // Fetch banner movies (top 5 trending)
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const trending = await getTrendingMovies(language);
        setBannerMovies(trending.slice(0, 5));
      } catch (err) {
        console.error("Failed to load banner movies:", err);
      }
    };
    fetchBanner();
  }, [language]);

  // Autoplay banner logic
  useEffect(() => {
    if (bannerMovies.length === 0) return;

    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerMovies.length);
    }, 6000);

    return () => clearInterval(slideInterval.current);
  }, [bannerMovies]);

  const nextSlide = () => {
    clearInterval(slideInterval.current);
    setCurrentSlide((prev) => (prev + 1) % bannerMovies.length);
  };

  const prevSlide = () => {
    clearInterval(slideInterval.current);
    setCurrentSlide((prev) => (prev - 1 + bannerMovies.length) % bannerMovies.length);
  };

  const handlePlayTrailer = async (movieId) => {
    try {
      const videos = await getMovieVideos(movieId, language);
      const trailer = videos.find((v) => v.type === "Trailer" && v.site === "YouTube");
      if (trailer) {
        setBannerTrailerKey(trailer.key);
        setShowTrailerModal(true);
      } else {
        alert(t("noTrailer"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadFilteredMovies = async (isFilterSubmit = false) => {
    setLoading(true);
    try {
      let results = [];
      if (isFilterSubmit) {
        // Use Advanced Filters
        results = await discoverMovies(filters, language);
      } else {
        // Use Quick Categories
        if (activeCategory === "trending") {
          results = await getTrendingMovies(language);
        } else {
          results = await getMoviesByGenre(activeCategory, language);
        }
      }
      setMovies(results || []);
      setError(null);
    } catch (err) {
      console.log(err);
      setError(t("errorLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) return;
    if (!activeCategory) return;
    loadFilteredMovies(false);
  }, [activeCategory, language, searchQuery, t]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (loading) return;

    setLoading(true);
    try {
      const searchResults = await searchMovies(searchQuery, language);
      setMovies(searchResults || []);
      setError(null);
    } catch (err) {
      console.log(err);
      setError(t("errorSearch"));
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setActiveCategory(""); // triggers early exit in useEffect
    loadFilteredMovies(true);
  };

  const handleResetFilters = () => {
    setFilters({
      genre: "",
      releaseDateFrom: "",
      releaseDateTo: "",
      originalLanguage: "",
      minRating: "0",
      sortBy: "popularity.desc",
    });
    setActiveCategory("trending");
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveCategory("trending");
  };

  return (
    <div className="home">
      {/* 1. Dynamic Featured Trailer Banner */}
      {!searchQuery.trim() && bannerMovies.length > 0 && (
        <div className="hero-slider">
          {bannerMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={`hero-slide ${index === currentSlide ? "active" : ""}`}
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.9) 20%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0) 100%), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
            >
              <div className="hero-slide-content">
                <span className="trending-badge">{t("catTrending")}</span>
                <h1>{movie.title}</h1>
                <p className="hero-slide-overview">{movie.overview}</p>
                <div className="hero-slide-actions">
                  <button className="slide-play-btn" onClick={() => handlePlayTrailer(movie.id)}>
                    ▶ {language === "ar" ? "شاهد الإعلان" : language === "ckb" ? "بینینی تڕایلەر" : "Play Trailer"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button className="slider-arrow prev" onClick={prevSlide}>
            &#10094;
          </button>
          <button className="slider-arrow next" onClick={nextSlide}>
            &#10095;
          </button>

          {/* Slide Dots Indicator */}
          <div className="slider-dots">
            {bannerMovies.map((_, index) => (
              <span
                key={index}
                className={`slider-dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => {
                  clearInterval(slideInterval.current);
                  setCurrentSlide(index);
                }}
              ></span>
            ))}
          </div>
        </div>
      )}

      {/* 2. Standard Search Bar & Toggle */}
      <div className="search-bar-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            {t("searchBtn")}
          </button>
        </form>

        {!searchQuery.trim() && (
          <button
            type="button"
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? t("hideFilters") : t("advFilters")}
          </button>
        )}
      </div>

      {showFilters && !searchQuery.trim() && (
        <form onSubmit={handleApplyFilters} className="advanced-filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label>{t("filterGenre")}</label>
              <select
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
              >
                <option value="">{t("allGenres")}</option>
                {genreList.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>{t("filterLang")}</label>
              <select
                value={filters.originalLanguage}
                onChange={(e) => setFilters({ ...filters, originalLanguage: e.target.value })}
              >
                <option value="">{t("allLangs")}</option>
                {langList.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>{t("filterFrom")}</label>
              <input
                type="date"
                value={filters.releaseDateFrom}
                onChange={(e) => setFilters({ ...filters, releaseDateFrom: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>{t("filterTo")}</label>
              <input
                type="date"
                value={filters.releaseDateTo}
                onChange={(e) => setFilters({ ...filters, releaseDateTo: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>
                {t("filterRating")}: {filters.minRating}+
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>{t("filterSort")}</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              >
                <option value="popularity.desc">{t("sortPop")}</option>
                <option value="vote_average.desc">{t("sortRating")}</option>
                <option value="primary_release_date.desc">{t("sortDate")}</option>
              </select>
            </div>
          </div>
          <div className="filters-actions">
            <button type="submit" className="apply-btn">
              {t("btnApply")}
            </button>
            <button type="button" onClick={handleResetFilters} className="reset-btn">
              {t("btnReset")}
            </button>
          </div>
        </form>
      )}

      {/* Quick Categories pills */}
      {!searchQuery.trim() && !showFilters && (
        <div className="categories-container">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {searchQuery.trim() && (
        <div className="search-results-info">
          <button onClick={handleClearSearch} className="clear-search-btn">
            &larr; {language === "ar" ? "العودة إلى التصنيفات" : language === "ckb" ? "گەڕانەوە بۆ جۆرەکان" : "Back to Categories"}
          </button>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">{t("loading")}</div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      )}

      {/* Trailer Iframe Popup Modal */}
      {showTrailerModal && bannerTrailerKey && (
        <div className="trailer-modal-overlay" onClick={() => setShowTrailerModal(false)}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowTrailerModal(false)}>
              &times;
            </button>
            <div className="iframe-container">
              <iframe
                src={`https://www.youtube.com/embed/${bannerTrailerKey}?autoplay=1`}
                title="Trailer"
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

export default Home;
