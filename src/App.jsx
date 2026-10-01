import { useEffect, useState } from "react";
import { loadPlaylists, savePlaylists, STORAGE_KEY } from "./storage.js";
import Dashboard from "./components/Dashboard.jsx";
import AddPlaylist from "./components/AddPlaylist.jsx";
import PlaylistPage from "./components/PlaylistPage.jsx";

// Hash routing keeps the Back button and page refresh working with no router library.
function readRoute() {
  const hash = window.location.hash.slice(1);
  if (hash === "add") return { page: "add" };
  if (hash.startsWith("playlist/")) return { page: "playlist", id: hash.slice("playlist/".length) };
  return { page: "dashboard" };
}

export function go(hash) {
  window.location.hash = hash;
}

export default function App() {
  const [playlists, setPlaylists] = useState(loadPlaylists);
  const [route, setRoute] = useState(readRoute);
  const [saveFailed, setSaveFailed] = useState(false);

  // Persist on every change.
  useEffect(() => {
    setSaveFailed(!savePlaylists(playlists));
  }, [playlists]);

  // Follow the URL hash.
  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // If the app is open in two tabs, pick up changes from the other one
  // instead of overwriting them.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === STORAGE_KEY) setPlaylists(loadPlaylists());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function addPlaylist(playlist) {
    setPlaylists((current) => [...current, playlist]);
    go("");
  }

  function deletePlaylist(id) {
    setPlaylists((current) => current.filter((p) => p.id !== id));
    go("");
  }

  function toggleVideo(playlistId, videoId) {
    setPlaylists((current) =>
      current.map((p) => {
        if (p.id !== playlistId) return p; // other playlists are never touched
        const done = p.completedVideoIds.includes(videoId);
        return {
          ...p,
          completedVideoIds: done
            ? p.completedVideoIds.filter((id) => id !== videoId)
            : [...p.completedVideoIds, videoId],
        };
      })
    );
  }

  function resetProgress(playlistId) {
    setPlaylists((current) =>
      current.map((p) => (p.id === playlistId ? { ...p, completedVideoIds: [] } : p))
    );
  }

  const openPlaylist = playlists.find((p) => p.id === route.id);

  let content;
  if (route.page === "add") {
    content = <AddPlaylist playlists={playlists} onAdd={addPlaylist} />;
  } else if (route.page === "playlist" && openPlaylist) {
    content = (
      <PlaylistPage
        playlist={openPlaylist}
        onToggleVideo={toggleVideo}
        onReset={resetProgress}
      />
    );
  } else {
    content = <Dashboard playlists={playlists} onDelete={deletePlaylist} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <a href="#" className="app-title">StudyTrack</a>
      </header>
      {saveFailed && (
        <p className="notice error" role="alert">
          Could not save to this browser's storage. Progress will be lost on refresh.
        </p>
      )}
      <main>{content}</main>
    </div>
  );
}
