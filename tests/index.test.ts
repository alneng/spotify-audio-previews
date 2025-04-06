import { getPreview } from "../src";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import {
  clearFetchMocks,
  mockFetchResponse,
  restoreRealFetch,
  setupMockFetch,
} from "./utils/fetch-mocks";

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

    test("should throw error when throws option is true and no preview URL is found", async () => {
      mockFetchResponse('{"someOtherData": "value"}');

      await expect(
        getPreview("1234567890123456789012", { throws: true })
      ).rejects.toThrow("No preview found for this track");
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

    test("should throw an error for invalid track ID", async () => {
      await expect(getPreview("invalid-id")).rejects.toThrow(
        "Invalid track ID or URL"
      );
    });

    test("should throw an error for invalid Spotify URL", async () => {
      await expect(
        getPreview("https://open.spotify.com/album/7tgTOUXm74GKA12wsQIUPu")
      ).rejects.toThrow("Invalid track ID or URL");
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

      test("should throw when throws option is true and track doesn't exist", async () => {
        // This is a well-formatted but non-existent track ID
        await expect(
          getPreview("1234567890123456789012", { throws: true })
        ).rejects.toThrow("No preview found for this track");
      }, 10000);
    }
  );
});
