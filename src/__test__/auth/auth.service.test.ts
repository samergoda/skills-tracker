import { describe, expect, vi, beforeEach, type MockInstance, test } from "vitest";

// ── mock db ───────────────────────────────────────────────────────────────────
const mockFindFirst = vi.fn();
const mockFindMany = vi.fn();
const mockValues = vi.fn().mockReturnThis();
const mockReturning = vi.fn();

vi.mock("@/db/db", () => ({
  db: {
    query: {
      users: {
        findFirst: (args: unknown) => mockFindFirst(args),
        findMany: (args: unknown) => mockFindMany(args),
      },
    },
    insert: () => ({ values: mockValues.mockReturnValue({ returning: mockReturning }) }),
  },
}));

// ── mock schema ───────────────────────────────────────────────────────────────
vi.mock("@/db/schema", () => ({
  users: { id: "id", email: "email", createdAt: "createdAt", rule: "rule", firstName: "firstName", lastName: "lastName" },
  sessions: { id: "id", userId: "userId", expiresAt: "expiresAt" },
}));

// ── mock authTools ────────────────────────────────────────────────────────────
vi.mock("@/lib/util/authTools", () => ({
  comparePW: vi.fn(),
  hashPW: vi.fn(),
  createTokenForUser: vi.fn(),
  getUserFromToken: vi.fn(),
  getSession: vi.fn(),
  createSession: vi.fn(),
}));

// ── mock drizzle-orm operators ────────────────────────────────────────────────
vi.mock("drizzle-orm", () => ({ eq: vi.fn((col: unknown, val: unknown) => ({ col, val })) }));

import { login, signup } from "@/lib/services/auth.service";
import { comparePW, hashPW, createTokenForUser } from "@/lib/util/authTools";
import { CustomError } from "@/lib/util/customError";

const comparePWMock = comparePW as unknown as MockInstance;
const hashPWMock = hashPW as unknown as MockInstance;
const createTokenMock = createTokenForUser as unknown as MockInstance;

const MOCK_USER = {
  id: "user-1",
  email: "test@example.com",
  password: "hashed-pw",
  rule: "user",
  firstName: "John",
  lastName: "Doe",
  createdAt: "2024-01-01",
};

const MOCK_TOKEN = "mock.jwt.token";

describe("auth.service – login", () => {
  beforeEach(() => vi.clearAllMocks());

  test("returns user and token when credentials are valid", async () => {
    mockFindFirst.mockResolvedValue(MOCK_USER);
    comparePWMock.mockResolvedValue(true);
    createTokenMock.mockReturnValue(MOCK_TOKEN);

    const result = await login({ email: MOCK_USER.email, password: "password123" });

    expect(result.token).toBe(MOCK_TOKEN);
    expect(result.user).not.toHaveProperty("password");
    expect(result.user.email).toBe(MOCK_USER.email);
    expect(comparePW).toHaveBeenCalledWith("password123", MOCK_USER.password);
  });

  test("throws CustomError when password is incorrect", async () => {
    mockFindFirst.mockResolvedValue(MOCK_USER);
    comparePWMock.mockResolvedValue(false);

    await expect(login({ email: MOCK_USER.email, password: "wrong-pw" })).rejects.toThrow(CustomError);
  });
});

describe("auth.service – signup", () => {
  beforeEach(() => vi.clearAllMocks());

  test("inserts user, creates session, and returns token", async () => {
    const newUser = { ...MOCK_USER, id: "new-user-1" };
    hashPWMock.mockResolvedValue("hashed-new-pw");
    mockReturning.mockResolvedValue([newUser]);
    createTokenMock.mockReturnValue(MOCK_TOKEN);

    const result = await signup({
      email: "new@example.com",
      password: "password123",
      firstName: "Jane",
      lastName: "Doe",
    });

    expect(result.token).toBe(MOCK_TOKEN);
    expect(result.user.email).toBe(newUser.email);
    expect(hashPW).toHaveBeenCalledWith("password123");
  });
});
