import {
  extractTrackIdFromUrl,
  validateSpotifyTrackId,
} from "./utils/parser.utils";
import {
  SpotifyPreviewError,
  NoPreviewAvailableError,
  SpotifyApiError,
} from "./errors";

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
 * @throws {InvalidTrackIdError} If the track ID format is invalid
 * @throws {InvalidSpotifyUrlError} If the Spotify URL is invalid
 * @throws {NoPreviewAvailableError} If no preview is available and `throws` is true
 * @throws {SpotifyApiError} If there's an issue with the Spotify API request
 */
async function getPreview<T extends GetPreviewOptions = {}>(
  track: string,
  options?: T
): Promise<T extends { throws: true } ? string : string | null> {
  let trackId: string;

  try {
    // Extract the track ID if a URL was provided
    if (track.includes("spotify.com")) {
      trackId = extractTrackIdFromUrl(track);
    } else {
      trackId = track;
      // Validate the track ID
      validateSpotifyTrackId(trackId);
    }
  } catch (error) {
    // Re-throw parser errors
    if (error instanceof SpotifyPreviewError) {
      throw error;
    }
    // Handle unexpected errors
    throw new SpotifyPreviewError(
      `Failed to process track identifier: ${error.message}`
    );
  }

  try {
    const response = await fetch(
      `https://open.spotify.com/embed/track/${trackId}`
    );

    if (!response.ok) {
      throw new SpotifyApiError(
        `Failed to fetch track preview data`,
        response.status
      );
    }

    const html = await response.text();
    const regex = /"audioPreview":\s*\{\s*"url":\s*"([^"]+)"\s*\}/;
    const match = html.match(regex);
    const url = match ? match[1] : null;

    if (!url || !url.includes("https://")) {
      if (options?.throws) {
        throw new NoPreviewAvailableError(trackId);
      }
      return null as any;
    }

    return url as any;
  } catch (error) {
    // Re-throw custom errors
    if (error instanceof SpotifyPreviewError) {
      throw error;
    }
    // Handle fetch or parsing errors
    throw new SpotifyApiError(`Failed to retrieve preview: ${error.message}`);
  }
}

export * from "./utils/parser.utils";
export * from "./errors";
export { getPreview };
