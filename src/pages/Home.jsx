import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    const loadPopularMovies = async () => {
      setLoading(true);
      try {
        const popularMovies = await getPopularMovies(language);
        setMovies(popularMovies);
      } catch (err) {
        console.log(err);
        setError(t("errorLoad"));
      } finally {
        setLoading(false);
      }
    };

    loadPopularMovies();
  }, [language, t]);

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

  return (
    <div className="home">
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
