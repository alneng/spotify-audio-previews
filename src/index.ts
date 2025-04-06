import {
  extractTrackIdFromUrl,
  validateSpotifyTrackId,
} from "./utils/parser.utils";

/**
 * Options for getPreview function.
 */
interface GetPreviewOptions {
  /**
   * Whether to throw an error if no preview URL is found
   * @default false
   */
  throws?: boolean;
}

/**
 * Gets an audio preview url for a Spotify track.
 *
 * @param track - Either a track ID (e.g. "308Ir17KlNdlrbVLHWhlLe") or a track URL (e.g. "open.spotify.com/track/308Ir17KlNdlrbVLHWhlLe")
 * @param options - Configuration options
 * @returns The track preview URL, or null if no preview found and `throws` is false
 * @throws `Error` if the track ID is invalid, or if no preview found and `throws` is true
 */
async function getPreview<T extends GetPreviewOptions = {}>(
  track: string,
  options?: T
): Promise<T extends { throws: true } ? string : string | null> {
  const trackId = track.includes("spotify.com")
    ? extractTrackIdFromUrl(track)
    : track;

  if (!trackId || !validateSpotifyTrackId(trackId)) {
    throw new Error("Invalid track ID or URL");
  }

  const response = await fetch(
    `https://open.spotify.com/embed/track/${trackId}`
  );
  const html = await response.text();

  const regex = /"audioPreview":\s*\{\s*"url":\s*"([^"]+)"\s*\}/;
  const match = html.match(regex);
  const url = match ? match[1] : null;

  if (!url || !url.includes("https://")) {
    if (options?.throws) {
      throw new Error("No preview found for this track");
    }
    return null as any;
  }

  return url;
}

export * from "./utils/parser.utils";
export { getPreview };
