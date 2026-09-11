function ResultsView({ movies, memberCount, votes }) {
  const movieVotes = {};
  votes.forEach((vote) => {
    if (!movieVotes[vote.movieId]) movieVotes[vote.movieId] = [];
    movieVotes[vote.movieId].push(vote);
  });

  const votedMovieIds = Object.keys(movieVotes).map(Number);
  const votedMovies = movies.filter((m) => votedMovieIds.includes(m.id));

  const sortedMovies = [...votedMovies].sort((a, b) => {
    const aLikes = movieVotes[a.id].filter((v) => v.liked).length;
    const bLikes = movieVotes[b.id].filter((v) => v.liked).length;
    return bLikes - aLikes;
  });

  if (sortedMovies.length === 0) {
    return <p className="status">No votes yet — start swiping!</p>;
  }

  return (
    <div className="results">
      {sortedMovies.map((movie) => {
        const votesForMovie = movieVotes[movie.id];
        const likeCount = votesForMovie.filter((v) => v.liked).length;
        const dislikeCount = votesForMovie.filter((v) => !v.liked).length;
        const isMatch = memberCount > 0 && likeCount >= memberCount;

        return (
          <div key={movie.id} className={`result-row ${isMatch ? "matched" : ""}`}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                  : "https://via.placeholder.com/92x138?text=No+Poster"
              }
              alt={movie.title}
              className="result-poster"
            />
            <div className="result-info">
              <h3>
                {movie.title} {isMatch && "🎉"}
              </h3>
              <div className="result-votes">
                <span className="vote-count like">👍 {likeCount}</span>
                <span className="vote-count dislike">👎 {dislikeCount}</span>
                <span className="vote-count total">out of {memberCount} in room</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ResultsView;