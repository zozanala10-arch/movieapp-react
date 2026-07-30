import "../css/Favorites.css";
import { useMovieContext } from "../contexts/MovieContext";
import MovieCard from "../components/MovieCard";
import { useLanguage } from "../contexts/LanguageContext";

function Favorites() {
  const { favorites } = useMovieContext();
  const { t } = useLanguage();

  if (favorites && favorites.length > 0) {
    return (
      <div className="favorites">
        <h2>{t("yourFavorites")}</h2>
        <div className="movies-grid">
          {favorites.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <h2>{t("noFavorites")}</h2>
      <p>{t("favoritesDesc")}</p>
    </div>
  );
}

export default Favorites;