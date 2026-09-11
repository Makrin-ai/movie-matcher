import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, checkRoomExists } from "../api/rooms";
import "./Home.css";

function Home() {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleCreateRoom() {
    console.log("Button clicked!"); // маячок №1
    setLoading(true);
    setError("");
    try {
      console.log("Calling createRoom()..."); // маячок №2
      const roomCode = await createRoom();
      console.log("Room created:", roomCode); // маячок №3
      navigate(`/room/${roomCode}`);
    } catch (err) {
      console.error("Error creating room:", err); // маячок №4 — покажет реальную ошибку
      setError("Failed to create room: " + err.message);
      setLoading(false);
    }
  }

  async function handleJoinRoom(e) {
    e.preventDefault();
    if (!joinCode.trim()) return;

    setLoading(true);
    setError("");
    try {
      const exists = await checkRoomExists(joinCode);
      if (!exists) {
        setError("Room not found. Check the code and try again.");
        setLoading(false);
        return;
      }
      navigate(`/room/${joinCode.toUpperCase()}`);
    } catch (err) {
      console.error("Error joining room:", err);
      setError("Something went wrong: " + err.message);
      setLoading(false);
    }
  }

  return (
    <div className="home">
      <h1>🎬 Movie Night Matcher</h1>
      <p className="subtitle">Swipe movies with friends until you match</p>

      <button className="btn create" onClick={handleCreateRoom} disabled={loading}>
        {loading ? "Creating..." : "Create a Room"}
      </button>

      <div className="divider">or</div>

      <form onSubmit={handleJoinRoom} className="join-form">
        <input
          type="text"
          placeholder="Enter room code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          maxLength={4}
        />
        <button type="submit" className="btn join" disabled={loading}>
          Join Room
        </button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Home;