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