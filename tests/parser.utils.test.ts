import { describe, expect, it } from "vitest";
import { extractTrackIdFromUrl, validateSpotifyTrackId } from "../src";
import { InvalidSpotifyUrlError, InvalidTrackIdError } from "../src";

describe("extractTrackIdFromUrl", () => {
  it("should extract track ID from a standard Spotify track URL", () => {
    const url = "https://open.spotify.com/track/3zhbXKFjUDw40pTYyCgt1Y";
    expect(extractTrackIdFromUrl(url)).toBe("3zhbXKFjUDw40pTYyCgt1Y");
  });

  it("should extract track ID from a Spotify URL with query parameters", () => {
    const url =
      "https://open.spotify.com/track/3zhbXKFjUDw40pTYyCgt1Y?si=f850d1f074e64db4";
    expect(extractTrackIdFromUrl(url)).toBe("3zhbXKFjUDw40pTYyCgt1Y");
  });

  it("should throw InvalidSpotifyUrlError for a Spotify URL without a track path", () => {
    const url = "https://open.spotify.com/album/7tgTOUXm74GKA12wsQIUPu";
    expect(() => extractTrackIdFromUrl(url)).toThrow(InvalidSpotifyUrlError);
    expect(() => extractTrackIdFromUrl(url)).toThrow("Invalid Spotify URL");
  });

  it("should throw InvalidSpotifyUrlError for a non-Spotify URL", () => {
    const url = "https://www.google.com";
    expect(() => extractTrackIdFromUrl(url)).toThrow(InvalidSpotifyUrlError);
  });

  it("should throw InvalidSpotifyUrlError for a completely invalid URL", () => {
    const url = "not-a-valid-url";
    expect(() => extractTrackIdFromUrl(url)).toThrow(InvalidSpotifyUrlError);
  });
});

describe("validateSpotifyTrackId", () => {
  it("should return true for a valid Spotify track ID (22 alphanumeric characters)", () => {
    const trackId = "3zhbXKFjUDw40pTYyCgt1Y";
    expect(validateSpotifyTrackId(trackId)).toBe(true);
  });

  it("should throw InvalidTrackIdError for a track ID that is too short", () => {
    const trackId = "3zhbXKFjUDw40pTYyCgt1";
    expect(() => validateSpotifyTrackId(trackId)).toThrow(InvalidTrackIdError);
    expect(() => validateSpotifyTrackId(trackId)).toThrow(
      "Invalid track ID format"
    );
  });

  it("should throw InvalidTrackIdError for a track ID that is too long", () => {
    const trackId = "3zhbXKFjUDw40pTYyCgt1Ya";
    expect(() => validateSpotifyTrackId(trackId)).toThrow(InvalidTrackIdError);
  });

  it("should throw InvalidTrackIdError for a track ID with invalid characters", () => {
    const trackId = "3zhbXKFjUDw-0pTYyCgt1Y";
    expect(() => validateSpotifyTrackId(trackId)).toThrow(InvalidTrackIdError);
  });
});
