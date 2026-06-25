Music Store — fake song generator

The app generates fake songs (title, artist, album, genre, cover and the track itself) from a given seed. Nothing is stored — everything is generated on the server per request, but the same seed always produces the same result.

Live demo: https://task5-gy3r.onrender.com

Tech stack

Frontend: React + TypeScript + Vite, MUI, Zustand, Tone.js + smplr (audio in the browser), Axios.
Backend: Node.js + Express, faker (data), seedrandom (RNG), Tonal (music), @napi-rs/canvas (covers).

Structure

task5/
├── backend/     Express API and generation
└── frontend/    React app

How it works

The browser requests a page of 20 songs from the server: /api/songs?seed=...&page=...&lang=...&likes=...
The server combines the seed with the page number, seeds faker and generates the songs in memory.
Covers and music are loaded separately by their own seeds: /api/covers and /api/audio/:seed.

The parameters (language, seed, likes) are independent. Changing likes does not change titles or covers — only the like counts. A fractional likes value works probabilistically: 0.5 gives on average 1 like per 2 songs.

Covers are drawn on canvas: a palette and one of three styles (rings, bands, shapes) chosen by the seed, with the title and artist rendered on top.

Music is assembled from a score returned by the server (chords, bass, melody, drums, tempo). On the client it is played by Tone.js, and the instrument sounds are loaded by smplr.

Locales (en, de, ru) live as JSON dictionaries in backend/locales — a new language is added with a file, without touching the code.

Run

With Docker (one service — the backend builds and serves the frontend):

docker compose up --build

App — http://localhost:3000

Manually (for development, run each block in its own terminal from the project root):

backend:

cd backend
npm install
npm run dev

frontend:

cd frontend
pnpm install
pnpm dev

In dev the frontend runs on http://localhost:5173 and proxies /api to the backend on port 3000.
