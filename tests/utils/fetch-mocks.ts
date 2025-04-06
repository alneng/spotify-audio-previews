import { vi } from "vitest";

// Store the real fetch for later restoration
export const realFetch = fetch;

// Setup the mock fetch
export const setupMockFetch = () => {
  vi.stubGlobal("fetch", vi.fn());
};

// Helper to setup fetch mock responses
export function mockFetchResponse(response: string) {
  (fetch as any).mockResolvedValueOnce({
    text: () => Promise.resolve(response),
  });
}

// Restore real fetch implementation
export const restoreRealFetch = () => {
  vi.stubGlobal("fetch", realFetch);
};

// Clear all mocks
export const clearFetchMocks = () => {
  vi.clearAllMocks();
};
