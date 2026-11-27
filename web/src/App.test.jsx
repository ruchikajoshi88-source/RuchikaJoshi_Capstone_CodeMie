import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import App from "./App.jsx";

describe("App layout", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("places DownloadBrochureCard in the right column between Tour Summary and Support", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ bookings: [] }) })));
    render(<App />);
    await waitFor(() => screen.getByTestId("bookings-empty"));

    const right = screen.getByTestId("right-column");
    const ids = Array.from(right.children).map((c) => c.getAttribute("data-testid"));
    expect(ids).toEqual(["tour-summary-card", "download-brochure-card", "support-card"]);

    const left = screen.getByTestId("left-column");
    expect(left.contains(screen.getByTestId("booking-form"))).toBe(true);
    expect(left.contains(screen.getByTestId("bookings-summary-card"))).toBe(true);
  });

  it("uses only kebab-case data-testid values", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ bookings: [] }) })));
    const { container } = render(<App />);
    await waitFor(() => screen.getByTestId("bookings-empty"));
    const bad = Array.from(container.querySelectorAll("[data-testid]"))
      .map((el) => el.getAttribute("data-testid"))
      .filter((v) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(v));
    expect(bad).toEqual([]);
  });
});
