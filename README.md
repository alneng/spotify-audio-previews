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
- Comprehensive debug/logging system

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

### Debug Mode

The library includes a comprehensive debug system to help troubleshoot issues:

```typescript
import { getPreview, LogLevel } from "spotify-audio-previews";

// Enable debug logging for a specific operation
const previewUrl = await getPreview("3zhbXKFjUDw40pTYyCgt1Y", {
  logger: {
    level: LogLevel.DEBUG, // Show all debug information
    timestamps: true, // Include timestamps in logs
  },
});

// Console output will include detailed debug information:
// [2025-04-14T12:34:56.789Z] [spotify-audio-previews DEBUG] Treating input as a track ID
// [2025-04-14T12:34:56.790Z] [spotify-audio-previews DEBUG] Validating track ID: 3zhbXKFjUDw40pTYyCgt1Y
// ...etc
```

### Global Logging Configuration

You can configure logging globally for all operations using the `configure` function:

```typescript
import { configure, getPreview, LogLevel } from "spotify-audio-previews";

// Configure global settings including the logger
configure({
  logger: {
    level: LogLevel.INFO, // Show info, warnings and errors
    timestamps: true,
  },
});

// All subsequent operations will use this logging configuration
const url1 = await getPreview("3zhbXKFjUDw40pTYyCgt1Y");
const url2 = await getPreview(
  "https://open.spotify.com/track/3zhbXKFjUDw40pTYyCgt1Y"
);
```

### Custom Logger Integration

You can integrate with your application's logging system:

```typescript
import { configure, LogLevel } from "spotify-audio-previews";
import winston from "winston"; // Example using Winston logger

// Configure a custom logger globally
configure({
  logger: {
    level: LogLevel.DEBUG,
    custom: (level, message, data) => {
      switch (level) {
        case "ERROR":
          winston.error(`[Spotify] ${message}`, data);
          break;
        case "WARN":
          winston.warn(`[Spotify] ${message}`, data);
          break;
        case "INFO":
          winston.info(`[Spotify] ${message}`, data);
          break;
        case "DEBUG":
          winston.debug(`[Spotify] ${message}`, data);
          break;
      }
    },
  },
});

// Or configure a custom logger for a specific operation
const previewUrl = await getPreview("3zhbXKFjUDw40pTYyCgt1Y", {
  logger: {
    level: LogLevel.DEBUG,
    custom: (level, message, data) => {
      // Your custom logging implementation
    },
  },
});
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
  - `logger` (object, optional): Debug logging configuration
    - `level` (LogLevel): Logging level (default: `LogLevel.NONE`)
    - `timestamps` (boolean): Whether to include timestamps in logs (default: `true`)
    - `custom` (function): Custom logger function (default: `undefined`)

#### Returns

- A promise that resolves to the preview URL string, or `null` if no preview is available and `throws` is `false`

#### Throws

- `InvalidTrackIdError`: If the track ID format is invalid
- `InvalidSpotifyUrlError`: If the Spotify URL is invalid
- `NoPreviewAvailableError`: If no preview is available and `throws` is `true`
- `SpotifyApiError`: If there's an issue with the Spotify API request

### `configure(config)`

Configures global settings for the package.

#### Parameters

- `config` (object): Global configuration options
  - `logger` (object, optional): Logger configuration
    - `level` (LogLevel): Logging level
    - `timestamps` (boolean): Whether to include timestamps in logs
    - `custom` (function): Custom logger function

### `extractTrackIdFromUrl(url, log?)`

Extracts the track ID from a Spotify track URL.

#### Parameters

- `url` (string): The Spotify track URL
- `log` (Logger, optional): Logger instance to use for this operation (defaults to global logger)

#### Returns

- The track ID as a string

#### Throws

- `InvalidSpotifyUrlError`: If the URL doesn't contain a valid track ID

#### Example with logger

```typescript
import {
  withLogger,
  LogLevel,
  extractTrackIdFromUrl,
} from "spotify-audio-previews";

// Use withLogger to create a temporary logger for specific operations
const id = await withLogger(
  async (log) =>
    extractTrackIdFromUrl(
      "https://open.spotify.com/track/3zhbXKFjUDw40pTYyCgt1Y",
      log
    ),
  {
    level: LogLevel.DEBUG,
  }
); // 3zhbXKFjUDw40pTYyCgt1Y
```

### `validateSpotifyTrackId(trackId, log?)`

Validates a Spotify track ID.

#### Parameters

- `trackId` (string): The Spotify track ID to validate
- `log` (Logger, optional): Logger instance to use for this operation (defaults to global logger)

#### Returns

- `true` if the track ID is valid

#### Throws

- `InvalidTrackIdError`: If the track ID format is invalid

### `withLogger(fn, options?)`

Creates a temporary logger for a specific operation without affecting the global logger.

#### Parameters

- `fn` (function): Function to execute with the temporary logger
  - The function receives a logger instance as its first parameter
  - The function should return a Promise
- `options` (LoggerOptions, optional): Logger configuration options
  - `level` (LogLevel): Logging level
  - `timestamps` (boolean): Whether to include timestamps in logs
  - `custom` (function): Custom logger function

#### Returns

- A promise that resolves to the result of the function

### `LogLevel`

Enum representing available log levels:

- `LogLevel.NONE` (0): No debugging output
- `LogLevel.ERROR` (1): Only errors
- `LogLevel.WARN` (2): Errors and warnings
- `LogLevel.INFO` (3): Errors, warnings, and basic info
- `LogLevel.DEBUG` (4): All debug information including detailed request/response data

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
