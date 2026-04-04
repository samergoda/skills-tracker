import { describe, it, expect, vi, beforeEach } from "vitest";
import { CustomError } from "@/lib/util/customError";

// ── mock drizzle-orm ──────────────────────────────────────────────────────────
vi.mock("drizzle-orm", () => ({
  eq: vi.fn((col, val) => ({ col, val })),
}));

// ── mock db ───────────────────────────────────────────────────────────────────
const mockFindFirst = vi.fn();
const mockFindMany = vi.fn();
const mockSet = vi.fn().mockReturnThis();
const mockWhere = vi.fn().mockReturnThis();
const mockReturning = vi.fn();

vi.mock("@/db/db", () => ({
  db: {
    query: {
      users: {
        findFirst: (...args: unknown[]) => mockFindFirst(...args),
        findMany: (...args: unknown[]) => mockFindMany(...args),
      },
    },
    update: () => ({ set: mockSet.mockReturnValue({ where: mockWhere.mockReturnValue({ returning: mockReturning }) }) }),
  },
}));

// ── mock schema ───────────────────────────────────────────────────────────────
vi.mock("@/db/schema", () => ({
  users: {
    id: "id",
    email: "email",
    createdAt: "createdAt",
    rule: "rule",
    firstName: "firstName",
    lastName: "lastName",
  },
}));

// ── mock authTools ────────────────────────────────────────────────────────────
vi.mock("@/lib/util/authTools", () => ({
  hashPW: vi.fn(),
  comparePW: vi.fn(),
  createTokenForUser: vi.fn(),
  getUserFromToken: vi.fn(),
  getSession: vi.fn(),
  createSession: vi.fn(),
}));

import { getAllUsers, getUser, updateUser, updateUserRule } from "@/lib/services/user.service";
import { hashPW } from "@/lib/util/authTools";
const mockedHashPW = vi.mocked(hashPW);

const MOCK_USER = {
  id: "user-1",
  email: "test@example.com",
  password: "hashed-pw",
  rule: "user" as const,
  firstName: "John",
  lastName: "Doe",
  createdAt: "2024-01-01",
};

describe("user.service – getAllUsers", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns all users from the database", async () => {
    mockFindMany.mockResolvedValue([MOCK_USER]);

    const result = await getAllUsers();

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe(MOCK_USER.email);
  });

  it("returns an empty array when no users exist", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getAllUsers();

    expect(result).toEqual([]);
  });
});

describe("user.service – getUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns user when found by email", async () => {
    mockFindFirst.mockResolvedValue(MOCK_USER);

    const result = await getUser("test@example.com");

    expect(result).toEqual(MOCK_USER);
  });

  it("throws CustomError when user is not found", async () => {
    mockFindFirst.mockResolvedValue(null);

    await expect(getUser("notfound@example.com")).rejects.toThrow(CustomError);
  });
});

describe("user.service – updateUser", () => {
  beforeEach(() => vi.clearAllMocks());

  it("hashes password and returns updated user", async () => {
    const updatedUser = { ...MOCK_USER, firstName: "Jane" };
    mockedHashPW.mockResolvedValue("new-hashed-pw");
    mockReturning.mockResolvedValue([updatedUser]);

    const result = await updateUser("user-1", {
      email: "test@example.com",
      firstName: "Jane",
      lastName: "Doe",
      password: "newpassword",
    });

    expect(mockedHashPW).toHaveBeenCalledWith("newpassword");
    expect(result).toEqual(updatedUser);
  });
});

describe("user.service – updateUserRule", () => {
  beforeEach(() => vi.clearAllMocks());

  it("updates user role to admin and returns updated user", async () => {
    const adminUser = { ...MOCK_USER, rule: "admin" };
    mockReturning.mockResolvedValue([adminUser]);

    const result = await updateUserRule("user-1", "admin");

    expect(result).toEqual(adminUser);
  });

  it("updates user role to user and returns updated user", async () => {
    const regularUser = { ...MOCK_USER, rule: "user" };
    mockReturning.mockResolvedValue([regularUser]);

    const result = await updateUserRule("user-1", "user");

    expect(result.rule).toBe("user");
  });
});
