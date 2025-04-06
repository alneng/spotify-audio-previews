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

By default, `getPreview` returns `null` if no preview is available. You can configure it to throw an error instead:

```typescript
import { getPreview } from "spotify-audio-previews";

try {
  // Will throw if no preview is available
  const previewUrl = await getPreview("3zhbXKFjUDw40pTYyCgt1Y", {
    throws: true,
  });
  console.log(previewUrl);
} catch (error) {
  console.error("Preview not available:", error.message);
}
```

### Utility Functions

The package also exports utility functions for working with Spotify track IDs:

```typescript
import {
  extractTrackIdFromUrl,
  validateSpotifyTrackId,
} from "spotify-audio-previews";

// Extract track ID from a Spotify URL
const trackId = extractTrackIdFromUrl(
  "https://open.spotify.com/track/3zhbXKFjUDw40pTYyCgt1Y"
);
console.log(trackId); // 3zhbXKFjUDw40pTYyCgt1Y

// Validate a Spotify track ID
const isValid = validateSpotifyTrackId("3zhbXKFjUDw40pTYyCgt1Y");
console.log(isValid); // true
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

### `extractTrackIdFromUrl(url)`

Extracts the track ID from a Spotify track URL.

#### Parameters

- `url` (string): The Spotify track URL

#### Returns

- The track ID as a string, or `null` if no valid ID was found

### `validateSpotifyTrackId(trackId)`

Validates a Spotify track ID.

#### Parameters

- `trackId` (string): The Spotify track ID to validate

#### Returns

- `true` if the track ID is valid, `false` otherwise

## License

MIT
