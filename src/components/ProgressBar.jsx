import { percent } from "../storage.js";

export default function ProgressBar({ done, total }) {
  const pct = percent(done, total);
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Completion"
    >
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
