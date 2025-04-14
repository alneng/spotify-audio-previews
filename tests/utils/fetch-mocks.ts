import { vi } from "vitest";

// Store the real fetch for later restoration
export const realFetch = fetch;

// Setup the mock fetch
export const setupMockFetch = () => {
  vi.stubGlobal("fetch", vi.fn());
};

/**
 * Helper to setup fetch mock responses with successful status
 * @param response - Response body as string
 * @param status - HTTP status code (default: 200)
 */
export function mockFetchResponse(response: string, status = 200) {
  (fetch as any).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(response),
  });
}

/**
 * Helper to setup fetch mock error responses
 * @param status - HTTP status code
 * @param statusText - Status text message
 */
export function mockFetchErrorResponse(status: number, statusText: string) {
  (fetch as any).mockResolvedValueOnce({
    ok: false,
    status,
    statusText,
    text: () => Promise.resolve(`{"error":"${statusText}"}`),
  });
}

/**
 * Helper to setup fetch network errors
 * @param errorMessage - Error message for the network failure
 */
export function mockFetchNetworkError(errorMessage: string) {
  (fetch as any).mockRejectedValueOnce(new Error(errorMessage));
}

// Helper to setup fetch timeout errors
export function mockFetchTimeout() {
  (fetch as any).mockRejectedValueOnce(new Error("Request timed out"));
}

// Restore real fetch implementation
export const restoreRealFetch = () => {
  vi.stubGlobal("fetch", realFetch);
};

// Clear all mocks
export const clearFetchMocks = () => {
  vi.clearAllMocks();
};
