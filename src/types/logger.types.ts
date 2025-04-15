/**
 * Log levels for the spotify-audio-previews package.
 */
export enum LogLevel {
  /**
   * No debug output
   */
  NONE = 0,

  /**
   * Only errors
   */
  ERROR = 1,

  /**
   * Errors and warnings
   */
  WARN = 2,

  /**
   * Errors, warnings, and basic info
   */
  INFO = 3,

  /**
   * All debug information, including detailed request/response data
   */
  DEBUG = 4,
}

/**
 * Logger options for configuring debug output.
 */
export interface LoggerOptions {
  /**
   * The log level to use
   * @default LogLevel.NONE
   */
  level?: LogLevel;

  /**
   * Custom logger function to use instead of console
   * Function receives log level, message, and optional data.
   */
  custom?: (level: string, message: string, data?: any) => void;

  /**
   * Whether to include timestamps in log messages
   * @default true
   */
  timestamps?: boolean;
}
