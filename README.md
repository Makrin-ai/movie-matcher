# 🎬 Movie Night Matcher

Swipe through movies with friends in real time until everyone matches on something to watch — no more endless "what do you want to watch" debates.


## Features

- **Create or join a room** with a simple 4-character code — no sign-up required
- **Swipe to vote** — like or skip movies from a real, live-updated catalog
- **Real-time matching** — as soon as everyone in the room likes the same movie, it's instantly flagged as a match for all participants
- **Live results view** — see vote counts for every movie as they come in, without refreshing
- **Anonymous auth** — join instantly, no accounts or passwords

## Tech Stack

- **React** (Vite) — UI and component architecture
- **React Router** — client-side routing between home and room screens
- **Firebase**
  - **Firestore** — real-time database for rooms, votes, and matches
  - **Authentication** (Anonymous) — lightweight per-session identity
- **TMDB API** — live movie data, posters, and ratings

## How It Works

1. A user creates a room, which generates a shared movie deck pulled from TMDB
2. Friends join using the room code and get the same deck
3. Everyone swipes independently — each vote is written to Firestore
4. After every "like," the app checks whether *all* current room members have liked that movie
5. If so, a match is recorded and instantly pushed to everyone in the room via Firestore's real-time listeners (`onSnapshot`)

## Getting Started

### Prerequisites

- Node.js (LTS)
- A free [TMDB API key](https://www.themoviedb.org/settings/api)
- A free [Firebase project](https://console.firebase.google.com) with Firestore and Anonymous Authentication enabled

### Setup

```bash
git clone https://github.com/Makrin-ai/movie-matcher.git
cd movie-matcher
npm install
```

Create a `.env` file in the root with your TMDB key:

```
VITE_TMDB_API_KEY=your_tmdb_key_here
```

Add your Firebase config to `src/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

Run the dev server:

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── api/           # Firestore & TMDB API calls
├── components/    # Reusable UI components (MovieCard, ResultsView)
├── pages/         # Route-level screens (Home, Room)
├── firebase.js    # Firebase initialization
└── App.jsx        # Route definitions
```

## Roadmap

- [ ] Streaming provider info (where to watch a matched movie)
- [ ] Deployment to Vercel
- [ ] Genre/rating filters before swiping
- [ ] Swipe gesture animation

