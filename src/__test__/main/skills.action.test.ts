import { describe, test, expect, vi, beforeEach } from "vitest";

// ── mock skills service ───────────────────────────────────────────────────────
const mockSkillRepository = vi.hoisted(() => ({
  findByUser: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));
vi.mock("@/lib/services/skills.service", () => ({
  skillRepository: mockSkillRepository,
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
vi.mock("next/cache", () => ({
  updateTag: vi.fn(),
  cacheTag: vi.fn(),
  revalidateTag: vi.fn(),
}));

import { createSkill, updateSkill, findByUser, deleteSkill } from "@/lib/actions/skills.action";

const MOCK_USER = {
  id: "user-1",
  email: "user@example.com",
  rule: "user",
  firstName: "John",
  lastName: "Doe",
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
];

describe("skills action – findByUser", () => {
  beforeEach(() => vi.clearAllMocks());

  test("returns parsed skills array from skillRepository", async () => {
    mockSkillRepository.findByUser.mockResolvedValue(MOCK_SKILLS);

    const result = await findByUser();

    expect(mockSkillRepository.findByUser).toHaveBeenCalledOnce();
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("TypeScript");
  });

  test("returns an empty array when user has no skills", async () => {
    mockSkillRepository.findByUser.mockResolvedValue([]);

    const result = await findByUser();

    expect(result).toEqual([]);
  });
});

describe("skills action – createSkill", () => {
  beforeEach(() => vi.clearAllMocks());

  test("creates a skill and returns success", async () => {
    mockGetUserFromToken.mockResolvedValue(MOCK_USER);
    mockSkillRepository.create.mockResolvedValue(undefined);

    const result = await createSkill({
      name: "GraphQL",
      category: "Backend",
      difficulty: "advanced",
    });

    expect(mockSkillRepository.create).toHaveBeenCalledWith({
      name: "GraphQL",
      category: "Backend",
      difficulty: "advanced",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("skills action – updateSkill", () => {
  beforeEach(() => vi.clearAllMocks());

  test("updates a skill and returns success", async () => {
    mockSkillRepository.update.mockResolvedValue(undefined);

    const result = await updateSkill("skill-1", {
      name: "TypeScript Advanced",
      category: "Programming",
      difficulty: "advanced",
    });

    expect(mockSkillRepository.update).toHaveBeenCalledWith("skill-1", {
      name: "TypeScript Advanced",
      category: "Programming",
      difficulty: "advanced",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("skills action – deleteSkill", () => {
  beforeEach(() => vi.clearAllMocks());

  test("deletes a skill and returns success", async () => {
    mockSkillRepository.delete.mockResolvedValue(undefined);

    const result = await deleteSkill("skill-1");

    expect(mockSkillRepository.delete).toHaveBeenCalledWith("skill-1");
    expect(result).toEqual({ success: true });
  });
});
