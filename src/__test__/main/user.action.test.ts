import { describe, test, expect, vi, beforeEach } from "vitest";

// ── mock user service ─────────────────────────────────────────────────────────
const mockGetUser = vi.fn();
const mockUpdateUser = vi.fn();
const mockUpdateUserRule = vi.fn();
const mockGetAllUsers = vi.fn();

vi.mock("@/lib/services/user.service", () => ({
  getUser: (email: string) => mockGetUser(email),
  updateUser: (id: string, data: unknown) => mockUpdateUser(id, data),
  updateUserRule: (id: string, role: string) => mockUpdateUserRule(id, role),
  getAllUsers: () => mockGetAllUsers(),
}));

// ── mock authTools ────────────────────────────────────────────────────────────
const mockGetUserFromToken = vi.fn();
vi.mock("@/lib/util/authTools", () => ({
  getUserFromToken: (args?: unknown) => mockGetUserFromToken(args),
  hashPW: vi.fn(),
  comparePW: vi.fn(),
  createTokenForUser: vi.fn(),
  getSession: vi.fn(),
  createSession: vi.fn(),
}));

import { getUserAction, updateUserAction, updateUserRuleAction, getAllUsersAction } from "@/lib/actions/user.action";
import { CustomError } from "@/lib/util/customError";

const MOCK_USER = {
  id: "user-1",
  email: "test@example.com",
  rule: "user" as const,
  firstName: "John",
  lastName: "Doe",
  createdAt: "2024-01-01",
};

describe("user action – getUserAction", () => {
  beforeEach(() => vi.clearAllMocks());

  test("returns user based on token email", async () => {
    mockGetUserFromToken.mockResolvedValue({ email: MOCK_USER.email });
    mockGetUser.mockResolvedValue({ ...MOCK_USER, password: "hashed" });

    const result = await getUserAction();

    expect(mockGetUserFromToken).toHaveBeenCalledOnce();
    expect(mockGetUser).toHaveBeenCalledWith(MOCK_USER.email);
    expect(result).toHaveProperty("email", MOCK_USER.email);
  });
});

describe("user action – updateUserAction", () => {
  beforeEach(() => vi.clearAllMocks());

  test("updates user with data from the request and current user id", async () => {
    mockGetUserFromToken.mockResolvedValue({ id: MOCK_USER.id });
    mockUpdateUser.mockResolvedValue(MOCK_USER);

    const result = await updateUserAction({
      email: "new@example.com",
      firstName: "Jane",
      lastName: "Smith",
      password: "newpassword",
    });

    expect(mockUpdateUser).toHaveBeenCalledWith(MOCK_USER.id, {
      email: "new@example.com",
      firstName: "Jane",
      lastName: "Smith",
      password: "newpassword",
    });
    expect(result).toEqual(MOCK_USER);
  });
});

describe("user action – updateUserRuleAction", () => {
  beforeEach(() => vi.clearAllMocks());

  test("updates role to admin and returns updated user", async () => {
    const adminUser = { ...MOCK_USER, rule: "admin" };
    mockUpdateUserRule.mockResolvedValue(adminUser);

    const result = await updateUserRuleAction("user-1", "admin");

    expect(mockUpdateUserRule).toHaveBeenCalledWith("user-1", "admin");
    expect(result).toEqual(adminUser);
  });

  test("returns CustomError instance when id or rule is missing", async () => {
    const result = await updateUserRuleAction("", "admin");

    expect(result).toBeInstanceOf(CustomError);
    expect(mockUpdateUserRule).not.toHaveBeenCalled();
  });
});

describe("user action – getAllUsersAction", () => {
  beforeEach(() => vi.clearAllMocks());

  test("returns all users", async () => {
    mockGetAllUsers.mockResolvedValue([MOCK_USER]);

    const result = await getAllUsersAction();

    expect(mockGetAllUsers).toHaveBeenCalledOnce();
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe(MOCK_USER.email);
  });

  test("returns empty array when no users exist", async () => {
    mockGetAllUsers.mockResolvedValue([]);

    const result = await getAllUsersAction();

    expect(result).toEqual([]);
  });
});
