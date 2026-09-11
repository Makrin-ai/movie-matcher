import "./MovieCard.css";

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  return (
    <div className="movie-card">
      <img src={posterUrl} alt={movie.title} className="movie-poster" />
      <div className="movie-info">
        <h2>{movie.title} ({year})</h2>
        <p>⭐ {movie.vote_average?.toFixed(1)}</p>
      </div>
    </div>
  );
}

export default MovieCard;
/*
Тут мы принимаем весь объект фильма целиком как один prop movie, 
а не раскладываем на отдельные title, year и т.д. — так удобнее, когда полей много
*/
