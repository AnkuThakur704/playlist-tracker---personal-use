# StudyTrack

Paste YouTube playlist links, track which videos you've finished. React + Vite + localStorage. No backend.

## Run locally
    npm install
    cp .env.example .env     # then paste your key after VITE_YOUTUBE_API_KEY=
    npm run dev              # http://localhost:5173

## API key
1. Google Cloud Console → create a project → enable "YouTube Data API v3".
2. Credentials → Create credentials → API key.
3. Restrict it:
   - Application restrictions: Websites → add `http://localhost:5173/*` and your deployed URL (e.g. `https://studytrack.vercel.app/*`).
   - API restrictions: YouTube Data API v3 only.
4. Put it in `.env` as `VITE_YOUTUBE_API_KEY=...` (`.env` is git-ignored).

The key ends up in the built JavaScript, which is why the restrictions matter.

## Build / deploy
    npm run build            # outputs dist/
Deploy `dist/` to Vercel, Netlify or Cloudflare Pages. Set `VITE_YOUTUBE_API_KEY` in the host's environment variables, build command `npm run build`, output directory `dist`.

Progress lives in each browser's localStorage, so it does NOT sync between devices.

## Structure
    src/
      main.jsx            entry point
      App.jsx             state, hash routing, add/delete/toggle/reset
      storage.js          localStorage load/save + progress helpers
      youtube.js          URL parsing + playlistItems.list with pagination
      styles.css
      components/
        Dashboard.jsx  PlaylistCard.jsx  AddPlaylist.jsx
        PlaylistPage.jsx  VideoItem.jsx  ProgressBar.jsx  ConfirmBar.jsx
