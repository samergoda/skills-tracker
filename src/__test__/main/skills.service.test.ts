import { describe, expect, vi, beforeEach, test } from "vitest";

// ── mock drizzle-orm ──────────────────────────────────────────────────────────
vi.mock("drizzle-orm", () => ({
  eq: vi.fn((col: unknown, val: unknown) => ({ col, val })),
  and: vi.fn((...args: unknown[]) => ({ args })),
}));

// ── mock db ───────────────────────────────────────────────────────────────────
const mockInsertValues = vi.fn().mockResolvedValue(undefined);
const mockSet = vi.fn().mockReturnThis();
const mockWhere = vi.fn().mockResolvedValue(undefined);
const mockDeleteWhere = vi.fn().mockResolvedValue(undefined);

vi.mock("@/db/db", () => ({
  db: {
    insert: () => ({ values: mockInsertValues }),
    update: () => ({ set: mockSet.mockReturnValue({ where: mockWhere }) }),
    delete: () => ({ where: mockDeleteWhere }),
  },
}));

// ── mock schema ───────────────────────────────────────────────────────────────
vi.mock("@/db/schema", () => ({
  skills: {
    id: "id",
    ownerId: "ownerId",
    name: "name",
    category: "category",
    difficulty: "difficulty",
    is_public: "is_public",
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

// ── mock skillsTools ──────────────────────────────────────────────────────────
const mockFindSkillsByUserId = vi.fn();
const mockFindAllSkills = vi.fn();
vi.mock("@/lib/util/skillsTools", () => ({
  findSkillsByUserId: (userId: string) => mockFindSkillsByUserId(userId),
  findAllSkills: () => mockFindAllSkills(),
}));

// ── mock next/cache ───────────────────────────────────────────────────────────
vi.mock("next/cache", () => ({
  cacheTag: vi.fn(),
  revalidateTag: vi.fn(),
}));

import { skillRepository } from "@/lib/services/skills.service";

const MOCK_REGULAR_USER = {
  id: "user-1",
  email: "user@example.com",
  rule: "user",
  firstName: "John",
  lastName: "Doe",
};

const MOCK_ADMIN_USER = {
  id: "admin-1",
  email: "admin@example.com",
  rule: "admin",
  firstName: "Admin",
  lastName: "User",
};

const MOCK_SKILLS = [
  {
    id: "skill-1",
    name: "TypeScript",
    category: "Programming",
    difficulty: "intermediate",
    is_public: "1",
    ownerId: "user-1",
    createdAt: "2024-01-01",
  },
  {
    id: "skill-2",
    name: "React",
    category: "Frontend",
    difficulty: "beginner",
    is_public: "1",
    ownerId: "user-1",
    createdAt: "2024-01-02",
  },
];

describe("skillRepository – findByUser", () => {
  beforeEach(() => vi.clearAllMocks());

  test("returns only user's skills for a regular user", async () => {
    mockGetUserFromToken.mockResolvedValue(MOCK_REGULAR_USER);
    mockFindSkillsByUserId.mockResolvedValue(MOCK_SKILLS);

    const result = await skillRepository.findByUser();

    expect(mockFindSkillsByUserId).toHaveBeenCalledWith(MOCK_REGULAR_USER.id);
    expect(mockFindAllSkills).not.toHaveBeenCalled();
    expect(result).toEqual(MOCK_SKILLS);
  });

  test("returns all skills for an admin user", async () => {
    mockGetUserFromToken.mockResolvedValue(MOCK_ADMIN_USER);
    mockFindAllSkills.mockResolvedValue(MOCK_SKILLS);

    const result = await skillRepository.findByUser();

    expect(mockFindAllSkills).toHaveBeenCalled();
    expect(mockFindSkillsByUserId).not.toHaveBeenCalled();
    expect(result).toEqual(MOCK_SKILLS);
  });
});

describe("skillRepository – create", () => {
  beforeEach(() => vi.clearAllMocks());

  test("inserts a new skill with the correct owner id", async () => {
    mockGetUserFromToken.mockResolvedValue(MOCK_REGULAR_USER);

    await skillRepository.create({
      name: "GraphQL",
      category: "Backend",
      difficulty: "advanced",
    });

    expect(mockInsertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "GraphQL",
        category: "Backend",
        difficulty: "advanced",
        ownerId: MOCK_REGULAR_USER.id,
        is_public: "1",
      }),
    );
  });
});

describe("skillRepository – update", () => {
  beforeEach(() => vi.clearAllMocks());

  test("calls db.update with new skill data", async () => {
    await skillRepository.update("skill-1", {
      name: "TypeScript Pro",
      category: "Programming",
      difficulty: "advanced",
    });

    expect(mockSet).toHaveBeenCalledWith({
      name: "TypeScript Pro",
      category: "Programming",
      difficulty: "advanced",
    });
    expect(mockWhere).toHaveBeenCalled();
  });
});

describe("skillRepository – delete", () => {
  beforeEach(() => vi.clearAllMocks());

  test("deletes a skill that belongs to the authenticated user", async () => {
    mockGetUserFromToken.mockResolvedValue(MOCK_REGULAR_USER);

    await skillRepository.delete("skill-1");

    expect(mockDeleteWhere).toHaveBeenCalled();
  });
});
