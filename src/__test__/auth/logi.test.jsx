import { describe, it, expect, vi, beforeEach } from "vitest";
import { signinUser, registerUser } from "@/lib/actions/auth";

// ── mock next/headers ────────────────────────────────────────────────────────
const mockCookieSet = vi.fn();
vi.mock("next/headers", () => ({
  cookies: vi.fn(() =>
    Promise.resolve({
      set: mockCookieSet,
      delete: vi.fn(),
      get: vi.fn(),
    })
  ),
}));

// ── mock auth service ─────────────────────────────────────────────────────────
vi.mock("@/lib/services/auth.service", () => ({
  login: vi.fn(),
  signup: vi.fn(),
}));

// ── mock authTools (createSession, etc.) ─────────────────────────────────────
vi.mock("@/lib/util/authTools", () => ({
  createSession: vi.fn().mockResolvedValue(undefined),
  getUserFromToken: vi.fn(),
  comparePW: vi.fn(),
  hashPW: vi.fn(),
  createTokenForUser: vi.fn(),
  getSession: vi.fn(),
}));

import { login, signup } from "@/lib/services/auth.service";

const MOCK_TOKEN = "mock.jwt.token";
const VALID_LOGIN = { email: "test@example.com", password: "password123" };
const VALID_SIGNUP = {
  email: "new@example.com",
  password: "password123",
  firstName: "John",
  lastName: "Doe",
};

describe("signinUser action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns success:true and sets cookie when credentials are valid", async () => {
    login.mockResolvedValue({ token: MOCK_TOKEN });

    const result = await signinUser(VALID_LOGIN);

    expect(result).toEqual({ success: true });
    expect(login).toHaveBeenCalledWith(VALID_LOGIN);
    expect(mockCookieSet).toHaveBeenCalledWith(
      "test-cookie",
      MOCK_TOKEN,
      expect.objectContaining({ httpOnly: true, secure: true })
    );
  });

  it("returns success:false with error when login service throws CustomError", async () => {
    const { CustomError } = await import("@/lib/util/customError");
    login.mockRejectedValue(new CustomError("INVALID_CREDENTIALS"));

    const result = await signinUser(VALID_LOGIN);

    expect(result).toEqual({ success: false, error: "Invalid email or password" });
  });

  it("returns success:false with generic error on unexpected failure", async () => {
    login.mockRejectedValue(new Error("DB connection failed"));

    const result = await signinUser(VALID_LOGIN);

    expect(result).toEqual({ success: false, error: "Unexpected error" });
  });

  it("returns success:false when form data is invalid (schema fails)", async () => {
    const result = await signinUser({ email: "bad-email", password: "123" });

    expect(result).toEqual({ success: false, error: "Invalid form data" });
    expect(login).not.toHaveBeenCalled();
  });
});

describe("registerUser action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns success:true and sets cookie when signup succeeds", async () => {
    signup.mockResolvedValue({ token: MOCK_TOKEN });

    const result = await registerUser(VALID_SIGNUP);

    expect(result).toEqual({ success: true });
    expect(signup).toHaveBeenCalledWith(VALID_SIGNUP);
    expect(mockCookieSet).toHaveBeenCalledWith(
      "test-cookie",
      MOCK_TOKEN,
      expect.objectContaining({ httpOnly: true, secure: true })
    );
  });

  it("returns success:false with error when signup service throws CustomError", async () => {
    const { CustomError } = await import("@/lib/util/customError");
    signup.mockRejectedValue(new CustomError("DUPLICATE_EMAIL"));

    const result = await registerUser(VALID_SIGNUP);

    expect(result).toEqual({ success: false, error: "Invalid email or password" });
  });

  it("returns success:false with generic error on unexpected failure", async () => {
    signup.mockRejectedValue(new Error("Network error"));

    const result = await registerUser(VALID_SIGNUP);

    expect(result).toEqual({ success: false, error: "Unexpected error" });
  });

  it("throws ZodError when required signup fields are missing", async () => {
    await expect(
      registerUser({ email: "test@test.com", password: "pass123", firstName: "", lastName: "" })
    ).rejects.toThrow();
  });
});
