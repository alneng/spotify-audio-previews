# spotify-audio-previews

A lightweight TypeScript library to fetch 30-second audio preview URLs for Spotify tracks.

## Installation

```bash
# npm
npm install spotify-audio-previews

# yarn
yarn add spotify-audio-previews

# pnpm
pnpm add spotify-audio-previews
```

## Features

- Get audio preview URLs for any Spotify track
- Works with both track IDs and Spotify URLs
- No API key or authentication required
- Written in TypeScript with full type definitions
- Zero dependencies

## Usage

### Basic Usage

```typescript
import { getPreview } from "spotify-audio-previews";

// Using a Spotify track ID
const previewUrl = await getPreview("3zhbXKFjUDw40pTYyCgt1Y");
console.log(previewUrl); // https://p.scdn.co/mp3-preview/...

// Using a Spotify track URL
const previewFromUrl = await getPreview(
  "https://open.spotify.com/track/3zhbXKFjUDw40pTYyCgt1Y"
);
console.log(previewFromUrl); // https://p.scdn.co/mp3-preview/...
```

### Error Handling

The library provides specific error types for better error handling:

```typescript
import {
  getPreview,
  SpotifyPreviewError,
  InvalidTrackIdError,
  InvalidSpotifyUrlError,
  NoPreviewAvailableError,
  SpotifyApiError,
} from "spotify-audio-previews";

try {
  // Will throw if no preview is available
  const previewUrl = await getPreview("3zhbXKFjUDw40pTYyCgt1Y", {
    throws: true,
  });
  console.log(previewUrl);
} catch (error) {
  if (error instanceof NoPreviewAvailableError) {
    console.log(`No preview available for track: ${error.trackId}`);
  } else if (error instanceof InvalidTrackIdError) {
    console.log(`Invalid track ID format: ${error.message}`);
  } else if (error instanceof InvalidSpotifyUrlError) {
    console.log(`Invalid Spotify URL: ${error.message}`);
  } else if (error instanceof SpotifyApiError) {
    console.log(`API error (status ${error.statusCode}): ${error.message}`);
  } else if (error instanceof SpotifyPreviewError) {
    console.log(`General preview error: ${error.message}`);
  } else {
    console.log(`Unexpected error: ${error.message}`);
  }
}
```

### Utility Functions

The package also exports utility functions for working with Spotify track IDs:

```typescript
import {
  extractTrackIdFromUrl,
  validateSpotifyTrackId,
} from "spotify-audio-previews";

try {
  // Extract track ID from a Spotify URL
  const trackId = extractTrackIdFromUrl(
    "https://open.spotify.com/track/3zhbXKFjUDw40pTYyCgt1Y"
  );
  console.log(trackId); // 3zhbXKFjUDw40pTYyCgt1Y

  // Validate a Spotify track ID
  validateSpotifyTrackId("3zhbXKFjUDw40pTYyCgt1Y"); // Returns true or throws InvalidTrackIdError
  console.log("Track ID is valid");
} catch (error) {
  if (error instanceof InvalidSpotifyUrlError) {
    console.log(`URL parsing error: ${error.message}`);
  } else if (error instanceof InvalidTrackIdError) {
    console.log(`ID validation error: ${error.message}`);
  }
}
```

## API Reference

### `getPreview(track, options?)`

Fetches the audio preview URL for a Spotify track.

#### Parameters

- `track` (string): A Spotify track ID or URL
- `options` (object, optional): Configuration options
  - `throws` (boolean): Whether to throw an error if no preview is found (default: `false`)

#### Returns

- A promise that resolves to the preview URL string, or `null` if no preview is available and `throws` is `false`

#### Throws

- `InvalidTrackIdError`: If the track ID format is invalid
- `InvalidSpotifyUrlError`: If the Spotify URL is invalid
- `NoPreviewAvailableError`: If no preview is available and `throws` is `true`
- `SpotifyApiError`: If there's an issue with the Spotify API request

### `extractTrackIdFromUrl(url)`

Extracts the track ID from a Spotify track URL.

#### Parameters

- `url` (string): The Spotify track URL

#### Returns

- The track ID as a string

#### Throws

- `InvalidSpotifyUrlError`: If the URL doesn't contain a valid track ID

### `validateSpotifyTrackId(trackId)`

Validates a Spotify track ID.

#### Parameters

- `trackId` (string): The Spotify track ID to validate

#### Returns

- `true` if the track ID is valid

#### Throws

- `InvalidTrackIdError`: If the track ID format is invalid

## Error Types

### `SpotifyPreviewError`

Base error class that all other errors extend from.

### `InvalidTrackIdError`

Thrown when an invalid track ID format is provided.

### `InvalidSpotifyUrlError`

Thrown when an invalid Spotify URL is provided.

### `NoPreviewAvailableError`

Thrown when no preview is available for a track (only when `throws: true` is set).

Properties:

- `trackId`: The track ID for which no preview was available

### `SpotifyApiError`

Thrown when there's a network or API issue.

Properties:

- `statusCode`: The HTTP status code (if available)

## License

MIT
