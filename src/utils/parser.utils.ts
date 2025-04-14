import { InvalidSpotifyUrlError, InvalidTrackIdError } from "../errors";

/**
 * Extracts the track ID from a Spotify track URL.
 *
 * @param url - The Spotify track URL
 * @returns The track ID
 * @throws {InvalidSpotifyUrlError} If the URL doesn't contain a valid track ID
 */
function extractTrackIdFromUrl(url: string): string {
  if (!url.includes("spotify.com") || !url.includes("/track/")) {
    throw new InvalidSpotifyUrlError(url);
  }

  const regex = /\/track\/([a-zA-Z0-9]+)(?:\?|$)/;
  const match = url.match(regex);

  if (!match || !match[1]) {
    throw new InvalidSpotifyUrlError(url);
  }

  return match[1];
}

/**
 * Validates a Spotify track ID.
 *
 * @description Validates a Spotify track ID. A valid track ID is a 22-character alphanumeric string
 * @param trackId - The Spotify track ID to validate
 * @returns `true` if the track ID is valid
 * @throws {InvalidTrackIdError} If the track ID format is invalid
 */
function validateSpotifyTrackId(trackId: string): true {
  const regex = /^[a-zA-Z0-9]{22}$/;

  if (!regex.test(trackId)) {
    throw new InvalidTrackIdError(trackId);
  }

  return true;
}

export { extractTrackIdFromUrl, validateSpotifyTrackId };
