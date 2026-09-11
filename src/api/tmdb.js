const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchPopularMovies() {
  const pageRequests = [1, 2].map((page) =>
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch movies from TMDB");
        return res.json();
      })
  );

  const pages = await Promise.all(pageRequests);
  return pages.flatMap((page) => page.results);
}
export async function fetchWatchProviders(movieId, region = "US") {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch watch providers");
  }

  const data = await response.json();
  const regionData = data.results?.[region];

  if (!regionData) return { flatrate: [], rent: [], buy: [], link: null };

  return {
    flatrate: regionData.flatrate || [],
    rent: regionData.rent || [],
    buy: regionData.buy || [],
    link: regionData.link || null,
  };
}