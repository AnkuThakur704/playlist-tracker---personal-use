import { useState } from "react";
import { extractPlaylistId, fetchPlaylistVideos } from "../youtube.js";
import { makeId } from "../storage.js";

export default function AddPlaylist({ playlists, onAdd }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [duplicate, setDuplicate] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setDuplicate(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Enter a playlist name.");
      return;
    }

    let youtubePlaylistId;
    try {
      youtubePlaylistId = extractPlaylistId(url);
    } catch (e) {
      setError(e.message);
      return;
    }

    const existing = playlists.find((p) => p.youtubePlaylistId === youtubePlaylistId);
    if (existing) {
      setDuplicate(existing);
      return;
    }

    setLoading(true);
    try {
      const videos = await fetchPlaylistVideos(youtubePlaylistId);
      onAdd({
        id: makeId(),
        name: trimmedName,
        youtubePlaylistId,
        videos,
        completedVideoIds: [],
      });
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <a className="back" href="#">← Back to Playlists</a>
      <h1>Add Playlist</h1>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Playlist Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Arrays"
            disabled={loading}
            autoFocus
          />
        </label>

        <label>
          YouTube Playlist URL
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/playlist?list=..."
            disabled={loading}
          />
        </label>

        {error && <p className="notice error" role="alert">{error}</p>}

        {duplicate && (
          <p className="notice" role="alert">
            This playlist has already been added (as {duplicate.name}).{" "}
            <a href={`#playlist/${duplicate.id}`}>Open Playlist</a>
          </p>
        )}

        <div className="actions">
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Fetching videos…" : "Add Playlist"}
          </button>
        </div>
      </form>
    </>
  );
}
