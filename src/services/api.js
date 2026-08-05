const API_KEY = "dd2f5cbd8d58e9abd80d78dc0a6e0f3c";
const BASE_URL = "https://api.themoviedb.org/3";

const getTmdbLang = (lang) => {
  if (lang === "ar") return "ar-SA";
  if (lang === "ckb") return "ar-SA";
  return "en-US";
};

//initialize API
export const getPopularMovies = async (lang = "en") => {
  const tmdbLang = getTmdbLang(lang);
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=${tmdbLang}`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query, lang = "en") => {
  const tmdbLang = getTmdbLang(lang);
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=${tmdbLang}`
  );
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (id, lang = "en") => {
  const tmdbLang = getTmdbLang(lang);
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${tmdbLang}`);
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return await response.json();
};

export const getTrendingMovies = async (lang = "en") => {
  const tmdbLang = getTmdbLang(lang);
  const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=${tmdbLang}`);
  const data = await response.json();
  return data.results;
};

export const getMoviesByGenre = async (genreId, lang = "en") => {
  const tmdbLang = getTmdbLang(lang);
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=${tmdbLang}`
  );
  const data = await response.json();
  return data.results;
};

export const getMovieCredits = async (id, lang = "en") => {
  const tmdbLang = getTmdbLang(lang);
  const response = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=${tmdbLang}`);
  if (!response.ok) throw new Error("Failed to fetch movie credits");
  const data = await response.json();
  return data.cast;
};

export const getMovieVideos = async (id, lang = "en") => {
  const tmdbLang = getTmdbLang(lang);
  const response = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=${tmdbLang}`);
  if (!response.ok) throw new Error("Failed to fetch movie videos");
  const data = await response.json();
  return data.results;
};

export const discoverMovies = async (filters = {}, lang = "en") => {
  const tmdbLang = getTmdbLang(lang);
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=${tmdbLang}`;
  if (filters.genre) {
    url += `&with_genres=${filters.genre}`;
  }
  if (filters.releaseDateFrom) {
    url += `&primary_release_date.gte=${filters.releaseDateFrom}`;
  }
  if (filters.releaseDateTo) {
    url += `&primary_release_date.lte=${filters.releaseDateTo}`;
  }
  if (filters.originalLanguage) {
    url += `&with_original_language=${filters.originalLanguage}`;
  }
  if (filters.minRating) {
    url += `&vote_average.gte=${filters.minRating}`;
  }
  if (filters.sortBy) {
    url += `&sort_by=${filters.sortBy}`;
  } else {
    url += `&sort_by=popularity.desc`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch discover results");
  const data = await response.json();
  return data.results;
};
