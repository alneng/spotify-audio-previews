/**
 * Extracts the track ID from a Spotify track URL.
 *
 * @param url - The Spotify track URL
 * @returns The track ID, or null if no valid ID was found
 */
function extractTrackIdFromUrl(url: string): string | null {
  const regex = /\/track\/([a-zA-Z0-9]+)(?:\?|$)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Validates a Spotify track ID.
 *
 * @description Validates a Spotify track ID. A valid track ID is a 22-character alphanumeric string
 * @param trackId - The Spotify track ID to validate
 * @returns `true` if the track ID is valid, `false` otherwise
 */
function validateSpotifyTrackId(trackId: string): boolean {
  const regex = /^[a-zA-Z0-9]{22}$/;
  return regex.test(trackId);
}

export { extractTrackIdFromUrl, validateSpotifyTrackId };
