import { InvalidSpotifyUrlError, InvalidTrackIdError } from "../errors";
import { Logger, logger } from "../utils/logger.utils";

/**
 * Extracts the track ID from a Spotify track URL.
 *
 * @param url - The Spotify track URL
 * @param log - Optional logger to use (defaults to global logger)
 * @returns The track ID
 * @throws {InvalidSpotifyUrlError} If the URL doesn't contain a valid track ID
 */
function extractTrackIdFromUrl(url: string, log: Logger = logger): string {
  log.debug(`Extracting track ID from URL: ${url}`);

  if (!url.includes("spotify.com") || !url.includes("/track/")) {
    log.error(`URL does not contain "spotify.com" or "/track/": ${url}`);
    throw new InvalidSpotifyUrlError(url);
  }

  const regex = /\/track\/([a-zA-Z0-9]+)(?:\?|$)/;
  const match = url.match(regex);

  if (!match || !match[1]) {
    log.error(`Failed to extract track ID from URL: ${url}`);
    throw new InvalidSpotifyUrlError(url);
  }

  log.debug(`Successfully extracted track ID: ${match[1]}`);
  return match[1];
}

/**
 * Validates a Spotify track ID.
 *
 * @description Validates a Spotify track ID. A valid track ID is a 22-character alphanumeric string
 * @param trackId - The Spotify track ID to validate
 * @param log - Optional logger to use (defaults to global logger)
 * @returns `true` if the track ID is valid
 * @throws {InvalidTrackIdError} If the track ID format is invalid
 */
function validateSpotifyTrackId(trackId: string, log: Logger = logger): true {
  log.debug(`Validating track ID: ${trackId}`);
  const regex = /^[a-zA-Z0-9]{22}$/;

  if (!regex.test(trackId)) {
    log.error(
      `Invalid track ID format: ${trackId} (length: ${trackId.length})`
    );
    throw new InvalidTrackIdError(trackId);
  }

  log.debug(`Track ID is valid: ${trackId}`);
  return true;
}

export { extractTrackIdFromUrl, validateSpotifyTrackId };
