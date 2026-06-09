import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SubmitButton from "@/components/shared/SubmitButton";
import { describe, test, expect, vi } from "vitest";

describe("SubmitButton Component", () => {
  test("submits the surrounding form when clicked", async () => {
    // 1. Setup the userEvent instance
    const user = userEvent.setup();
    
    const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());

    // 2. Render the component in a test environment
    render(
      <form onSubmit={handleSubmit}>
        <SubmitButton text="Save Profile" disabled={false} />
      </form>
    );

    // 3. Find the element in the virtual DOM
    const button = screen.getByRole("button", { name: /save profile/i });
    expect(button).not.toBeDisabled();
    
    // 4. Use userEvent to accurately simulate a real user clicking the button
    await user.click(button);

    // 5. Assert the expected outcome
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  test("cannot submit the form when disabled", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());

    render(
      <form onSubmit={handleSubmit}>
        <SubmitButton text="Save Profile" disabled={true} />
      </form>
    );

    const button = screen.getByRole("button", { name: /save profile/i });
    
    // Attempting to click a disabled button
    await user.click(button);

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });
});
