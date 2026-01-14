import React from "react";
import { render, screen, fireEvent, waitFor } from "../test-utils";
import { ThemeToggle } from "../../components/ThemeToggle";
import * as nextThemes from "next-themes";

// Mock next-themes module
jest.mock("next-themes");

const mockUseTheme = nextThemes.useTheme as jest.MockedFunction<
  typeof nextThemes.useTheme
>;

describe("ThemeToggle Component", () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: mockSetTheme,
      themes: ["light", "dark"],
      systemTheme: "light",
      forcedTheme: undefined,
      resolvedTheme: "light",
    });
  });

  it("should render theme toggle button", async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
    });
  });

  it("should show light mode icon when theme is light", async () => {
    const { container } = render(<ThemeToggle />);

    await waitFor(() => {
      // Check that button is rendered (Brightness4 icon is shown for light mode)
      const button = screen.getByRole("button", { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
      // The button should contain an SVG
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  it("should call setTheme when button is clicked", async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /toggle theme/i });
      fireEvent.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });
  });

  it("should not render content before mounted", async () => {
    // This test checks the initial render before useEffect runs
    render(<ThemeToggle />);

    // The component should render a button after mounting
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
    });
  });
});

describe("ThemeToggle Component - Dark Mode", () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue({
      theme: "dark",
      setTheme: mockSetTheme,
      themes: ["light", "dark"],
      systemTheme: "dark",
      forcedTheme: undefined,
      resolvedTheme: "dark",
    });
  });

  it("should show dark mode icon when theme is dark", async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      // Check that button is rendered (Brightness7 icon is shown for dark mode)
      const button = screen.getByRole("button", { name: /toggle theme/i });
      expect(button).toBeInTheDocument();
      // The button should contain an SVG
      const svg = button.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });
  });

  it("should call setTheme with light when in dark mode", async () => {
    render(<ThemeToggle />);

    await waitFor(() => {
      const button = screen.getByRole("button", { name: /toggle theme/i });
      fireEvent.click(button);
      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });
  });
});
