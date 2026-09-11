import { db, auth, signInAsGuest } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { fetchPopularMovies } from "./tmdb";

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createRoom() {
  const roomCode = generateRoomCode();
  const movies = await fetchPopularMovies();

  const roomRef = doc(db, "rooms", roomCode);
  await setDoc(roomRef, {
    createdAt: serverTimestamp(),
    movieDeck: movies,
  });

  return roomCode;
}

export async function checkRoomExists(roomCode) {
  const roomRef = doc(db, "rooms", roomCode.toUpperCase());
  const snapshot = await getDoc(roomRef);
  return snapshot.exists();
}

export async function ensureSignedIn() {
  if (!auth.currentUser) {
    await signInAsGuest();
  }
  return auth.currentUser.uid;
}

export async function joinRoomAsMember(roomCode) {
  const userId = await ensureSignedIn();
  const memberRef = doc(db, "rooms", roomCode, "members", userId);
  await setDoc(memberRef, {
    joinedAt: serverTimestamp(),
  });
  return userId;
}

export function listenToMembers(roomCode, callback) {
  const membersRef = collection(db, "rooms", roomCode, "members");
  return onSnapshot(membersRef, (snapshot) => {
    const members = snapshot.docs.map((doc) => doc.id);
    callback(members);
  });
}

export async function recordVote(roomCode, userId, movie, liked) {
  const voteRef = doc(db, "rooms", roomCode, "votes", `${userId}_${movie.id}`);
  await setDoc(voteRef, {
    userId,
    movieId: movie.id,
    liked,
    votedAt: serverTimestamp(),
  });

  if (liked) {
    await checkForMatch(roomCode, movie);
  }
}

async function checkForMatch(roomCode, movie) {
  const membersSnap = await getDocs(collection(db, "rooms", roomCode, "members"));
  const memberCount = membersSnap.size;

  const likesQuery = query(
    collection(db, "rooms", roomCode, "votes"),
    where("movieId", "==", movie.id),
    where("liked", "==", true)
  );
  const likesSnap = await getDocs(likesQuery);
  const likeCount = likesSnap.size;

  if (memberCount > 0 && likeCount >= memberCount) {
    const matchRef = doc(db, "rooms", roomCode, "matches", String(movie.id));
    await setDoc(matchRef, {
      movie,
      matchedAt: serverTimestamp(),
    });
  }
}

export function listenToMatches(roomCode, callback) {
  const matchesRef = collection(db, "rooms", roomCode, "matches");
  return onSnapshot(matchesRef, (snapshot) => {
    const matches = snapshot.docs.map((doc) => doc.data());
    callback(matches);
  });
}

export function listenToVotes(roomCode, callback) {
  const votesRef = collection(db, "rooms", roomCode, "votes");
  return onSnapshot(votesRef, (snapshot) => {
    const votes = snapshot.docs.map((doc) => doc.data());
    callback(votes);
  });
}