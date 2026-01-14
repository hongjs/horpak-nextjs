import React from "react";
import { render, screen, waitFor } from "../test-utils";
import ErrorBoundary from "../../components/ErrorBoundary";

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>Child component</div>;
};

describe("ErrorBoundary Component", () => {
  // Suppress console.error for cleaner test output
  const originalError = console.error;
  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it("should render children when there is no error", async () => {
    const { container } = render(
      <ErrorBoundary>
        <div data-testid="child">Child component</div>
      </ErrorBoundary>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Child component")).toBeInTheDocument();
    });
  });

  it("should render error UI when child component throws", async () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Check for error message
    await waitFor(() => {
      const errorHeading = screen.getByRole("heading", { level: 4 });
      expect(errorHeading).toHaveTextContent("Oops! Something went wrong.");

      // Check for contact info
      const contactInfo = screen.getByRole("heading", { level: 6 });
      expect(contactInfo).toHaveTextContent(
        /For more information please contact/,
      );
    });
  });

  it("should display MoodBad icon in error state", async () => {
    const { container } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    // Check for SVG icon (MUI icons render as SVG)
    await waitFor(() => {
      const icon = container.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  it("should call componentDidCatch when error occurs", async () => {
    // Restore original console.error for this test
    console.error = originalError;
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>,
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Uncaught error:",
        expect.any(Error),
        expect.any(Object),
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
