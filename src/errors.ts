/**
 * Base error class for all Spotify preview-related errors.
 */
export class SpotifyPreviewError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error thrown when an invalid track ID format is provided.
 */
export class InvalidTrackIdError extends SpotifyPreviewError {
  constructor(trackId: string) {
    super(
      `Invalid track ID format: "${trackId}". Track ID must be a 22-character alphanumeric string.`
    );
  }
}

/**
 * Error thrown when an invalid Spotify URL is provided.
 */
export class InvalidSpotifyUrlError extends SpotifyPreviewError {
  constructor(url: string) {
    super(
      `Invalid Spotify URL: "${url}". URL must contain "/track/" followed by a valid track ID.`
    );
  }
}

/**
 * Error thrown when no preview is available for a track.
 */
export class NoPreviewAvailableError extends SpotifyPreviewError {
  trackId: string;

  constructor(trackId: string) {
    super(`No audio preview available for track ID: "${trackId}".`);
    this.trackId = trackId;
  }
}

/**
 * Error thrown when there's a network or API issue.
 */
export class SpotifyApiError extends SpotifyPreviewError {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(
      `Spotify API error: ${message}${
        statusCode ? ` (Status: ${statusCode})` : ""
      }`
    );
    this.statusCode = statusCode;
  }
}
