import { describe, test, expect, vi, beforeEach } from "vitest";

// ── mock stats service ────────────────────────────────────────────────────────
const mockStatsRepository = vi.hoisted(() => ({
  findByUser: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
}));
vi.mock("@/lib/services/stats.service", () => ({
  statsRepository: mockStatsRepository,
}));

import { getStats, createState, deleteState } from "@/lib/actions/stats.action";

const MOCK_STATS: Stats[] = [
  {
    id: "stat-1",
    userId: "user-1",
    skillId: "skill-1",
    hours: 3,
    note: "Good session",
    completionPercent: 60,
    createdAt: "2024-01-01",
  },
];

describe("stats action – getStats", () => {
  beforeEach(() => vi.clearAllMocks());

  test("returns stats from statsRepository", async () => {
    mockStatsRepository.findByUser.mockResolvedValue(MOCK_STATS);

    const result = await getStats();

    expect(mockStatsRepository.findByUser).toHaveBeenCalledOnce();
    expect(result).toEqual(MOCK_STATS);
  });

  test("returns an empty array when no stats exist", async () => {
    mockStatsRepository.findByUser.mockResolvedValue([]);

    const result = await getStats();

    expect(result).toEqual([]);
  });
});

describe("stats action – createState", () => {
  beforeEach(() => vi.clearAllMocks());

  test("delegates to statsRepository.create with correct data", async () => {
    mockStatsRepository.create.mockResolvedValue(undefined);

    await createState({
      skillId: "skill-1",
      hours: 2,
      note: "Practiced today",
      completionPercent: 40,
    });

    expect(mockStatsRepository.create).toHaveBeenCalledWith({
      skillId: "skill-1",
      hours: 2,
      note: "Practiced today",
      completionPercent: 40,
    });
  });
});

describe("stats action – deleteState", () => {
  beforeEach(() => vi.clearAllMocks());

  test("delegates to statsRepository.delete with correct id", async () => {
    mockStatsRepository.delete.mockResolvedValue(undefined);

    await deleteState("stat-1");

    expect(mockStatsRepository.delete).toHaveBeenCalledWith("stat-1");
  });
});
