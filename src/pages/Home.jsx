import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getTrendingMovies, getMoviesByGenre } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("trending");
  const { language, t } = useLanguage();

  const categories = [
    { id: "trending", label: t("catTrending") },
    { id: "28", label: t("catAction") },
    { id: "35", label: t("catComedy") },
    { id: "18", label: t("catDrama") },
    { id: "878", label: t("catSciFi") },
  ];

  useEffect(() => {
    if (searchQuery.trim()) return;

    const loadCategoryMovies = async () => {
      setLoading(true);
      try {
        let results = [];
        if (activeCategory === "trending") {
          results = await getTrendingMovies(language);
        } else {
          results = await getMoviesByGenre(activeCategory, language);
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

    loadCategoryMovies();
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

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveCategory("trending");
  };

  return (
    <div className="home">
      <header className="home-header">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{t("headerTitle")}</h1>
          <p>{t("headerSubtitle")}</p>
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
        </div>
      </header>

      {!searchQuery.trim() && (
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
            &larr; {language === "ar" ? "العودة إلى التصنيفات" : "Back to Categories"}
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
    </div>
  );
}

export default Home;
