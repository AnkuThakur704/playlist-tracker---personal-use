// Tiny "database": the whole app state is one JSON array in localStorage.
//
// Playlist shape:
// {
//   id: "local id",
//   name: "Arrays",
//   youtubePlaylistId: "PLxxxx",
//   videos: [{ videoId, title }],      // exact YouTube order
//   completedVideoIds: ["videoId", …]  // progress, per playlist
// }

export const STORAGE_KEY = "studytrack:v1";
export const NOTES_STORAGE_KEY = "studytrack:notes:v1";

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isValidPlaylist(p) {
  return (
    p &&
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.youtubePlaylistId === "string" &&
    Array.isArray(p.videos) &&
    Array.isArray(p.completedVideoIds)
  );
}

export function loadPlaylists() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isValidPlaylist) : [];
  } catch {
    // Corrupt data: keep a copy instead of silently overwriting it.
    try {
      if (raw) localStorage.setItem(`${STORAGE_KEY}:corrupt-backup`, raw);
    } catch {
      /* ignore */
    }
    return [];
  }
}

export function savePlaylists(playlists) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
    return true;
  } catch {
    return false; // storage full or blocked
  }
}

export function loadVideoNotes() {
  let raw = null;
  try {
    raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (!isRecord(data)) return {};
    return Object.fromEntries(
      Object.entries(data).map(([playlistId, notes]) => [
        playlistId,
        isRecord(notes)
          ? Object.fromEntries(Object.entries(notes).filter(([, note]) => typeof note === "string"))
          : {},
      ])
    );
  } catch {
    try {
      if (raw) localStorage.setItem(`${NOTES_STORAGE_KEY}:corrupt-backup`, raw);
    } catch {
      /* ignore */
    }
    return {};
  }
}

export function saveVideoNotes(notes) {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}

export function makeId() {
  // crypto.randomUUID() is unavailable on plain-http LAN addresses, so avoid it.
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function countCompleted(playlist) {
  const done = new Set(playlist.completedVideoIds);
  return playlist.videos.reduce((n, v) => n + (done.has(v.videoId) ? 1 : 0), 0);
}

export function percent(done, total) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}
