import { useState } from "react";
import { countCompleted, percent } from "../storage.js";
import ProgressBar from "./ProgressBar.jsx";
import ConfirmBar from "./ConfirmBar.jsx";
import VideoItem from "./VideoItem.jsx";

export default function PlaylistPage({ playlist, onToggleVideo, onReset }) {
  const [confirmingReset, setConfirmingReset] = useState(false);
  const total = playlist.videos.length;
  const done = countCompleted(playlist);
  const completedIds = new Set(playlist.completedVideoIds);

  return (
    <>
      <a className="back" href="#">← Back to Playlists</a>
      <h1>{playlist.name}</h1>
      <p className="muted">{done} / {total} completed ({percent(done, total)}%)</p>
      <ProgressBar done={done} total={total} />

      {confirmingReset ? (
        <ConfirmBar
          message={`Reset progress for ${playlist.name}? The playlist stays; all checkmarks are cleared.`}
          confirmLabel="Reset"
          onCancel={() => setConfirmingReset(false)}
          onConfirm={() => {
            onReset(playlist.id);
            setConfirmingReset(false);
          }}
        />
      ) : (
        <div className="actions">
          <button type="button" onClick={() => setConfirmingReset(true)} disabled={done === 0}>
            Reset Progress
          </button>
        </div>
      )}

      <ol className="video-list">
        {playlist.videos.map((video, index) => (
          <VideoItem
            key={video.videoId}
            index={index}
            video={video}
            done={completedIds.has(video.videoId)}
            onToggle={() => onToggleVideo(playlist.id, video.videoId)}
          />
        ))}
      </ol>
    </>
  );
}
