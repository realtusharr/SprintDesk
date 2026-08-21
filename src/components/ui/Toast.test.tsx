import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ToastContainer from "./Toast";
import { useToastStore } from "../../store/toast.store";
import { useToast } from "../../hooks/useToast";

function TestTrigger() {
  const toast = useToast();

  return (
    <button type="button" onClick={() => toast.success("Saved successfully")}>
      trigger
    </button>
  );
}

describe("toast system", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a toast when one is added and removes it on dismiss", () => {
    render(<ToastContainer />);

    expect(screen.queryByText("Saved successfully")).not.toBeInTheDocument();

    act(() => {
      useToastStore.getState().addToast("Saved successfully", "success");
    });

    expect(screen.getByText("Saved successfully")).toBeInTheDocument();

    const dismissButton = screen.getByRole("button", {
      name: "Dismiss notification",
    });

    fireEvent.click(dismissButton);

    expect(screen.queryByText("Saved successfully")).not.toBeInTheDocument();
  });

  it("exposes a useToast helper that adds toasts from components", () => {
    render(
      <>
        <TestTrigger />
        <ToastContainer />
      </>
    );

    fireEvent.click(screen.getByRole("button", { name: "trigger" }));

    expect(screen.getByText("Saved successfully")).toBeInTheDocument();
  });

  it("auto-dismisses after the configured duration", () => {
    vi.useFakeTimers();

    render(<ToastContainer />);

    act(() => {
      useToastStore.getState().addToast("Temporary message", "info", 3000);
    });

    expect(screen.getByText("Temporary message")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3100);
    });

    expect(screen.queryByText("Temporary message")).not.toBeInTheDocument();
  });
});
