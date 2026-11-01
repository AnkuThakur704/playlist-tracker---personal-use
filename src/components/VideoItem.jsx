import { useState } from "react";
import { watchUrl } from "../youtube.js";

function NotesDialog({ title, note, onSave, onClose }) {
  const [draft, setDraft] = useState(note);
  const [saveStatus, setSaveStatus] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    const saved = onSave(draft);
    setSaveStatus(
      saved
        ? { success: true, message: "Notes saved to this browser." }
        : { success: false, message: "Could not save notes. Check this browser's storage and try again." }
    );
  }

  return (
    <div
      className="notes-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="notes-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notes-dialog-title"
        onKeyDown={(event) => {
          if (event.key === "Escape") onClose();
        }}
      >
        <h2 id="notes-dialog-title">Notes for {title}</h2>
        <form className="notes-form" onSubmit={handleSubmit}>
          <label htmlFor="video-notes">Your notes</label>
          <textarea
            id="video-notes"
            autoFocus
            rows={8}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          {saveStatus && (
            <p className={saveStatus.success ? "notice success" : "notice error"} role={saveStatus.success ? "status" : "alert"}>
              {saveStatus.message}
            </p>
          )}
          <div className="actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary">Save notes</button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function VideoItem({
  index,
  video,
  done,
  important,
  note,
  onSaveNote,
  onToggle,
  onToggleImportant,
}) {
  const [notesOpen, setNotesOpen] = useState(false);

  return (
    <li className={["video", done && "done", important && "important"].filter(Boolean).join(" ")}>
      <label>
        <input type="checkbox" checked={done} onChange={onToggle} />
        <span className="num">{String(index + 1).padStart(2, "0")}</span>
        <span className="title">{video.title}</span>
      </label>
      <div className="video-actions">
        <label className={important ? "important-toggle is-important" : "important-toggle"}>
          <input
            type="checkbox"
            checked={important}
            onChange={onToggleImportant}
            aria-label={`Mark ${video.title} as important`}
          />
          <span>Important</span>
        </label>
        <button type="button" onClick={() => setNotesOpen(true)} aria-label={`Notes for ${video.title}`}>
          Notes{note.trim() ? " *" : ""}
        </button>
        <a href={watchUrl(video.videoId)} target="_blank" rel="noopener noreferrer">Watch</a>
      </div>
      {notesOpen && (
        <NotesDialog
          title={video.title}
          note={note}
          onSave={onSaveNote}
          onClose={() => setNotesOpen(false)}
        />
      )}
    </li>
  );
}
