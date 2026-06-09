import { describe, test, expect, vi, beforeEach } from "vitest";

// ── mock drizzle-orm ──────────────────────────────────────────────────────────
vi.mock("drizzle-orm", () => ({
  eq: vi.fn((col: unknown, val: unknown) => ({ col, val })),
}));

// ── mock db ───────────────────────────────────────────────────────────────────
const mockFindMany = vi.fn();
const mockInsertValues = vi.fn().mockResolvedValue(undefined);
const mockDeleteWhere = vi.fn().mockResolvedValue(undefined);

vi.mock("@/db/db", () => ({
  db: {
    query: {
      progressEntries: {
        findMany: (args: unknown) => mockFindMany(args),
      },
    },
    insert: () => ({ values: mockInsertValues }),
    delete: () => ({ where: mockDeleteWhere }),
  },
}));

// ── mock schema ───────────────────────────────────────────────────────────────
vi.mock("@/db/schema", () => ({
  progressEntries: {
    id: "id",
    userId: "userId",
    skillId: "skillId",
    hours: "hours",
    note: "note",
    completionPercent: "completionPercent",
  },
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

// ── mock next/cache ───────────────────────────────────────────────────────────
const mockRevalidateTag = vi.fn();
vi.mock("next/cache", () => ({
  revalidateTag: (...args: unknown[]) => mockRevalidateTag(...args),
  cacheTag: vi.fn(),
}));

import { statsRepository } from "@/lib/services/stats.service";

const MOCK_USER = {
  id: "user-1",
  email: "user@example.com",
  rule: "user",
  firstName: "John",
  lastName: "Doe",
};

const MOCK_STATS = [
  {
    id: "stat-1",
    userId: "user-1",
    skillId: "skill-1",
    hours: 3,
    note: "Good progress",
    completionPercent: 60,
  },
  {
    id: "stat-2",
    userId: "user-1",
    skillId: "skill-2",
    hours: 5,
    note: "Completed chapter",
    completionPercent: 100,
  },
];

describe("statsRepository – findByUser", () => {
  beforeEach(() => vi.clearAllMocks());

  test("queries progress entries for the authenticated user", async () => {
    mockGetUserFromToken.mockResolvedValue(MOCK_USER);
    mockFindMany.mockResolvedValue(MOCK_STATS);

    const result = await statsRepository.findByUser();

    expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.anything() }));
    expect(result).toEqual(MOCK_STATS);
  });

  test("returns empty array when user has no stats", async () => {
    mockGetUserFromToken.mockResolvedValue(MOCK_USER);
    mockFindMany.mockResolvedValue([]);

    const result = await statsRepository.findByUser();

    expect(result).toEqual([]);
  });
});

describe("statsRepository – create", () => {
  beforeEach(() => vi.clearAllMocks());

  test("inserts progress entry and revalidates the cache tag", async () => {
    mockGetUserFromToken.mockResolvedValue(MOCK_USER);

    await statsRepository.create({
      skillId: "skill-1",
      hours: 2,
      note: "Practiced today",
      completionPercent: 40,
    });

    expect(mockInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: MOCK_USER.id,
        skillId: "skill-1",
        hours: 2,
        note: "Practiced today",
        completionPercent: 40,
      }),
    );
    expect(mockRevalidateTag).toHaveBeenCalledWith(`stats-user-${MOCK_USER.id}`, "max");
  });
});

describe("statsRepository – delete", () => {
  beforeEach(() => vi.clearAllMocks());

  test("deletes stat entry by id and revalidates the cache tag", async () => {
    mockGetUserFromToken.mockResolvedValue(MOCK_USER);

    await statsRepository.delete("stat-1");

    expect(mockDeleteWhere).toHaveBeenCalled();
    expect(mockRevalidateTag).toHaveBeenCalledWith(`stats-user-${MOCK_USER.id}`, "max");
  });
});
