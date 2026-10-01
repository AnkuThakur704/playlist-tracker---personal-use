const API_URL = "https://www.googleapis.com/youtube/v3/playlistItems";
const API_KEY = import.meta.env?.VITE_YOUTUBE_API_KEY;

export class YouTubeError extends Error {}

/** Pull the playlist ID out of a YouTube URL. Throws a readable YouTubeError. */
export function extractPlaylistId(input) {
  let url;
  try {
    url = new URL(String(input).trim());
  } catch {
    throw new YouTubeError("That is not a valid URL.");
  }

  const host = url.hostname.replace(/^(www|m|music)\./, "");
  if (host !== "youtube.com" && host !== "youtu.be") {
    throw new YouTubeError("That is not a YouTube link.");
  }

  const id = url.searchParams.get("list");
  if (!id) {
    throw new YouTubeError('This link has no playlist ID. Use a link that contains "list=…".');
  }
  if (!/^[A-Za-z0-9_-]{10,}$/.test(id)) {
    throw new YouTubeError("The playlist ID in this link looks invalid.");
  }
  return id;
}

export function watchUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

function describeApiError(status, body) {
  const reason = body?.error?.errors?.[0]?.reason;
  const message = body?.error?.message;

  if (reason === "playlistNotFound" || reason === "playlistItemsNotAccessible") {
    return "Playlist not found. It may be private, deleted, or the link is wrong.";
  }
  if (reason === "quotaExceeded" || reason === "rateLimitExceeded") {
    return "YouTube API quota exceeded. Try again tomorrow.";
  }
  if (reason === "keyInvalid" || /api key/i.test(message ?? "")) {
    return "The YouTube API key is invalid. Check VITE_YOUTUBE_API_KEY.";
  }
  if (/referer/i.test(message ?? "")) {
    return "The API key is restricted and does not allow this website. Add this address to the key's allowed referrers.";
  }
  return `YouTube API error (${status})${message ? `: ${message}` : "."}`;
}

/**
 * Fetch every video in a playlist, in playlist order, following nextPageToken.
 * Returns [{ videoId, title }]. Throws a readable YouTubeError on any problem.
 */
export async function fetchPlaylistVideos(playlistId) {
  if (!API_KEY) {
    throw new YouTubeError(
      "No API key configured. Put VITE_YOUTUBE_API_KEY in .env and restart the dev server."
    );
  }

  const videos = [];
  const seen = new Set();
  let pageToken;

  do {
    const params = new URLSearchParams({
      part: "snippet",
      maxResults: "50",
      playlistId,
      key: API_KEY,
    });
    if (pageToken) params.set("pageToken", pageToken);

    let response;
    try {
      response = await fetch(`${API_URL}?${params}`);
    } catch {
      throw new YouTubeError("Network error. Check your connection and try again.");
    }

    let body = null;
    try {
      body = await response.json();
    } catch {
      /* non-JSON response */
    }

    if (!response.ok) throw new YouTubeError(describeApiError(response.status, body));

    for (const item of body?.items ?? []) {
      const videoId = item.snippet?.resourceId?.videoId;
      const title = item.snippet?.title;
      // YouTube keeps placeholder entries for removed/hidden videos; skip them.
      if (!videoId || title === "Deleted video" || title === "Private video") continue;
      // Progress is keyed by video ID, so a video listed twice is kept once.
      if (seen.has(videoId)) continue;
      seen.add(videoId);
      videos.push({ videoId, title });
    }

    pageToken = body?.nextPageToken;
  } while (pageToken);

  if (videos.length === 0) {
    throw new YouTubeError("This playlist has no available videos.");
  }
  return videos;
}
