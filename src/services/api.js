const API_KEY = "dd2f5cbd8d58e9abd80d78dc0a6e0f3c";
const BASE_URL = "https://api.themoviedb.org/3";

//initialize API
export const getPopularMovies = async (lang = "en") => {
  const tmdbLang = lang === "ar" ? "ar-SA" : "en-US";
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${tmdbLang}`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query, lang = "en") => {
  const tmdbLang = lang === "ar" ? "ar-SA" : "en-US";
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=${tmdbLang}`
  );
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (id, lang = "en") => {
  const tmdbLang = lang === "ar" ? "ar-SA" : "en-US";
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${tmdbLang}`);
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return await response.json();
};

export const getTrendingMovies = async (lang = "en") => {
  const tmdbLang = lang === "ar" ? "ar-SA" : "en-US";
  const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=${tmdbLang}`);
  const data = await response.json();
  return data.results;
};

export const getMoviesByGenre = async (genreId, lang = "en") => {
  const tmdbLang = lang === "ar" ? "ar-SA" : "en-US";
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=${tmdbLang}`
  );
  const data = await response.json();
  return data.results;
};
