import { watchUrl } from "../youtube.js";

export default function VideoItem({ index, video, done, onToggle }) {
  return (
    <li className={done ? "video done" : "video"}>
      <label>
        <input type="checkbox" checked={done} onChange={onToggle} />
        <span className="num">{String(index + 1).padStart(2, "0")}</span>
        <span className="title">{video.title}</span>
      </label>
      <a href={watchUrl(video.videoId)} target="_blank" rel="noopener noreferrer">Watch</a>
    </li>
  );
}
