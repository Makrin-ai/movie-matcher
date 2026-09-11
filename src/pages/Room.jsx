import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  joinRoomAsMember,
  listenToMembers,
  listenToVotes,
  listenToMatches,
  recordVote,
} from "../api/rooms";
import MovieCard from "../components/MovieCard";
import ResultsView from "../components/ResultsView";
import "./Room.css";

function Room() {
  const { roomId } = useParams();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMovies, setLikedMovies] = useState([]);
  const [memberCount, setMemberCount] = useState(0);
  const [votes, setVotes] = useState([]);
  const [matches, setMatches] = useState([]);
  const [userId, setUserId] = useState(null);
  const [view, setView] = useState("swipe");

  useEffect(() => {
    async function setup() {
      try {
        const uid = await joinRoomAsMember(roomId);
        setUserId(uid);

        const roomRef = doc(db, "rooms", roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
          setError("Room not found");
          return;
        }

        setMovies(roomSnap.data().movieDeck);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    setup();
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = listenToMembers(roomId, (memberList) => {
      setMemberCount(memberList.length);
    });
    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = listenToVotes(roomId, (voteList) => {
      setVotes(voteList);
    });
    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = listenToMatches(roomId, (newMatches) => {
      setMatches(newMatches);
    });
    return () => unsubscribe();
  }, [roomId]);

  async function handleSwipe(direction) {
    const currentMovie = movies[currentIndex];
    const liked = direction === "like";

    if (liked) {
      setLikedMovies((prev) => [...prev, currentMovie]);
    }

    setCurrentIndex((prev) => prev + 1);

    if (userId) {
      recordVote(roomId, userId, currentMovie, liked);
    }
  }

  if (loading) return <p className="status">Loading movies...</p>;
  if (error) return <p className="status">Error: {error}</p>;

  const currentMovie = movies[currentIndex];
  const latestMatch = matches[matches.length - 1];

  return (
    <div className="room">
      {latestMatch && (
        <div className="match-banner">
          🎉 Match: <strong>{latestMatch.movie.title}</strong>!
        </div>
      )}

      <div className="room-header">
        <h1>🎬 Movie Night Matcher</h1>
        <p className="room-code">Room: {roomId}</p>
        <p className="member-count">👥 {memberCount} in this room</p>
      </div>

      <div className="tabs">
        <button
          className={`tab ${view === "swipe" ? "active" : ""}`}
          onClick={() => setView("swipe")}
        >
          Swipe
        </button>
        <button
          className={`tab ${view === "results" ? "active" : ""}`}
          onClick={() => setView("results")}
        >
          Results
        </button>
      </div>

      {view === "swipe" ? (
        currentMovie ? (
          <>
            <div className="card-stack">
              <MovieCard movie={currentMovie} />
            </div>
            <div className="swipe-buttons">
              <button className="btn dislike" onClick={() => handleSwipe("dislike")}>
                👎 Skip
              </button>
              <button className="btn like" onClick={() => handleSwipe("like")}>
                👍 Like
              </button>
            </div>
            <p className="progress">
              {currentIndex + 1} / {movies.length}
            </p>
          </>
        ) : (
          <div className="status">
            <p>That's all the movies! 🎉</p>
            <p>You liked {likedMovies.length} movies</p>
          </div>
        )
      ) : (
        <ResultsView movies={movies} memberCount={memberCount} votes={votes} />
      )}
    </div>
  );
}

export default Room;