import { countCompleted, percent } from "../storage.js";
import PlaylistCard from "./PlaylistCard.jsx";

export default function Dashboard({ playlists, onDelete }) {
  const totalVideos = playlists.reduce((n, p) => n + p.videos.length, 0);
  const completed = playlists.reduce((n, p) => n + countCompleted(p), 0);

  return (
    <>
      <h1>All Playlists</h1>

      <dl className="stats">
        <div><dt>Total Playlists</dt><dd>{playlists.length}</dd></div>
        <div><dt>Total Videos</dt><dd>{totalVideos}</dd></div>
        <div><dt>Completed</dt><dd>{completed}</dd></div>
        <div><dt>Overall Progress</dt><dd>{percent(completed, totalVideos)}%</dd></div>
      </dl>

      {playlists.length === 0 && (
        <p className="muted">No playlists yet. Add a YouTube playlist to start tracking.</p>
      )}

      <ul className="card-list">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist.id} playlist={playlist} onDelete={onDelete} />
        ))}
      </ul>

      <a className="button primary" href="#add">+ Add Playlist</a>
    </>
  );
}
