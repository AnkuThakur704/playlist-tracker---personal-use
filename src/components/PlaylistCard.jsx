import { useState } from "react";
import { countCompleted, percent } from "../storage.js";
import ProgressBar from "./ProgressBar.jsx";
import ConfirmBar from "./ConfirmBar.jsx";

export default function PlaylistCard({ playlist, onDelete }) {
  const [confirming, setConfirming] = useState(false);
  const total = playlist.videos.length;
  const done = countCompleted(playlist);

  return (
    <li className="card">
      <h2>{playlist.name}</h2>
      <p className="muted">{done} / {total} completed ({percent(done, total)}%)</p>
      <ProgressBar done={done} total={total} />

      {confirming ? (
        <ConfirmBar
          message={`Delete ${playlist.name} and all its saved progress?`}
          confirmLabel="Delete"
          onCancel={() => setConfirming(false)}
          onConfirm={() => onDelete(playlist.id)}
        />
      ) : (
        <div className="actions">
          <a className="button primary" href={`#playlist/${playlist.id}`}>Open Playlist</a>
          <button type="button" onClick={() => setConfirming(true)}>Delete</button>
        </div>
      )}
    </li>
  );
}
