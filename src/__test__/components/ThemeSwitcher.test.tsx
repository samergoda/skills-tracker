import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeSwitcher } from "@/components/features/theme-switcher";
import { describe, test, expect, vi, beforeEach } from "vitest";
import * as nextThemes from "next-themes";

// Mock next-themes so we can spy on the setTheme function
vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

describe("ThemeSwitcher Component", () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("toggles theme from light to dark when clicked", async () => {
    // 1. Setup mock to return the current theme as 'light'
    vi.mocked(nextThemes.useTheme).mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
      themes: ["light", "dark"],
      systemTheme: "light",
    });

    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    // 2. Find the theme switcher button
    const button = screen.getByRole("button", { name: /toggle theme/i });

    // 3. User clicks the button using userEvent
    await user.click(button);

    // 4. Verify the correct logic happened (setTheme called with 'dark')
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  test("toggles theme from dark to light when clicked", async () => {
    // 1. Setup mock to return the current theme as 'dark'
    vi.mocked(nextThemes.useTheme).mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
      themes: ["light", "dark"],
      systemTheme: "dark",
    });

    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    const button = screen.getByRole("button", { name: /toggle theme/i });

    // 3. User clicks the button using userEvent
    await user.click(button);

    // 4. Verify the correct logic happened (setTheme called with 'light')
    expect(mockSetTheme).toHaveBeenCalledWith("light");
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });
});
