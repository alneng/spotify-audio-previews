import { LoggerOptions } from "./logger.types";

/**
 * Options for getPreview function.
 */
export interface GetPreviewOptions {
  /**
   * Whether to throw an error if no preview URL is found
   * @default false
   */
  throws?: boolean;

  /**
   * Debug/logging options
   */
  logger?: LoggerOptions;
}

/**
 * Global configuration for the package.
 */
export interface SpotifyAudioPreviewsConfig {
  /**
   * Global logger configuration that applies to all operations
   */
  logger?: LoggerOptions;
}
