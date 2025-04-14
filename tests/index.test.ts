import { getPreview } from "../src";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import {
  clearFetchMocks,
  mockFetchResponse,
  mockFetchErrorResponse,
  mockFetchNetworkError,
  mockFetchTimeout,
  restoreRealFetch,
  setupMockFetch,
} from "./utils/fetch-mocks";
import {
  InvalidTrackIdError,
  InvalidSpotifyUrlError,
  NoPreviewAvailableError,
  SpotifyApiError,
} from "../src";

// Set up the mock fetch
setupMockFetch();

describe("getPreview", () => {
  beforeEach(() => {
    clearFetchMocks();
  });

  // Mock Tests
  describe("Mock Tests", () => {
    test("should extract preview URL from HTML response", async () => {
      const mockPreviewUrl = "https://example.com/preview.mp3";
      const mockHtml = `{"audioPreview": {"url": "${mockPreviewUrl}"}}`;

      mockFetchResponse(mockHtml);

      const result = await getPreview("1234567890123456789012");

      expect(fetch).toHaveBeenCalledWith(
        "https://open.spotify.com/embed/track/1234567890123456789012"
      );
      expect(result).toBe(mockPreviewUrl);
    });

    test("should extract preview URL from HTML response (options.throws = true)", async () => {
      const mockPreviewUrl = "https://example.com/preview.mp3";
      const mockHtml = `{"audioPreview": {"url": "${mockPreviewUrl}"}}`;

      mockFetchResponse(mockHtml);

      const result = await getPreview("1234567890123456789012", {
        throws: true,
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://open.spotify.com/embed/track/1234567890123456789012"
      );
      expect(result).toBe(mockPreviewUrl);
    });

    test("should return null when no preview URL is found", async () => {
      mockFetchResponse('{"someOtherData": "value"}');

      const result = await getPreview("1234567890123456789012");

      expect(result).toBeNull();
    });

    test("should throw NoPreviewAvailableError when throws option is true and no preview URL is found", async () => {
      mockFetchResponse('{"someOtherData": "value"}');

      const error = await getPreview("1234567890123456789012", {
        throws: true,
      }).catch((e) => e);

      expect(error).toBeInstanceOf(NoPreviewAvailableError);
      expect(error.message).toContain(
        "No audio preview available for track ID"
      );
      expect(error.trackId).toBe("1234567890123456789012");
    });

    test("should extract track ID from Spotify URL", async () => {
      const mockPreviewUrl = "https://example.com/preview.mp3";
      const mockHtml = `{"audioPreview": {"url": "${mockPreviewUrl}"}}`;

      mockFetchResponse(mockHtml);

      const result = await getPreview(
        "https://open.spotify.com/track/1234567890123456789012"
      );

      expect(fetch).toHaveBeenCalledWith(
        "https://open.spotify.com/embed/track/1234567890123456789012"
      );
      expect(result).toBe(mockPreviewUrl);
    });

    describe("Error Handling", () => {
      test("should throw InvalidTrackIdError for invalid track ID", async () => {
        const error = await getPreview("invalid-id").catch((e) => e);

        expect(error).toBeInstanceOf(InvalidTrackIdError);
        expect(error.message).toContain("Invalid track ID format");
        expect(error.name).toBe("InvalidTrackIdError");
      });

      test("should throw InvalidSpotifyUrlError for invalid Spotify URL", async () => {
        const error = await getPreview(
          "https://open.spotify.com/album/7tgTOUXm74GKA12wsQIUPu"
        ).catch((e) => e);

        expect(error).toBeInstanceOf(InvalidSpotifyUrlError);
        expect(error.message).toContain("Invalid Spotify URL");
        expect(error.name).toBe("InvalidSpotifyUrlError");
      });

      test("should throw SpotifyApiError when fetch fails with network error", async () => {
        mockFetchNetworkError("Network failure");

        const error = await getPreview("1234567890123456789012").catch(
          (e) => e
        );

        expect(error).toBeInstanceOf(SpotifyApiError);
        expect(error.message).toContain("Failed to retrieve preview");
        expect(error.statusCode).toBeUndefined();
      });

      test("should throw SpotifyApiError when fetch times out", async () => {
        mockFetchTimeout();

        const error = await getPreview("1234567890123456789012").catch(
          (e) => e
        );

        expect(error).toBeInstanceOf(SpotifyApiError);
        expect(error.message).toContain("Failed to retrieve preview");
      });

      test("should throw SpotifyApiError for 500 response", async () => {
        mockFetchErrorResponse(500, "Server Error");

        const error = await getPreview("1234567890123456789012").catch(
          (e) => e
        );

        expect(error).toBeInstanceOf(SpotifyApiError);
        expect(error.message).toContain("Failed to fetch track preview data");
        expect(error.statusCode).toBe(500);
      });

      test("should throw SpotifyApiError for 429 rate limit response", async () => {
        mockFetchErrorResponse(429, "Too Many Requests");

        const error = await getPreview("1234567890123456789012").catch(
          (e) => e
        );

        expect(error).toBeInstanceOf(SpotifyApiError);
        expect(error.message).toContain("Failed to fetch track preview data");
        expect(error.statusCode).toBe(429);
      });
    });
  });

  // Real Network Tests
  describe(
    "Real Network Tests",
    { skip: !process.env.INCLUDE_NETWORK_TESTS },
    () => {
      beforeEach(() => {
        // Restore real fetch for network tests
        restoreRealFetch();
      });

      afterEach(() => {
        // Restore mock after tests
        setupMockFetch();
      });

      test("should retrieve actual preview URL for track ID 3zhbXKFjUDw40pTYyCgt1Y", async () => {
        const expectedUrl =
          "https://p.scdn.co/mp3-preview/7cf97f0a388ecdc193e15ab7dd564d3e8e2e7706";
        const result = await getPreview("3zhbXKFjUDw40pTYyCgt1Y");

        expect(result).toBe(expectedUrl);
      }, 10000);

      test("should retrieve actual preview URL with full Spotify URL", async () => {
        const expectedUrl =
          "https://p.scdn.co/mp3-preview/03da60c2f50af6117cbf0af414a5d4e1fa72f24f";
        const result = await getPreview(
          "https://open.spotify.com/track/3Jscz9ODgRCDQKyFtJPIyW"
        );

        expect(result).toBe(expectedUrl);
      }, 10000);

      test("should handle invalid but well-formatted track IDs gracefully", async () => {
        // This is a well-formatted but non-existent track ID
        const result = await getPreview("1234567890123456789012");

        expect(result).toBeNull();
      }, 10000);

      test("should throw NoPreviewAvailableError when throws option is true and track doesn't exist", async () => {
        // This is a well-formatted but non-existent track ID
        const error = await getPreview("1234567890123456789012", {
          throws: true,
        }).catch((e) => e);

        expect(error).toBeInstanceOf(NoPreviewAvailableError);
        expect(error.message).toContain(
          "No audio preview available for track ID"
        );
        expect(error.trackId).toBe("1234567890123456789012");
      }, 10000);
    }
  );
});
