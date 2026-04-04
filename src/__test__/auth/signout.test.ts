import { describe, it, expect, vi, beforeEach } from "vitest";

// ── mock server-only ──────────────────────────────────────────────────────────

// ── mock next/headers ────────────────────────────────────────────────────────
const mockCookieDelete = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      delete: mockCookieDelete,
      set: vi.fn(),
      get: vi.fn(),
    })
  ),
}));

// ── mock next/navigation ──────────────────────────────────────────────────────
const mockRedirect = vi.fn();
vi.mock("next/navigation", () => ({
  redirect: (path: string) => mockRedirect(path),
}));

import { signout } from "@/lib/actions/signout";

describe("signout action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes the auth cookie and redirects to /login", async () => {
    // redirect throws in Next.js (NEXT_REDIRECT), simulate the same
    mockRedirect.mockImplementation(() => {
      throw new Error("NEXT_REDIRECT");
    });

    await expect(signout()).rejects.toThrow("NEXT_REDIRECT");

    expect(mockCookieDelete).toHaveBeenCalledWith("test-cookie");
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });
});
