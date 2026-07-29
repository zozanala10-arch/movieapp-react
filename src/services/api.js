const API_KEY = "dd2f5cbd8d58e9abd80d78dc0a6e0f3c";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () =>{
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
   const data = await response.json();
   return data.results;
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  if (!response.ok) throw new Error("Failed to fetch movie details");
  return await response.json();
};

