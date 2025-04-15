import {
  extractTrackIdFromUrl,
  validateSpotifyTrackId,
} from "./utils/parser.utils";
import {
  SpotifyPreviewError,
  NoPreviewAvailableError,
  SpotifyApiError,
} from "./errors";
import { Logger, logger, withLogger } from "./utils/logger.utils";
import { GetPreviewOptions, SpotifyAudioPreviewsConfig } from "./types/index";

// Global configuration
let globalConfig: SpotifyAudioPreviewsConfig = {};

/**
 * Configure global settings for the Spotify Preview package.
 *
 * @param config - Configuration options
 */
function configure(config: SpotifyAudioPreviewsConfig): void {
  globalConfig = { ...globalConfig, ...config };

  if (config.logger) {
    Logger.configure(config.logger);
  }
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
  // If no logger options are provided, use the global logger
  if (!options?.logger) {
    return processTrack(track, options, logger);
  }

  // Use a temporary logger for this operation only
  return withLogger(
    async (log) => processTrack(track, options, log),
    options.logger
  );
}

/**
 * Internal function to process a track with a specific logger.
 */
async function processTrack<T extends GetPreviewOptions = {}>(
  track: string,
  options: T | undefined,
  log: Logger
): Promise<T extends { throws: true } ? string : string | null> {
  let trackId: string;
  log.info(`Processing track identifier: ${track}`);

  try {
    // Extract the track ID if a URL was provided
    if (track.includes("spotify.com")) {
      log.debug(`Treating input as a Spotify URL`);
      trackId = extractTrackIdFromUrl(track, log);
      log.info(`Extracted track ID: ${trackId} from URL`);
    } else {
      log.debug(`Treating input as a track ID`);
      trackId = track;
      // Validate the track ID
      validateSpotifyTrackId(trackId, log);
      log.info(`Validated track ID format: ${trackId}`);
    }
  } catch (error) {
    // Re-throw parser errors
    log.error(`Track identifier error`, error);
    if (error instanceof SpotifyPreviewError) {
      throw error;
    }
    // Handle unexpected errors
    throw new SpotifyPreviewError(
      `Failed to process track identifier: ${error.message}`
    );
  }

  try {
    const url = `https://open.spotify.com/embed/track/${trackId}`;
    log.debug(`Fetching from URL: ${url}`);

    const response = await fetch(url);
    log.debug(`Response status: ${response.status}`);

    if (!response.ok) {
      log.error(`API error: ${response.status} ${response.statusText}`);
      throw new SpotifyApiError(
        `Failed to fetch track preview data`,
        response.status
      );
    }

    const html = await response.text();

    const regex = /"audioPreview":\s*\{\s*"url":\s*"([^"]+)"\s*\}/;
    const match = html.match(regex);
    const previewUrl = match ? match[1] : null;

    if (!previewUrl || !previewUrl.includes("https://")) {
      log.warn(`No preview URL found for track ID: ${trackId}`);
      if (options?.throws) {
        throw new NoPreviewAvailableError(trackId);
      }
      return null as any;
    }

    log.info(`Found preview URL for track ID: ${trackId}`);
    log.debug(`Preview URL: ${previewUrl}`);
    return previewUrl as any;
  } catch (error) {
    // Re-throw custom errors
    if (error instanceof SpotifyPreviewError) {
      throw error;
    }
    // Handle fetch or parsing errors
    log.error(`Fetch or parsing error`, error);
    throw new SpotifyApiError(`Failed to retrieve preview: ${error.message}`);
  }
}

export { LogLevel } from "./types/index";
export { withLogger } from "./utils/logger.utils";
export * from "./utils/parser.utils";
export * from "./errors";
export { configure, getPreview };
