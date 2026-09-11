import TinderCard from "react-tinder-card";
import "./MovieCard.css";

function SwipeCard({ movie, onSwipe }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";

  return (
    <TinderCard
      className="swipe"
      onSwipe={(dir) => onSwipe(dir === "right" ? "like" : "dislike")}
      preventSwipe={["up", "down"]}
    >
      <div className="movie-card">
        <img src={posterUrl} alt={movie.title} className="movie-poster" />
        <div className="movie-info">
          <h2>{movie.title} ({year})</h2>
          <p>⭐ {movie.vote_average?.toFixed(1)}</p>
        </div>
      </div>
    </TinderCard>
  );
}

export default SwipeCard;