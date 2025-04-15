import { LoggerOptions, LogLevel } from "../types/logger.types";

/**
 * Logger class for handling debug output in the spotify-audio-previews package.
 */
export class Logger {
  private level: LogLevel;
  private custom?: (level: string, message: string, data?: any) => void;
  private timestamps: boolean;
  private static currentLogger: Logger = new Logger(); // Default logger

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? LogLevel.NONE;
    this.custom = options.custom;
    this.timestamps = options.timestamps !== false;
  }

  /**
   * Get a timestamp string for log messages.
   */
  private getTimestamp(): string {
    if (!this.timestamps) return "";
    return `[${new Date().toISOString()}] `;
  }

  /**
   * Log an error message.
   */
  error(message: string, data?: any): void {
    if (this.level >= LogLevel.ERROR) {
      if (this.custom) {
        this.custom("ERROR", message, data);
      } else {
        console.error(
          `${this.getTimestamp()}[spotify-audio-previews ERROR] ${message}`,
          data !== undefined ? data : ""
        );
      }
    }
  }

  /**
   * Log a warning message.
   */
  warn(message: string, data?: any): void {
    if (this.level >= LogLevel.WARN) {
      if (this.custom) {
        this.custom("WARN", message, data);
      } else {
        console.warn(
          `${this.getTimestamp()}[spotify-audio-previews WARN] ${message}`,
          data !== undefined ? data : ""
        );
      }
    }
  }

  /**
   * Log an info message.
   */
  info(message: string, data?: any): void {
    if (this.level >= LogLevel.INFO) {
      if (this.custom) {
        this.custom("INFO", message, data);
      } else {
        console.info(
          `${this.getTimestamp()}[spotify-audio-previews INFO] ${message}`,
          data !== undefined ? data : ""
        );
      }
    }
  }

  /**
   * Log a debug message.
   */
  debug(message: string, data?: any): void {
    if (this.level >= LogLevel.DEBUG) {
      if (this.custom) {
        this.custom("DEBUG", message, data);
      } else {
        console.debug(
          `${this.getTimestamp()}[spotify-audio-previews DEBUG] ${message}`,
          data !== undefined ? data : ""
        );
      }
    }
  }

  /**
   * Set the log level.
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Get the current log level.
   */
  getLevel(): LogLevel {
    return this.level;
  }

  /**
   * Update this logger with given options.
   */
  configure(options: LoggerOptions): Logger {
    if (options.level !== undefined) {
      this.level = options.level;
    }
    if (options.custom !== undefined) {
      this.custom = options.custom;
    }
    if (options.timestamps !== undefined) {
      this.timestamps = options.timestamps;
    }
    return this;
  }

  /**
   * Create a copy of this logger
   */
  clone(): Logger {
    const cloned = new Logger();
    cloned.level = this.level;
    cloned.custom = this.custom;
    cloned.timestamps = this.timestamps;
    return cloned;
  }

  /**
   * Create a temporary logger with the given options, merged with this logger's options.
   *
   * @param options Options to apply to the temporary logger
   */
  withOptions(options: LoggerOptions): Logger {
    const temp = this.clone();
    return temp.configure(options);
  }

  /**
   * Get the current logger instance
   */
  static getCurrent(): Logger {
    return Logger.currentLogger;
  }

  /**
   * Configure the current logger with new options
   * @param options Logger configuration options
   */
  static configure(options: LoggerOptions): void {
    Logger.getCurrent().configure(options);
  }
}

/**
 * Global logger instance for the package.
 * This logger is used by default for all operations unless a custom logger is provided.
 */
export const logger = Logger.getCurrent();

/**
 * Performs an operation with a temporary logger with the specified options
 * without affecting the global logger.
 *
 * @param fn Function to execute with the temporary logger
 * @param options Logger options for this operation
 * @returns The result of the function
 */
export async function withLogger<T>(
  fn: (log: Logger) => Promise<T>,
  options?: LoggerOptions
): Promise<T> {
  // Create a temporary logger for this operation
  const tempLogger = logger.withOptions(options || {});

  // Execute the function with the temporary logger
  return await fn(tempLogger);
}
