import { describe, it, expect, vi, beforeEach } from "vitest";

// ── mock authTools ────────────────────────────────────────────────────────────
const mockGetSession = vi.fn();
vi.mock("@/lib/util/authTools", () => ({
  getSession: (args?: unknown) => mockGetSession(args),
  getUserFromToken: vi.fn(),
  hashPW: vi.fn(),
  comparePW: vi.fn(),
  createTokenForUser: vi.fn(),
  createSession: vi.fn(),
}));

// ── mock Gemini chatbot ───────────────────────────────────────────────────────
const mockGeminiChatbot = vi.fn();
vi.mock("@/lib/util/chatbot-gemini", () => ({
  default: (text: string) => mockGeminiChatbot(text),
}));

import { sendMessageAction } from "@/lib/actions/chat.action";

const MOCK_SESSION = {
  id: "session-1",
  userId: "user-1",
  expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
};

describe("chat action – sendMessageAction", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns AI response when user has a valid session", async () => {
    mockGetSession.mockResolvedValue(MOCK_SESSION);
    mockGeminiChatbot.mockResolvedValue("Hello! How can I help you with your skills?");

    const result = await sendMessageAction("What skills should I learn?");

    expect(mockGetSession).toHaveBeenCalledOnce();
    expect(mockGeminiChatbot).toHaveBeenCalledWith("What skills should I learn?");
    expect(result).toBe("Hello! How can I help you with your skills?");
  });

  it("throws Unauthorized error when session is null/undefined", async () => {
    mockGetSession.mockResolvedValue(null);

    await expect(sendMessageAction("Hello")).rejects.toThrow("Unauthorized");

    expect(mockGeminiChatbot).not.toHaveBeenCalled();
  });

  it("propagates errors from the Gemini chatbot", async () => {
    mockGetSession.mockResolvedValue(MOCK_SESSION);
    mockGeminiChatbot.mockRejectedValue(new Error("API quota exceeded"));

    await expect(sendMessageAction("Hello")).rejects.toThrow("API quota exceeded");
  });
});
