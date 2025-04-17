import { render, screen } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material";
import ContentTypeLabel from "./ContentTypeLabel";
import { describe, it, expect } from "vitest";

describe("ContentTypeLabel", () => {
  const theme = createTheme();

  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
  };

  it("renders movie label correctly", () => {
    renderWithTheme(<ContentTypeLabel contentType="movie" />);
    expect(screen.getByText("Movies")).toBeDefined();
  });

  it("renders serie label correctly", () => {
    renderWithTheme(<ContentTypeLabel contentType="serie" />);
    expect(screen.getByText("Series")).toBeDefined();
  });

  it("renders season label correctly", () => {
    renderWithTheme(<ContentTypeLabel contentType="season" />);
    expect(screen.getByText("Seasons")).toBeDefined();
  });

  it("renders episode label correctly", () => {
    renderWithTheme(<ContentTypeLabel contentType="episode" />);
    expect(screen.getByText("Episodes")).toBeDefined();
  });

  it("renders actor label correctly", () => {
    renderWithTheme(<ContentTypeLabel contentType="actor" />);
    expect(screen.getByText("Actors")).toBeDefined();
  });

  it("renders crew label correctly", () => {
    renderWithTheme(<ContentTypeLabel contentType="crew" />);
    expect(screen.getByText("Crew")).toBeDefined();
  });

  it("renders user label correctly", () => {
    renderWithTheme(<ContentTypeLabel contentType="user" />);
    expect(screen.getByText("Users")).toBeDefined();
  });

  it("renders nothing when contentType is null", () => {
    const { container } = renderWithTheme(<ContentTypeLabel contentType={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("applies small size when specified", () => {
    renderWithTheme(<ContentTypeLabel contentType="movie" size="small" />);
    const chip = screen.getByText("Movies").closest(".MuiChip-root");
    expect(chip?.className).toContain("MuiChip-sizeSmall");
  });

  it("applies large size with custom styling", () => {
    renderWithTheme(<ContentTypeLabel contentType="movie" size="large" />);
    const chip = screen.getByText("Movies").closest(".MuiChip-root");
    expect(chip).toBeDefined();
  });

  it("applies outlined variant when specified", () => {
    renderWithTheme(<ContentTypeLabel contentType="movie" variant="outlined" />);
    const chip = screen.getByText("Movies").closest(".MuiChip-root");
    expect(chip?.className).toContain("MuiChip-outlined");
  });
});
